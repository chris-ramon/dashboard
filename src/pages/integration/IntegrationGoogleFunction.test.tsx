import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { CodeSheet } from "./IntegrationSubPage";

import IntegrationGoogleFunction from "./IntegrationGoogleFunction";

const expect = chai.expect;

describe("IntegrationGoogleFunction", function () {

    describe("Rendering with showSecret = true and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationGoogleFunction secretKey={"ABC123"} showSecret={true} />);
        });

        it("Tests the page renders with a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.function = bst.Logless.capture("ABC123", function (request, response)`);
        });
    });

    describe("Rendering with showSecret = true and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationGoogleFunction showSecret={true} secretKey={undefined} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.function = bst.Logless.capture("<SECRET_KEY>", function (request, response)`);
        });
    });

    describe("Rendering with showSecret = false and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationGoogleFunction secretKey={"ABC123"} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.function = bst.Logless.capture("<SECRET_KEY>", function (request, response)`);
        });
    });

    describe("Rendering with showSecret = false and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationGoogleFunction secretKey={undefined} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`exports.function = bst.Logless.capture("<SECRET_KEY>", function (request, response)`);
        });
    });

});
