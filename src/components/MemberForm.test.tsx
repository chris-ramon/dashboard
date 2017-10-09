import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import MemberForm from "./MemberForm";

import Dropdown from "react-toolbox/lib/dropdown";
import { FormInput } from "./FormInput";

let expect = chai.expect;

const addMember = sinon.stub;

describe("MemberForm", function() {
    it("should render correctly", function () {
        const wrapper = shallow(<MemberForm addMember={addMember} />);
        expect(wrapper.type()).to.equal("div");
        expect(wrapper.find(Dropdown)).to.exist;
        expect(wrapper.find(FormInput)).to.exist;
    });
});
