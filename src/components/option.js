import React, {Component} from 'react';

export class Option extends Component {
    render() {
        return <option>{this.props.value}</option>
    }
}
