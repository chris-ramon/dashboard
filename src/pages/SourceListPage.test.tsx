import * as chai from "chai";
import { mount } from "enzyme";
import * as React from "react";

let jsdom = require("mocha-jsdom");

import { Source } from "../models/source";
import { dummySources } from "../utils/test";
import { SourceListPage } from "./SourceListPage";
import WelcomePage from "./WelcomePage";

import { Button } from "react-toolbox/lib/button";

import List from "../components/List/List";
import {User} from "../models/user";

let expect = chai.expect;
const user: User = { userId: "test", email: "email.test" };

describe("Source List Page", function () {

    let sources: Source[];

    before(function() {
        sources = dummySources(4);
    });

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {
            const wrapper = mount(<SourceListPage user={user} sources={sources} finishLoading={true} />);

            let twoPaneWrapper = wrapper.find("TwoPane");
            let leftSide = twoPaneWrapper.find(".source_list_page_left");
            let rightSide = twoPaneWrapper.find(".source_list_page_right");

            expect(leftSide.find(List)).to.have.prop("length", 4);
            expect(leftSide.find(Button)).to.have.length(1);

            expect(rightSide.find(WelcomePage)).to.have.length(1);
        });
    });
});
