import React, {Component} from 'react';

export class TDselect extends Component {
    render() {
        const socket = this.props.socket;
        const paper = this.props.paper;
        function sendSocket(e) {
            socket.json.emit('rules', {value: e.target.value, paper: paper});
        }
        if(this.props.rule === 'нормальный') {
            return (
                <td>
                    <select disabled={this.props.isStart} onChange={sendSocket} className="w3-select">
                        <option selected="selected">нормальный</option>
                        <option>равномерный</option>
                    </select>
                </td>
            );
        } else {
            return (
                <td>
                    <select disabled={this.props.isStart} onChange={sendSocket} className="w3-select">
                        <option>нормальный</option>
                        <option selected="selected">равномерный</option>
                    </select>
                </td>
            );
        }
    }
}
