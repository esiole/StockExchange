import React, {Component} from 'react';
import {TD} from "./td";
import {TDselect} from "./tdSelect";

export class TablePaper extends Component {
    render() {
        const value = this.props;
        const items = value.papers.map((paper) => {
            return <TD key={paper.name} value={paper.name}/>
        });
        const counts = value.papers.map((paper) => {
            return <TD key={paper.name} value={paper.count}/>
        });
        const rules = value.papers.map((paper) => {
            return <TDselect key={paper.name} rule={paper.rule} name={paper.name} isStart={value.isStart} socket={value.socket}/>
        });
        return (
            <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
                <caption className="w3-cyan"><b><i>Информация об акциях</i></b></caption>
                <tr className="w3-teal">
                    <td></td>
                    {items}
                </tr>
                <tr>
                    <td className="w3-cyan">Общее количество</td>
                    {counts}
                </tr>
                <tr>
                    <td className="w3-teal">Закон распределения</td>
                    {rules}
                </tr>
            </table>
        );
    }
}
