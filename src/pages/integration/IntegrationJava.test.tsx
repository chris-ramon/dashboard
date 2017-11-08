import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { CodeSheet } from "./IntegrationSubPage";

import IntegrationJava from "./IntegrationJava";

const expect = chai.expect;

describe("IntegrationJava", function () {

    describe("Rendering with showSecret = true and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava secretKey={"ABC123"} showSecret={true} />);
        });

        it("Tests the page renders with a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(0).childAt(0).text()).to.equal(`Logless.capture("ABC123", new HelloWorldSpeechlet());`);
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.equal(`Servlet wrapper = Logless.capture("ABC123", new HelloWorldServlet());`);
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`Logless.capture("ABC123", request, response, new IServletHandler()`);
        });
    });

    describe("Rendering with showSecret = true and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava showSecret={true} secretKey={undefined} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(0).childAt(0).text()).to.equal(`Logless.capture("<SECRET_KEY>", new HelloWorldSpeechlet());`);
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.equal(`Servlet wrapper = Logless.capture("<SECRET_KEY>", new HelloWorldServlet());`);
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`Logless.capture("<SECRET_KEY>", request, response, new IServletHandler()`);
        });
    });

    describe("Rendering with showSecret = false and a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava secretKey={"ABC123"} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(0).childAt(0).text()).to.equal(`Logless.capture("<SECRET_KEY>", new HelloWorldSpeechlet());`);
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.equal(`Servlet wrapper = Logless.capture("<SECRET_KEY>", new HelloWorldServlet());`);
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`Logless.capture("<SECRET_KEY>", request, response, new IServletHandler()`);
        });
    });

    describe("Rendering with showSecret = false and without a secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava secretKey={undefined} showSecret={false} />);
        });

        it("Tests the page renders without a secret key.", function () {
            expect(wrapper.find(CodeSheet).at(0).childAt(0).text()).to.equal(`Logless.capture("<SECRET_KEY>", new HelloWorldSpeechlet());`);
            expect(wrapper.find(CodeSheet).at(1).childAt(0).text()).to.equal(`Servlet wrapper = Logless.capture("<SECRET_KEY>", new HelloWorldServlet());`);
            expect(wrapper.find(CodeSheet).at(2).childAt(0).text()).to.contain(`Logless.capture("<SECRET_KEY>", request, response, new IServletHandler()`);
        });
    });
});