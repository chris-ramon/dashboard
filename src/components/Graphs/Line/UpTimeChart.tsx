import * as moment from "moment";
import * as React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartUtils from "../../../utils/chart";

export interface LineProps {
    dataKey: string;
    type?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter" | Function;
    dot?: boolean;
    name?: string;
    stroke?: string;
}

export class UpTimeData {
    timestamp?: number;
    status?: number;
}

interface UpTimeChartProps {
    data: UpTimeData[];
    status?: number;
    tickFormat?: string;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    labelFormat?: string;
}

interface UpTimeChartState {
    ticks: number[];
}

class UpTimeChart extends React.Component<UpTimeChartProps, UpTimeChartState> {

    static defaultLineProp: LineProps = {
        dataKey: "",
        dot: false,
        type: "monotone"
    };

    static createTicks(props: UpTimeChartProps): number[] {
      const data: UpTimeData[] = props.data;
      if (data.length === 0) {
        return [];
      }
      return ChartUtils.createTicks(data, "timestamp");
    }

    constructor(props: UpTimeChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
        this.labelFormat = this.labelFormat.bind(this);

        this.state = {
          ticks: UpTimeChart.createTicks(props)
        };
    }

    tickFormat(time: Date): string {
      return moment(time).format(this.props.tickFormat);
    }

    YTickFormat(statusValue: number): string {
      return statusValue === 1 ? "Up" : " ";
    }

    static defaultProps: UpTimeChartProps = {
        data: [],
        tickFormat: "MM/DD",
        labelFormat: "MM/DD hh:mm a",
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        status: 1,
    };

    componentWillReceiveProps(nextProps: UpTimeChartProps, context: any) {
        this.state.ticks = UpTimeChart.createTicks(nextProps);
        this.setState(this.state);
    }

    labelFormat(time: string): string {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart margin={{ left: -20 }}  data={this.props.data} >
                    <XAxis dataKey="timestamp" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis dataKey="statusValue" tickCount={4} tickFormatter={this.YTickFormat} domain={[0, 1.5]} />} />
                    <CartesianGrid fill={this.props.status ? "#33a532" : "#c44b4b"} stroke={this.props.status ? "#33a532" : "#c44b4b"} width={0} />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line dataKey="statusValue" dot={false} stroke="#fff" />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default UpTimeChart;
