import React, {Component} from 'react';

export class TablePartnerTitle extends Component {
    render() {
        const partner = this.props.partner;
        const startMoney = this.props.startMoney;
        return (
            <table className="w3-table-all w3-centered w3-card-4 w3-center w3-margin-top" id="microTable">
                <caption className="w3-cyan"><b><i>Участник</i></b></caption>
                <tr className="w3-teal">
                    <td>Участник</td>
                    <td>Баланс</td>
                    <td>Прибыль</td>
                </tr>
                <tr>
                    <td>{partner.name}</td>
                    <td>{partner.money}</td>
                    <td>{partner.money - startMoney}</td>
                </tr>
            </table>
        );
    }
}
