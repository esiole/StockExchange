import React, {Component} from 'react';
import {TD} from "./td";

export class TableMarket extends Component {
    render() {
        const value = this.props.papers;
        const items = value.map((paper) => {
            return <TD key={paper.name} value={paper.name}/>
        });
        const counts = value.map((paper) => {
            return <TD ket={paper.name} value={paper.count}/>
        });
        const price = value.map((paper) => {
            return <TD key={paper.name} value={paper.startPrice}/>
        });
        return (
            <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
                <caption className="w3-teal"><b><i>Торги сейчас</i></b></caption>
                <tr className="w3-cyan">
                    <td>Акция</td>
                    {items}
                </tr>
                <tr>
                    <td className="w3-teal">Количество</td>
                    {counts}
                </tr>
                <tr>
                    <td className="w3-cyan">Cтоимость одной</td>
                    {price}
                </tr>
            </table>
        );
    }
}
