import * as moment from "moment";
import * as React from "react";

import TimeChart, { LineProps, TimeData } from "../../components/Graphs/Line/TimeChart";
import Query, { EndTimeParameter, FillGapsParameter, GranularityParameter, SortParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { AMAZON_ORANGE, BLACK, GOOGLE_GREEN } from "../../utils/colors";
import SourceUtils from "../../utils/Source";
import { DataLoader, DataState, GenericStateHandler, Loader } from "./DataLoader";

export interface LineProps extends LineProps {

}

interface SourceTimeSummaryProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
    lines?: LineProps[];
}

interface SourceTimeSummaryState {
    timeData: TimeData[];
    timeLoaded: DataState;
}

class TimeSortParameter extends SortParameter {
    parameter = "date_sort";
}

export class SourceTimeSummary extends React.Component<SourceTimeSummaryProps, SourceTimeSummaryState> {
    static lines: LineProps[] = [{
        dataKey: "total",
        name: "Total",
        stroke: BLACK
    }, {
        dataKey: "Amazon.Alexa",
        name: "Alexa",
        stroke: AMAZON_ORANGE
    }, {
        dataKey: "Google.Home",
        name: "Home",
        stroke: GOOGLE_GREEN
    }];

    static defaultProps: SourceTimeSummaryProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        lines: SourceTimeSummary.lines
    };

    constructor(props: SourceTimeSummaryProps) {
        super(props);

        this.setState = this.setState.bind(this);

        this.state = {
            timeData: [],
            timeLoaded: DataState.LOADING
        };
    }

    componentWillReceiveProps(nextProps: SourceTimeSummaryProps, context: any) {
        if (nextProps.source) {
            if (!SourceUtils.equals(nextProps.source, this.props.source) || !nextProps.startDate.isSame(this.props.startDate) || !nextProps.endDate.isSame(this.props.endDate)) {
                this.retrieveTimeSummary(nextProps.source, nextProps.startDate, nextProps.endDate);
            }
        } else {
            this.setState({
                timeData: [],
                timeLoaded: DataState.LOADED
            });
        }
    }

    componentWillMount() {
        if (this.props.source) {
            this.retrieveTimeSummary(this.props.source, this.props.startDate, this.props.endDate);
        } else {
            this.setState({
                timeData: [],
                timeLoaded: DataState.LOADED
            });
        }
    }

    retrieveTimeSummary(source: Source, start: moment.Moment, end: moment.Moment) {
        const dataLoader: DataLoader<LogService.TimeSummary, PageTimeData[]> = {
            loadData: function (query: Query): Promise<LogService.TimeSummary> {
                return LogService.getTimeSummary(query);
            },
            map: function (data: LogService.TimeSummary): any[] {
                const mergedData = mergeTimeSummary(data);
                return mergedData;
            },
        };

        const callback: GenericStateHandler<PageTimeData[]> = new GenericStateHandler(this.state, "timeLoaded", "timeData", this.setState);
        const onLoaded = callback.onLoaded.bind(callback);
        callback.onLoaded = function (data: PageTimeData[]) {
            if (data.length === 0) {
                data = defaultPageTimeData(start, end);
            }
            onLoaded(data);
        };
        const loader: Loader<LogService.TimeSummary, PageTimeData[]> = new Loader<LogService.TimeSummary, PageTimeData[]>(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(start));
        query.add(new EndTimeParameter(end));
        query.add(new GranularityParameter("hour"));
        query.add(new TimeSortParameter("asc"));
        query.add(new FillGapsParameter(true));

        loader.load(query);
    }

    render() {
        const { timeData } = this.state;
        const { lines } = this.props;

        return (
            <TimeChart
                lines={lines}
                data={timeData} />
        );
    }
}

export default SourceTimeSummary;

class PageTimeData extends TimeData {
    total?: number;
    "Amazon.Alexa"?: number;
    "Google.Home"?: number;

    constructor(time: Date | moment.Moment) {
        super(time);
        this["total"] = 0;
        this["Amazon.Alexa"] = 0;
        this["Google.Home"] = 0;
    }
}

function defaultPageTimeData(start: moment.Moment, end: moment.Moment): PageTimeData[] {
    let data: PageTimeData[] = [];
    let currentDate: moment.Moment = start.clone();
    while (currentDate.isBefore(end)) {
        const newData: PageTimeData = new PageTimeData(currentDate);
        newData.total = 0;
        newData["Amazon.Alexa"] = 0;
        newData["Google.Home"] = 0;
        data.push(newData);
        currentDate.add(1, "days");
    }
    return data;
}

function mergeTimeSummary(summary: LogService.TimeSummary): PageTimeData[] {
    const merger: any = {};

    joinBuckets(merger, summary.buckets, "total");
    joinBuckets(merger, summary.amazonBuckets, "Amazon.Alexa");
    joinBuckets(merger, summary.googleBuckets, "Google.Home");

    const values = Object.keys(merger)
        .map(key => merger[key])
        .sort(function(b1: PageTimeData, b2: PageTimeData): number {
            return b1.compare(b2);
        });
    return values;
}

function joinBuckets(merger: any, buckets: LogService.TimeBucket[], key: "total" | LogService.Origin) {
    for (let bucket of buckets) {
        const date = new Date(bucket.date);
        date.setMinutes(0, 0, 0);
        const dateString = date.toISOString();
        let obj: PageTimeData = merger[dateString];
        if (!obj) {
            obj = new PageTimeData(date);
        }
        obj[key] = bucket.count;
        merger[dateString] = obj;
    }
}