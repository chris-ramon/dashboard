import * as chai from "chai";
import { mount } from "enzyme";
import * as React from "react";

let jsdom = require("mocha-jsdom");
import MemberForm from "../../components/MemberForm";
import { Source } from "../../models/source";
import { dummySources } from "../../utils/test";
import { AddMemberPage } from "./AddMemberPage";

let expect = chai.expect;

describe("Add Member Page", function () {

    let sources: Source[];

    before(function() {
        sources = dummySources(4);
    });

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {
            const wrapper = mount(<AddMemberPage sources={sources} />);
            expect(wrapper.find(MemberForm)).to.exist;
        });
    });
});
