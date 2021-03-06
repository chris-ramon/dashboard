import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as Form from "./FormInput";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("FormInput", function () {
    it("should render correctly", function () {
        let value = "value";
        const onChange = sinon.spy();
        const wrapper = shallow((
            <Form.FormInput
                type={"text"}
                label={"Label"}
                value={value}
                onChange={onChange}
                />
        ));

        expect(wrapper.type()).to.equal("div");
        expect(wrapper.props().className).to.equal("mdl-textfield mdl-js-textfield");

        expect(wrapper.find("input")).to.have.length(1);
        expect(wrapper.find("label")).to.have.length(1);

        let input = wrapper.find("input");
        expect(input.props().autoComplete).to.equal("off");
        expect(input.props().type).to.equal("text");
        expect(input.props().id).to.equal("label");
        expect(input.props().value).to.equal("value");

        let label = wrapper.find("label");
        expect(label.props().htmlFor).to.equal("label");
        expect(label.props().children).to.equal("Label");
    });

    describe("Checks the onChange gets routed to our method.", function () {
        let value = "value";
        const onChange = sinon.spy();
        const wrapper = shallow((
            <Form.FormInput
                type={"text"}
                label={"Label"}
                value={value}
                onChange={onChange}
                />
        ));

        wrapper.find("input").simulate("change", { target: { value: "A" } });
        expect(onChange).is.calledOnce;
    });

    describe("with floatingLabel = true", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow((
                <Form.FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    floatingLabel={true}
                    />
            ));

            expect(wrapper.type()).to.equal("div");
            expect(wrapper.props().className).to.equal("mdl-textfield mdl-js-textfield mdl-textfield--floating-label");
        });
    });
    describe("with style overrides", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow((
                <Form.FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    floatingLabel={true}
                    style={{ display: "none" }}
                    />
            ));

            expect(wrapper.type()).to.equal("div");
            expect(wrapper.props().style).to.eql({ display: "none" });
        });
    });

    describe("with autocomplete = on", function () {

        let value = "value";
        const onChange = sinon.spy();
        const wrapper = shallow((
            <Form.FormInput
                type={"text"}
                label={"Label"}
                value={value}
                onChange={onChange}
                autoComplete={"on"}
                />
        ));
        it("renders correctly", function () {
            let input = wrapper.find("input");
            expect(input.props().autoComplete).to.equal("on");
        });
    });
    describe("with readonly = true", function () {
        let value = "value";
        const onChange = sinon.spy();
        const wrapper = shallow((
            <Form.FormInput
                type={"text"}
                label={"Label"}
                value={value}
                onChange={onChange}
                readOnly={true}
                />
        ));
        it("renders correctly", function () {
            let input = wrapper.find("input");
            expect(input.props().readOnly).to.equal(true);
        });
    });
    describe("with showable = true", function () {
        const onChange = sinon.spy();
        const wrapper = shallow((
            <Form.FormInput
                type={"password"}
                label={"Label"}
                value={"value"}
                onChange={onChange}
                readOnly={true}
                showable={true}
                />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("Pill")).to.have.length(1);
        });
        it("shows the contents on click", function () {
            expect(wrapper.find("input").first().props().type).to.equal("password");
            wrapper.find("Pill").simulate("click");
            expect(wrapper.find("input").first().props().type).to.equal("text");
        });
    });
    describe("With error handler", function () {
        it("Check that there is no pattern if error is not applied", function () {
            let value = "value";

            const onChange = sinon.spy();
            const wrapper = shallow((
                <Form.FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    readOnly={true}
                    />
            ));

            let input = wrapper.find("input");
            expect(input.props().pattern).is.undefined;
        });
        it("Checks that the error handler pattern is applied", function () {
            let value = "value";
            let error: Form.ErrorHandler = {
                regex: /^\w$/,
                errorMessage: function (input: string): string {
                    return "Check";
                }
            };

            const onChange = sinon.spy();
            const wrapper = shallow((
                <Form.FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    readOnly={true}
                    error={error}
                    />
            ));

            let input = wrapper.find("input");
            expect(input.props().pattern).is.equal(error.regex.source);
        });
        it("Checks that the error message is thrown when pattern doesn't match.", function () {
            let value = "value";
            let error: Form.ErrorHandler = {
                regex: /^[A-Z]$/,
                errorMessage: sinon.spy(function (input: string): string {
                    return "Check";
                })
            };

            const onChange = sinon.spy();
            const wrapper = shallow((
                <Form.FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    readOnly={true}
                    error={error}
                    />
            ));

            wrapper.find("input").simulate("change", { target: { value: "A" } });

            expect(error.errorMessage).to.be.calledOnce;
        });
    });
});