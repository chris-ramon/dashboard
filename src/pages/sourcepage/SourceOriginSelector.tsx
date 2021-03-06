import * as React from "react";

import Checkbox from "react-toolbox/lib/checkbox";
import { Cell, Grid } from "../../components/Grid";

import Noop from "../../utils/Noop";

export interface SourceOption {
    label: string;
    theme: string;
    checked: boolean;
}

interface SourceOriginSelectorProps {
    options: SourceOption[];
    onCheck?: (index: number, label: string, checked: boolean) => void;
}

interface SourceOriginSelectorState {

}

export class SourceOriginSelector extends React.Component<SourceOriginSelectorProps, SourceOriginSelectorState> {

    static defaultProps: SourceOriginSelectorProps = {
        options: [],
        onCheck: Noop
    };

    static createBoxes(props: SourceOriginSelectorProps): JSX.Element[] {
        const { options, onCheck } = props;
        let boxes: JSX.Element[] = [];
        let i = 0;
        for (let option of options) {
            boxes.push(
                <Cell key={i} offsetTablet={i === 0 && 1} col={3} phone={1} tablet={2}>
                    <Box
                        option={option}
                        index={i}
                        onChange={onCheck}
                     />
                </Cell>
            );
            ++i;
        }
        return boxes;
    }

    render() {
        return (
            <Grid noSpacing>
                {SourceOriginSelector.createBoxes(this.props)}
            </Grid>
        );
    }
}

export default SourceOriginSelector;

interface BoxProps {
    index: number;
    option: SourceOption;
    onChange: (index: number, label: string, checked: boolean) => void;
}

export class Box extends React.Component<BoxProps, any> {
    constructor(props: BoxProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked: boolean) {
        const { index, option, onChange } = this.props;
        onChange(index, option.label, checked);
    }

    render() {
        const { option } = this.props;
        return (
            <Checkbox
                {...option}
                onChange={this.handleChange}
            />
        );
    }
}
