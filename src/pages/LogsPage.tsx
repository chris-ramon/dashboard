import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ConversationListView } from "../components/ConversationListView";
import { Cell, Grid } from "../components/Grid";
import Interaction from "../components/Interaction";
import Conversation from "../models/conversation";
import ConversationList from "../models/conversation-list";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";
import browser from "../utils/browser";

interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

interface LogsPageState {
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);

        this.state = {
            source: props.source,
            request: undefined,
            response: undefined,
            outputs: []
        };
    }

    // Tracks the previous size for resize events
    previousSize: { width: number, height: number } = { width: window.innerWidth, height: window.innerWidth };

    componentDidMount() {
        window.addEventListener("resize", (event) => {
            // The case where the browser got smaller
            if (window.innerWidth < browser.mobileWidthThreshold && this.previousSize.width >= browser.mobileWidthThreshold) {
                this.forceUpdate();
            }

            // The case where the browser got bigger
            if (window.innerWidth >= browser.mobileWidthThreshold && this.previousSize.width < browser.mobileWidthThreshold) {
                this.forceUpdate();
            }

            // Update the previous size
            this.previousSize = { width: window.innerWidth, height: window.innerHeight };
        });
    }

    setCurrentSourceFromSources(source: Source) {
        if (source) {
            this.props.getLogs(source.secretKey);
            this.setState({
                source: source,
                request: this.state.request,
                response: this.state.response,
                outputs: this.state.outputs
            });
        }
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any): void {
        if (this.state.source === undefined) {
            this.setCurrentSourceFromSources(nextProps.source);
        }
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.setState({
            source: this.state.source,
            request: conversation.request,
            response: conversation.response,
            outputs: conversation.outputs
        });
    }

    getContentHeight() {
        if (document.getElementsByClassName !== undefined) {
            let mains = document.getElementsByClassName("mdl-layout__content");
            if (mains.length > 0) {
                let main: Element = mains.item(0);
                return main.clientHeight;
            }
        }
        // Return default height, this is when the page isn't fully rendered
        //  or when we are unit testing
        return 200;
    }

    render() {
        return (
            <Grid>
                <Cell col={6} phone={4} tablet={4}>
                    <div style={{ maxHeight: this.getContentHeight() - 30, overflowY: "scroll" }}>
                        <ConversationListView
                            conversations={ConversationList.fromLogs(this.props.logs)}
                            expandListItemWhenActive={browser.isMobileWidth()}
                            onClick={this.onConversationClicked.bind(this)} />
                    </div>
                </Cell>
                <Cell col={6} hidePhone={true} tablet={4} style={{ maxHeight: this.getContentHeight() - 30, overflowY: "scroll" }}>
                    {this.state.request ?
                        (
                            <Interaction
                                request={this.state.request}
                                response={this.state.response}
                                outputs={this.state.outputs} />
                        ) : (
                            <h6> Select a log to view </h6>
                        )
                    }
                </Cell>
            </Grid >
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);