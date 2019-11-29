import React, {Component} from 'react';
import {TD} from "./td";

export class TRpartner extends Component {
    render() {
        const items = this.props.partner.papers.map((paper) => {
            return <TD key={paper.name} value={paper.count}/>
        });
        return (
            <tr className="w3-hover-cyan">
                <td>{this.props.partner.name}</td>
                <td>{this.props.money}</td>
                {items}
            </tr>
        );
    }
}
