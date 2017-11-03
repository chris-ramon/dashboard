import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { NAVY_BLUE, OFF_WHITE } from "../../utils/colors";

const DEFAULT_TEXT_FORMAT = "MMM Do, YYYY";

interface SourceHeaderProps {
    source: Source;
    rootStyle?: React.CSSProperties;
    tileColor?: string;
    isOwner?: boolean;
}

interface SourceHeaderState {

}

export class SourceHeader extends React.Component<SourceHeaderProps, SourceHeaderState> {

    static DEFAULT_SOURCE: Source = new Source({
        name: "N/A",
        secretKey: "N/A",
        id: "N/A",
        created: new Date(0, 0, 0, 0, 0, 0, 0)
    });

    static defaultProps: SourceHeaderProps = {
        source: SourceHeader.DEFAULT_SOURCE,
        rootStyle: { backgroundColor: NAVY_BLUE, paddingBottom: "0px", paddingTop: "0px" },
        tileColor: OFF_WHITE
    };

    render() {
        const { source, rootStyle, tileColor } = this.props;
        const dataTileStyle = { inputTextColor: tileColor, bottomBorderColor: "rgb(36, 48, 54)" };
        const createdDate = (source.created) ? moment(source.created).format(DEFAULT_TEXT_FORMAT) : "N/A";
        return (
            <Grid style={rootStyle}>
                <Cell col={3} hidePhone={true}>
                    <DataTile
                        theme={dataTileStyle}
                        value={source.name}
                        label={"Name"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={source.id}
                        label={"ID"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={createdDate}
                        label={"Created"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={source.secretKey}
                        label={"Secret Key"}
                        hidden={true}
                        showable={this.props.isOwner} />
                </Cell>
            </Grid>
        );
    }
}

export default SourceHeader;
