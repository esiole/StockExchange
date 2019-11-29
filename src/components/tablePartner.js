import React, {Component} from 'react';
import {TRpartner} from "./trPartner";
import {TRpaper} from "./trPaper";

export class TablePartner extends Component {
    render() {
        const items = this.props.partners.map((partner) => {
            return <TRpartner key={partner.name} partner={partner} money={partner.money} papers={this.props.papers}/>
        });
        return (
            <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
                <caption className="w3-teal"><b><i>Сотояние участников</i></b></caption>
                <tr className="w3-cyan">
                    <td colSpan="2">Брокер</td>
                    <td colSpan={this.props.papers.length}>Количество купленных акций</td>
                </tr>
                <TRpaper papers={this.props.papers}/>
                {items}
            </table>
        );
    }
}
