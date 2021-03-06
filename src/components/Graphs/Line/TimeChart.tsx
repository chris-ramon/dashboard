import * as moment from "moment";
import * as React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface LineProps {
    dataKey: string;
    type?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter" | Function;
    dot?: boolean;
    name?: string;
    stroke?: string;
}

export class TimeData {
    time: Date;
    timeValue: number;

    constructor(time: Date | moment.Moment) {
        this.time = (time instanceof Date) ? time : time.toDate();
        this.timeValue = this.time.getTime();
    }

    compare(data: TimeData) {
        return this.timeValue - data.timeValue;
    }
}

interface TimeChartProps {
    data: TimeData[];
    lines: LineProps[];
    tickFormat?: string;
    labelFormat?: string;
}

interface TimeChartState {
    ticks: number[];
    lines: JSX.Element[];
}

class TimeChart extends React.Component<TimeChartProps, TimeChartState> {

    static defaultLineProp: LineProps = {
        dataKey: "",
        dot: false,
        type: "monotone"
    };

    static createTicks(props: TimeChartProps): number[] {
        const data: TimeData[] = props.data;
        if (data.length === 0) {
            return [];
        }

        let highest: moment.Moment = moment(data[0].time).startOf("day");
        let lowest: moment.Moment = moment(data[0].time).startOf("day");
        let ticks: number[] = [ data[0].timeValue ];
        for (let i = 1; i < data.length; ++i) {
            const currentDate: moment.Moment = moment(data[i].time).startOf("day");
            if (currentDate.isAfter(highest)) {
                ticks.push(data[i].timeValue);
                highest = currentDate;
            } else if (currentDate.isBefore(lowest)) {
                ticks.unshift(data[i].timeValue);
                lowest = currentDate;
            }
        }
        return ticks;
    }

    static createLines(props: TimeChartProps): JSX.Element[] {
        const lines: JSX.Element[] = [];
        let i = 0;
        for (let line of props.lines) {
            const prop = { ...TimeChart.defaultLineProp, ...line };
            lines.push(<Line key={i++} {...prop} />);
        }
        return lines;
    }

    constructor(props: TimeChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
        this.labelFormat = this.labelFormat.bind(this);

        this.state = {
            ticks: TimeChart.createTicks(props),
            lines: TimeChart.createLines(props)
        };
    }

    static defaultProps: TimeChartProps = {
        data: [],
        lines: [],
        tickFormat: "MM/DD",
        labelFormat: "MM/DD hh:mm a"
    };

    componentWillReceiveProps(nextProps: TimeChartProps, context: any) {
        this.state.ticks = TimeChart.createTicks(nextProps);
        this.state.lines = TimeChart.createLines(nextProps);
        this.setState(this.state);
    }

    tickFormat(time: Date): string {
        return moment(time).format(this.props.tickFormat);
    }

    labelFormat(time: string): string {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart margin={{ left: -20 }} data={this.props.data} >
                    <XAxis dataKey="timeValue" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis />
                    <CartesianGrid fill="#fff" strokeDasharray="3 3" />
                    <Tooltip labelFormatter={this.labelFormat} />
                    {TimeChart.createLines(this.props)}
                    <Legend verticalAlign="top" align="center" height={36} payload={[{ value: "Daily Events", type: "line", id: "ID01" }]} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default TimeChart;
