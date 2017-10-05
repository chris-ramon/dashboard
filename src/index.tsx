import * as Firebase from "firebase";
import { createHistory } from "history";
import "isomorphic-fetch";
import * as Raven from "raven-js";
import * as ReactDOM from "react-dom";
import * as ReactGA from "react-ga";
import { Provider } from "react-redux";
import { EnterHook, IndexRoute, LeaveHook, RedirectFunction, Route, Router, RouterState, useRouterHistory } from "react-router";
import { replace, syncHistoryWithStore } from "react-router-redux";
import { autoRehydrate, persistStore } from "redux-persist";

import { LOGOUT_USER } from "./constants";

import { setUser } from "./actions/session";
import Dashboard from "./frames/Dashboard";

import Login from "./frames/Login";
import Source from "./models/source";
import { FirebaseUser } from "./models/user";
import IntegrationPage from "./pages/integration/StateIntegrationPage";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/logspage/ConvoPage";
import NewSourcePage from "./pages/NewSourcePage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/settingspage/StateSettingsPage";
import SourceListPage from "./pages/SourceListPage";
import SourcePage from "./pages/sourcepage/SourcePage";
import SourcesLinkPage from "./pages/SourcesLinkPage";
import AddMemberPage from "./pages/teampage/AddMemberPage";
import TeamPage from "./pages/teampage/TeamPage";
import ValidationPage from "./pages/validation/ValidationPage";
import rootReducer from "./reducers";

import IndexUtils from "./index-utils";
import configureStore from "./store";
import { Location } from "./utils/Location";

import { State } from "./reducers";

console.log("v" + VERSION + "-" + BUILD_NUMBER);

// Initialize Google Analytics
ReactGA.initialize(GOOGLE_ANALYTICS);
Raven.config("https://9c9082b20111469b9e177d7eb30a7cb2@sentry.io/191735").install();

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766
const browserHistory = useRouterHistory(createHistory)({
    basename: BASENAME
});

// Configure the store
const store = configureStore(browserHistory, rootReducer, autoRehydrate() as Redux.StoreEnhancer<State.All>);
persistStore(store, { whitelist: ["session"] });

// And our history
const history = syncHistoryWithStore(browserHistory, store);

// Bootstrap Firebase
let firebaseConfig = {
    apiKey: "AIzaSyB1b8t0rbf_x2ZEhJel0pm6mQ4POZLgz-k", // It is ok for this to be public - MMM
    authDomain: "bespoken-tools.firebaseapp.com",
    databaseURL: "https://bespoken-tools.firebaseio.com",
    storageBucket: "bespoken-tools.appspot.com",
    messagingSenderId: "629657216103"
};

// Timing the firebase initialize
console.time("FirebaseInitialize");

Firebase.initializeApp(firebaseConfig);
Firebase.auth().onAuthStateChanged(function (user: Firebase.User) {
    console.timeEnd("FirebaseInitialize");
    const state = store.getState();
    const lastUser = state.session.user;
    const location = state.routing.locationBeforeTransitions;
    const newLocation = {...location, ...{pathname: "/" }}; // Doing this will pass along any query parameters that may exist.
    // If there is a user, set it
    if (user) {
        if (!lastUser || lastUser.userId !== user.uid) {
            store.dispatch(setUser(new FirebaseUser(user)));
            if (!lastUser) {
                store.dispatch(replace(newLocation));
            }
        }
    } else {
        if (lastUser) {
            store.dispatch({ type: LOGOUT_USER });
            store.dispatch(setUser(undefined));
            store.dispatch(replace("/login"));
        }
    }
    // We need to wait for the user to be available before we can render the app
    render();
});

/**
 * Checks if the user exists before entering routes that require a user.
 *
 * See below on the onEnter method.
 */
let checkAuth = function (nextState: RouterState, replace: RedirectFunction): boolean {
    const session: any = store.getState().session;
    if (!session.user) {
        replace({
            pathname: "/login",
            query: nextState.location.query,
            state: { nextPathName: nextState.location.pathname, query: nextState.location.query }
        });
        return false;
    }
    return true;
};

let onEnterDashboard: EnterHook = function (nextState: RouterState, replace: RedirectFunction) {
    if (!checkAuth(nextState, replace)) return;
    if (nextState.location.pathname === "/") return replace({...location, pathname: "/skills" }); // in order to redirect from dashboard base location to skills page without adding a redirect on the componentDidMount
    if (nextState.location.query.id &&
      nextState.location.query.key &&
      !nextState.location.pathname.match("sources/link")) {
        replace({
            pathname: "/sources/link",
            query: nextState.location.query,
            state: { nextPathName: nextState.location.pathname, query: nextState.location.query }
        });
    }
};

let onUpdate = function () {
    ReactGA.pageview(window.location.pathname);
};

let setSource: EnterHook = function (nextState: RouterState, redirect: RedirectFunction) {
    let sources: Source[] = store.getState().source.sources;
    let sourceId: string = nextState.params["sourceId"];
    let loc: Location = nextState.location as Location;
    IndexUtils.dispatchSelectedSourceSource(store.dispatch, sourceId, sources, loc)
        .catch(function (a?: Error) {
            console.error(a);
            // Can't use the redirect because this is asynchronous.
            store.dispatch(replace("/skills"));
        });
};

let removeSource: LeaveHook = function () {
    IndexUtils.removeSelectedSource(store.dispatch);
};

let render = function () {
    ReactDOM.render((
        <Provider store={store}>
            <Router history={history} onUpdate={onUpdate}>
                <Route path="/login" component={Login}>
                    <IndexRoute component={LoginPage} />
                </Route>
                <Route path="/" component={Dashboard} onEnter={onEnterDashboard}>
                    <Route path="/skills" component={SourceListPage} />
                    <Route path="/team" component={TeamPage} />
                    <Route path="/team/new" component={AddMemberPage} />
                    <Route path="/skills/new" component={NewSourcePage} />
                    <Route path="/skills/:sourceId" onEnter={setSource} onLeave={removeSource} >
                        <IndexRoute component={SourcePage} />
                        <Route path="/skills/:sourceId/logs" component={LogsPage} />
                        <Route path="/skills/:sourceId/integration" component={IntegrationPage} />
                        <Route path="/skills/:sourceId/validation" component={ValidationPage} />
                        <Route path="/skills/:sourceId/settings" component={SettingsPage} />
                    </Route>
                    <Route path="/sources/link" component={SourcesLinkPage} />
                    <Route path="/notFound" component={NotFoundPage} />
                    <Route path="*" component={NotFoundPage} />
                </Route>
            </Router>
        </Provider>
    ),
        document.getElementById("dashboard")
    );
};


