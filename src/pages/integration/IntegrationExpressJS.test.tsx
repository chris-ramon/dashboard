import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { CodeSheet } from "./IntegrationSubPage";

import IntegrationExpressJS from "./IntegrationExpressJS";

const expect = chai.expect;

describe("IntegrationExpressJS", function () {

    describe("Rendering with showSecret = true and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationExpressJS secretKey={"ABC123"} showSecret={true} />);
        });

        it("Tests the page renders with a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.contain(`var logless = bst.Logless.middleware("ABC123");`);
        });
    });

    describe("Rendering with showSecret = true and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationExpressJS showSecret={true} secretKey={undefined} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.contain(`var logless = bst.Logless.middleware("<SECRET_KEY>");`);
        });
    });

    describe("Rendering with showSecret = false and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationExpressJS secretKey={"ABC123"} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.contain(`var logless = bst.Logless.middleware("<SECRET_KEY>");`);
        });
    });

    describe("Rendering with showSecret = false and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationExpressJS secretKey={undefined} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.contain(`var logless = bst.Logless.middleware("<SECRET_KEY>");`);
        });
    });
});