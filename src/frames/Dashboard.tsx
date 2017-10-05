import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import Content from "../components/Content";
import { Dropdownable, Header, PageButton } from "../components/Header";
import Layout from "../components/Layout";
import Popup from "../components/Popup";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";
import SourceService from "../services/source";
import SpokeService from "../services/spokes";
import ArrayUtils from "../utils/array";
import { Location } from "../utils/Location";

/**
 * Simple Adapter so a Source can conform to Dropdownable
 */
class SourceDropdownableAdapter implements Dropdownable {

  constructor(readonly source: Source) {
  }

  get value() {
    return this.source.id;
  }

  get label() {
    return this.source.name;
  }

}

interface DashboardProps {
  user: User;
  currentSource: Source;
  sources: Source[];
  location: Location;
  login: () => (dispatch: Redux.Dispatch<any>) => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
  team: () => (dispatch: Redux.Dispatch<any>) => void;
  getSources: () => Promise<Source[]>;
  setSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
  goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
}

interface DashboardState {
  showModal: boolean;
}

function mapStateToProps(state: State.All) {
  return {
    user: state.session.user,
    currentSource: state.source.currentSource,
    sources: state.source.sources
  };
}

function mapDispatchToProps(dispatch: any) {
    return {
        login: function () {
            return dispatch(push("/login"));
        },
        logout: function () {
            return dispatch(logout());
        },
        team: function () {
            return dispatch(push("/team"));
        },
        getSources: function (): Promise<Source[]> {
            return dispatch(getSources());
        },
        setSource: function (source: Source) {
            return dispatch(setCurrentSource(source));
        },
        goTo: function (path: string) {
            return dispatch(replace(path));
        }
    };
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      showModal: false,
    };
    this.handleSelectedSource = this.handleSelectedSource.bind(this);
    this.handlePageSwap = this.handlePageSwap.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleEnterContest = this.handleEnterContest.bind(this);
  }

  drawerClasses() {
    return classNames(CLASSES.TEXT.BLUE_GREY_50, CLASSES.COLOR.BLUE_GREY_900);
  }

  headerClasses() {
    return classNames(CLASSES.COLOR.GREY_100, CLASSES.TEXT.GREY_600);
  }

  async componentDidMount() {
    const { id, key } = this.props.location.query;
    const goToCurrentSkill = () => this.props.goTo("/skills/" + id);
    const goToSkills = () => this.props.goTo("/skills/");
    let redirectTo: () => void = goToSkills;
    if (id && key) {
      const self = this;
      redirectTo = goToCurrentSkill;
      try {
        await SourceService.linkSource({ id: id, secretKey: key }, this.props.user);
        const source: Source = await SourceService.getSourceObj(id);
        const pipe: any = await SpokeService.fetchPipe(self.props.user, source);
        if (!pipe.diagnosticsKey) {
          await SpokeService.savePipe(self.props.user, source, pipe.http, true);
        }
        redirectTo();
      } catch (err) {
        redirectTo();
      }
    }
    await this.props.getSources();
  }

  handleSelectedSource(sourceDropdownableAdapter: SourceDropdownableAdapter) {
    this.props.setSource(sourceDropdownableAdapter.source);

    let currentPath = this.props.location.pathname;
    let newPath = currentPath.replace(this.props.currentSource.id, sourceDropdownableAdapter.source.id);

    this.props.goTo(newPath);
  }

  dropdownableSources(): SourceDropdownableAdapter[] {
    let dropdownableSources = [];

    for (let source of this.props.sources) {
      dropdownableSources.push(new SourceDropdownableAdapter(source));
    }
    return ArrayUtils.sortArrayByProperty(dropdownableSources, "label");
  }

  indexOf(source: Source): number {
    if (source) {
      let length = this.props.sources.length;
      for (let i = 0; i < length; ++i) {
        if (this.props.sources[i].id === source.id) {
          return i;
        }
      }
    }

    return -1;
  }

  pageButtons(): PageButton[] | undefined {
      const currentUserId = this.props && this.props.user && this.props.user.userId;
      const isOwner = currentUserId && this.props && ["admin", "owner"].indexOf(this.props.currentSource && this.props.currentSource.members[currentUserId]) > -1;
      let roleButtons = [
          {
              icon: "dashboard",
              name: "summary",
              tooltip: "summary"
          },
          {
              icon: "list",
              name: "logs",
              tooltip: "logs"
          }
      ];
      if (isOwner) {
          roleButtons = roleButtons.concat([
              {
                  icon: "code",
                  name: "integration",
                  tooltip: "integration"
              },
              {
                  icon: "assignment_turned_in",
                  name: "validation",
                  tooltip: "validation (beta)"
              },
              {
                  icon: "settings",
                  name: "settings",
                  tooltip: "settings"
              }
          ]);
      }
      return this.props.currentSource ? roleButtons : undefined;
  }

  handlePageSwap(button: PageButton) {
    if (button.name === "summary") {
      this.props.goTo("/skills/" + this.props.currentSource.id);
    } else if (button.name === "logs") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/logs");
    } else if (button.name === "integration") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/integration");
    } else if (button.name === "validation") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/validation");
    } else if (button.name === "settings") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/settings");
    }

  }

  handleHomeClick() {
    this.props.goTo("/skills");
  }

  handleOpenModal() {
    const contest = window.localStorage.getItem("contest") === "false";
    if (!contest) {
      window.localStorage.setItem("contest", "false");
      this.setState({ showModal: true });
    }
  }

  handleCloseModal() {
    window.localStorage.setItem("contest", "true");
    this.setState({ showModal: false });
  }

  handleEnterContest() {
    window.open("https://www.surveymonkey.com/r/X5R3W8G", "_blank");
    window.localStorage.setItem("contest", "true");
    this.setState({ showModal: false });
  }

  render() {
    return (
      <Layout header={true}>
        <Popup
          header={"Win an Echo Show"}
          content={<span>Thanks for being a Bespoken user.<br />Take this 5-minute survey to enter to win 1 of 2 devices. Enter before Sept 30.</span>}
          imgSrc="https://bespoken.io/wp-content/uploads/2017/08/Background.png"
          showButton={true}
          buttonLabel="Enter"
          showModal={this.state.showModal}
          handleCloseModal={this.handleCloseModal}
          handleEnterContest={this.handleEnterContest}
        />
        <Header
          className={this.headerClasses()}
          currentSourceId={this.props.currentSource ? this.props.currentSource.id : undefined}
          sources={this.props.currentSource ? this.dropdownableSources() : undefined}
          pageButtons={this.pageButtons()}
          onPageSelected={this.handlePageSwap}
          onSourceSelected={this.handleSelectedSource}
          onHomeClicked={this.handleHomeClick}
          displayHomeButton={this.props.location.pathname !== "/"}>
          <UserControl
            login={this.props.login}
            logout={this.props.logout}
            team={this.props.team}
            user={this.props.user} />
        </Header>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
