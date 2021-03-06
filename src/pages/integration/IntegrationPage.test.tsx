///<reference path="../../../node_modules/@types/mocha/index.d.ts"/>
import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { Tab, Tabs } from "react-toolbox";

import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import IntegrationExpressJS from "./IntegrationExpressJS";
import IntegrationGoogleFunction from "./IntegrationGoogleFunction";
import IntegrationJava from "./IntegrationJava";
import IntegrationNodeJS from "./IntegrationNodeJSLambda";
import IntegrationPage from "./IntegrationPage";

const expect = chai.expect;

const source: Source = dummySources(1)[0];

describe("IntegrationPage", function () {

    describe("Rendering with key.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationPage source={source} />);
        });

        it("Tests there are the appropriate number of tabs.", function () {
            expect(wrapper.find(Tabs)).to.have.length(1);
            expect(wrapper.find(Tab)).to.have.length(5);
        });

        it("Tests the Tabs property has the default index.", function () {
            expect(wrapper.find(Tabs).at(0).prop("index")).to.equal(0);
        });

        it("Tests the first tab is IntegrationNodeJS and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(0);
            const tabPage = tab.find(IntegrationNodeJS); // TODO: I'm not sure why this doesn't work.
            // const tabPage = tab.childAt(0);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it("Tests the second tab is IntegrationGoogleFunction and gets the secret key.", function () {
          const tab = wrapper.find(Tab).at(1);
          const tabPage = tab.find(IntegrationGoogleFunction);
          expect(tabPage).to.have.length(1);
          expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it("Tests the third tab is IntegrationExpressJS and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(2);
            const tabPage = tab.find(IntegrationExpressJS);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it("Tests the fourth tab is IntegrationJava and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(3);
            const tabPage = tab.find(IntegrationJava);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });
    });

    describe("Render without key", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationPage source={undefined} />);
        });

        it("Tests the first tab is IntegrationNodeJS and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(0);
            const tabPage = tab.find(IntegrationNodeJS);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.be.undefined;
        });

        it("Tests the second tab is IntegrationGoogleFunction and gets the secret key.", function () {
          const tab = wrapper.find(Tab).at(1);
          const tabPage = tab.find(IntegrationGoogleFunction);
          expect(tabPage).to.have.length(1);
          expect(tabPage.prop("secretKey")).to.be.undefined;
        });


        it("Tests the third tab is IntegrationExpressJS and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(2);
            const tabPage = tab.find(IntegrationExpressJS);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.be.undefined;
        });

        it("Tests the second tab is IntegrationJava and gets the secret key.", function () {
            const tab = wrapper.find(Tab).at(3);
            const tabPage = tab.find(IntegrationJava);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.be.undefined;
        });
    });

    describe("State", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<IntegrationPage source={source} />);
        });

        it("Tests the tab gets the appropriate state after change.", function () {
            let tabs = wrapper.find(Tabs).at(0);
            tabs.simulate("change", 1);

            tabs = wrapper.find(Tabs).at(0);

            expect(tabs.prop("index")).to.equal(1);
        });
    });
});
