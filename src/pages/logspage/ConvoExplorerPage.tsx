import * as React from "react";

import { browserHistory } from "react-router";
import TwoPane from "../../components/TwoPane";
import Conversation from "../../models/conversation";
import service from "../../services/log";
import { Query } from "../../utils/Location";
import ConvoListPage from "./ConvoListPage";
import ConvoViewPage from "./ConvoViewPage";
import { CompositeFilter } from "./filters/Filters";

interface ConvoExplorerPageProps {
    filter?: CompositeFilter<Conversation>;
    refreshOn?: boolean;
    onIconClick?: (conversation: Conversation) => void;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
}

interface ConvoExplorerPageState {
    selectedConvo: Conversation;
}

export class ConvoExplorerPage extends React.Component<ConvoExplorerPageProps, ConvoExplorerPageState> {

    constructor(props: ConvoExplorerPageProps) {
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);

        this.state = {
            selectedConvo: undefined
        };
    }

    handleItemClick(convo: Conversation, setQueryParams: boolean) {
        this.setState({selectedConvo: convo});
        if (browserHistory && setQueryParams) {
            let location = {...browserHistory.getCurrentLocation()};
            const query: Query = {
                id: convo.transactionId,
                transactions_before: service.DEFAULT_TRANSACTIONS_BEFORE,
                transactions_after: service.DEFAULT_TRANSACTIONS_AFTER
            };
            location.query = {...location.query, ...query};
            browserHistory.push(location);
        } else if (browserHistory) {
            this.setState({selectedConvo: undefined});
            let location = {...browserHistory.getCurrentLocation()};
            location.query = {};
            browserHistory.push(location);
        }
    }

    render() {
        return (
            <TwoPane
                leftStyle={{ paddingLeft: "10px", paddingRight: "5px", zIndex: 1 }}
                rightStyle={{ paddingLeft: "5px", paddingRight: "10px" }}
                spacing={true}>
                <ConvoListPage
                    {...this.props}
                    onItemClick={this.handleItemClick} />
                <ConvoViewPage
                    conversation={this.state.selectedConvo} />
            </TwoPane>
        );
    }
}

export default ConvoExplorerPage;
