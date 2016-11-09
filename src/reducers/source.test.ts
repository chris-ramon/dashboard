import { expect } from "chai";

import * as actions from "../actions/source";
import Source from "../models/source";
import { source } from "./source";

describe("Source Reducer", function () {
    it("returns the initial state", function () {
        let newState = source(undefined, { type: "" });
        expect(newState.sources).to.have.length(0);
        expect(newState.newSource).to.be.undefined;
        expect(newState.error).to.be.undefined;
        expect(newState.sourceRequest).to.be.false;
    });
    describe("SetCurrentSource", function() {
        it("sets the current source", function() {
            let newSource = new Source({name: "name"});
            let setCurrentSourceAction = actions.setCurrentSource(newSource);
            let newState = source(undefined, setCurrentSourceAction);
            expect(newState.currentSource).to.equal(newSource);
        });
    });
    describe("SetSources", function () {
        it("sets the sources", function () {
            let newSource = new Source({ name: "name" });
            let setSourcesAction = actions.setSources([newSource]);
            let newState = source(undefined, setSourcesAction);
            expect(newState.sources).to.have.length(1);
            expect(newState.sources[0]).to.equal(newSource);
        });
    });
    describe("CreateSourceRequest", function () {
        it("sets sourceRequest to true", function () {
            let createSourceRequest = actions.createSourceRequest();
            let newState = source(undefined, createSourceRequest);
            expect(newState.sourceRequest).to.be.true;
        });
    });
    describe("CreateSourceError", function () {
        it("sets the error", function () {
            let error = new Error();
            let createSourceError = actions.createSourceError(error);
            let newState = source(undefined, createSourceError);
            expect(newState.error).to.equal(error);
        });
    });
    describe("CreateSourceSuccess", function () {
        it("sets the new source and sourceRequest to false", function () {
            let newSource = new Source({name: "name"});
            let createSourceSuccess = actions.createSourceSuccess(newSource);
            let newState = source(undefined, createSourceSuccess);
            expect(newState.sourceRequest).to.be.false;
            expect(newState.newSource).to.equal(newSource);
            expect(newState.sources).to.have.length(1);
            expect(newState.sources[0]).to.equal(newSource);
        });
        it("appends the new source to the existing", function() {
            let newSource = new Source({name: "name"});
            let existingSource = new Source({name: "existing"});
            let createSourceSuccess = actions.createSourceSuccess(newSource);
            let oldState = {
                sources: [existingSource],
                sourceRequest: true
            };
            let newState = source(oldState, createSourceSuccess);
            expect(newState.sourceRequest).to.be.false;
            expect(newState.newSource).to.equal(newSource);
            expect(newState.sources).to.have.length(2);
            expect(newState.sources).to.contain(newSource);
            expect(newState.sources).to.contain(existingSource);
        });
    });
});