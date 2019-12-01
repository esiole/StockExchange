import React, {Component} from 'react';

export class TDselect extends Component {
    render() {
        const value = this.props;
        function sendSocket(e) {
            value.socket.json.emit('rules', {value: e.target.value, paper: value.name});
        }
        if(value.rule === 'нормальный') {
            return (
                <td>
                    <select disabled={value.isStart} onChange={sendSocket} className="w3-select">
                        <option selected="selected">нормальный</option>
                        <option>равномерный</option>
                    </select>
                </td>
            );
        } else {
            return (
                <td>
                    <select disabled={value.isStart} onChange={sendSocket} className="w3-select">
                        <option>нормальный</option>
                        <option selected="selected">равномерный</option>
                    </select>
                </td>
            );
        }
    }
}
