import React, {Component} from 'react';
import {TD} from "./td";

export class TablePartnerPapers extends Component {
    render() {
        const value = this.props.buy;
        const items = value.map((paper) => {
            return <TD key={paper.paper} value={paper.paper}/>
        });
        const counts = value.map((paper) => {
            return <TD key={paper.paper} value={paper.buy}/>
        });
        const price = value.map((paper) => {
            return <TD key={paper.paper} value={parseInt(paper.buy)*parseInt(paper.price)}/>
        });
        return (
            <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
                <caption className="w3-cyan"><b><i>Состояние</i></b></caption>
                <tr className="w3-teal">
                    <td>Акция</td>
                    {items}
                </tr>
                <tr>
                    <td className="w3-cyan">Количество купленных</td>
                    {counts}
                </tr>
                <tr>
                    <td className="w3-teal">Их стоимость</td>
                    {price}
                </tr>
            </table>
        );
    }
}
