import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { CodeSheet } from "./IntegrationSubPage";

import IntegrationNodeJS from "./IntegrationNodeJSLambda";

const expect = chai.expect;

describe("IntegrationNodeJSLambda", function () {

    describe("Rendering with showSecret = true and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationNodeJS secretKey={"ABC123"} showSecret={true} />);
        });

        it("Tests the page renders with a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.handler = bst.Logless.capture("ABC123", function (event, context)`);
        });
    });

    describe("Rendering with showSecret = true and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationNodeJS showSecret={true} secretKey={undefined} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.handler = bst.Logless.capture("<SECRET_KEY>", function (event, context)`);
        });
    });

    describe("Rendering with showSecret = false and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationNodeJS secretKey={"ABC123"} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.handler = bst.Logless.capture("<SECRET_KEY>", function (event, context)`);
        });
    });

    describe("Rendering with showSecret = false and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationNodeJS secretKey={undefined} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.handler = bst.Logless.capture("<SECRET_KEY>", function (event, context)`);
        });
    });
});