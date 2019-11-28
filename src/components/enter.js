import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';

export class Enter extends Component{
    constructor(props) {
        super(props);
        this.state = {name: ""};
        this.goTO = this.goTo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }
    goTo() {
        let ref = '';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({name: this.state.name}),
            url: 'http://localhost:3333/logon'
        };
        axios(options).then(res => {
            ref = res.data.ref;
            if(ref === 'null') {
                window.alert('Участник с таким именем не найден!');
                return;
            }
            window.location.assign(`http://localhost:3000/${ref}`);
        });
    }
    onChange(e) { this.setState({name: e.target.value}); }
    onKeyPress(e) { if(e.key === 'Enter') this.goTo(); }
    render() {
        return (
            <div id="enter" className="w3-white w3-text-teal">
                <h1>Биржа</h1>
                <input onChange={this.onChange} onKeyPress={this.onKeyPress} placeholder="Имя участника" autoFocus={true} className="w3-input w3-text-cyan w3-border-teal"/>
                <button onClick={this.goTO} className="w3-margin w3-btn w3-teal w3-hover-cyan">Вход</button>
            </div>
        )
    }
}
