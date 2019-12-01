import React, {Component} from 'react';
import {TD} from "./td";

export class TRpartner extends Component {
    render() {
        const value = this.props.partner;
        const items = value.papers.map((paper) => {
            return <TD key={paper.name} value={paper.count}/>
        });
        return (
            <tr className="w3-hover-cyan">
                <td>{value.name}</td>
                <td>{value.money}</td>
                {items}
            </tr>
        );
    }
}
