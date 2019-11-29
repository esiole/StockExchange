import React, {Component} from 'react';
import {TD} from "./td";

export class TRpaper extends Component {
    render() {
        const items = this.props.papers.map((paper) => {
            return <TD key={paper.name} value={paper.name}/>;
        });
        return (
            <tr className="w3-teal">
                <td>Участник</td>
                <td>Баланс</td>
                {items}
            </tr>
        );
    }
}
