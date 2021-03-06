import { expect } from "chai";

import { fetchLogsRequest, setLogs } from "../actions/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import { dummyLogs } from "../utils/test";
import { log } from "./log";

describe("Log Reducer", function () {
    describe("fetch logs request action", function () {
        it("sets is loading to true", function () {
            let state = {
                isLoading: false
            };

            let newState = log(state, fetchLogsRequest(true));

            expect(newState.isLoading).to.be.true;
        });

        it("sets is loading to false", function () {
            let state = {
                isLoading: true
            };

            let newState = log(state, fetchLogsRequest(false));

            expect(newState.isLoading).to.be.false;
        });
    });
    describe("set logs action", function () {
        it("sets the logs", function () {

            let state = {
                isLoading: true
            };

            let source = new Source({
                name: "name",
                id: "name-id",
                secretKey: "secret"
            });

            let query = new LogQuery({
                source: source
            });

            let action = setLogs(query, dummyLogs(4));
            let newState = log(state, action);

            expect(newState.logMap[source.id].query).to.equal(query);
            expect(newState.logMap[source.id].logs).to.have.length(4);

            // Make sure the existing state is not modified
            expect(newState.isLoading).to.equal(state.isLoading);
        });

        it("Appends the logs when flag is set", function () {

            let state = {
                isLoading: true
            };

            let source = new Source({
                name: "name",
                id: "name-id",
                secretKey: "secret"
            });

            let query = new LogQuery({
                source: source
            });

            let action = setLogs(query, dummyLogs(4));
            let newState = log(state, action);

            let appendAction = setLogs(query, dummyLogs(4), true);
            let appendState = log(newState, appendAction);

            expect(appendState.logMap[source.id].query).to.equal(query);
            expect(appendState.logMap[source.id].logs).to.have.length(8);

            // Make sure the existing state is not modified
            expect(appendState.isLoading).to.equal(state.isLoading);
        });

        it("Overrites the logs when the flag is not set", function () {
            let state = {
                isLoading: true
            };

            let source = new Source({
                name: "name",
                id: "name-id",
                secretKey: "secret"
            });

            let query = new LogQuery({
                source: source
            });

            let action = setLogs(query, dummyLogs(4));
            let newState = log(state, action);

            let appendAction = setLogs(query, dummyLogs(5), false);
            let appendState = log(newState, appendAction);

            expect(appendState.logMap[source.id].query).to.equal(query);
            expect(appendState.logMap[source.id].logs).to.have.length(5);

            // Make sure the existing state is not modified
            expect(appendState.isLoading).to.equal(state.isLoading);
        });
    });
    describe("unknown action", function () {
        it("passes the state through", function () {

            let state = {
                isLoading: false
            };

            let newState = log(state, { type: "" });

            expect(newState.isLoading).to.equal(state.isLoading);
            // expect(newState.logs).to.be.undefined;
            expect(newState.error).to.be.undefined;
        });
    });
});