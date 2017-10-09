import * as chai from "chai";
import { mount } from "enzyme";
import * as React from "react";

let jsdom = require("mocha-jsdom");

import { Source } from "../../models/source";
import { dummySources } from "../../utils/test";
import { TeamPage } from "./TeamPage";

let expect = chai.expect;

describe("Team Page", function () {

    let sources: Source[];

    before(function() {
        sources = dummySources(4);
    });

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {
            const wrapper = mount(<TeamPage sources={sources} />);
            expect(wrapper.find("table")).to.exist;
        });
    });
});
