import React from "react";
import { shallow } from "enzyme";
import { Answer } from "../answer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';


Enzyme.configure({ adapter: new Adapter() });

describe("Multiple choice answer", () => {
    const options = ["Correct", "Wrong", "Wrong"];
    const correctOption = 0;
    const optionsUl = (
        <ul>
            { options.map((opt, idx) => <li key={ idx }>{ opt }</li>) }
        </ul>
    );
    const wrapper = shallow(
        <Answer correct={correctOption}>
            { optionsUl }
        </Answer>
    );

    it("renders as radio buttons", () => {
        expect(wrapper.find(RadioGroup)).toHaveLength(1);
    });
    it("renders all options", () => {
        expect(wrapper.find(FormControlLabel).map(n => n.prop("label"))).toEqual(options);
    });
    it("has a feedback button", () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
