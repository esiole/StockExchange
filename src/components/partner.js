import React, {Component} from 'react';
import openSocket from 'socket.io-client';
import axios from "axios";
import {TablePartnerPapers} from "./tablePartnerPapers";
import {Option} from "./option";
import {TablePartnerTitle} from "./tablePartnerTitle";
import {TableMarket} from "./tableMarket";

export class Partner extends Component{
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
            partner: {},
            isLoaded: false,
            market: {
                paper: '',
                count: 0,
                action: 'купить'
            },
            buy: [],
            startMoney: 0,
            isStart: false
        };
        this.socket = openSocket('http://localhost:3030');
        this.socket.on("connect", () => {this.socket.json.emit("hello", {"name": this.state.partner.name});});
        this.socket.on('action', (msg) => {
            let temp = this.state.papers;
            let buy = this.state.buy;
            let partner = this.state.partner.name;
            for(let i = 0; i < temp.length; i++) {
                if(temp[i].name === msg.paper) {
                    if(msg.action === 'купить') {
                        temp[i].count -= parseInt(msg.count);
                        if(msg.name === partner)
                            buy[i].buy += parseInt(msg.count);
                    } else {
                        temp[i].count += parseInt(msg.count);
                        if(msg.name === partner)
                            buy[i].buy -= parseInt(msg.count);
                    }
                    break;
                }
            }
            this.setState({papers: temp, buy: buy});
        });
        this.socket.on('change', (msg) => {
            let temp = this.state.papers;
            let buy = this.state.buy;
            for(let i = 0; i < msg.value.length; i++) {
                temp[i].startPrice = msg.value[i];
                buy[i].price = msg.value[i];
            }
            this.setState({papers: temp, buy: buy});
        });
        this.socket.on('start', () => {this.setState({isStart: true});});
        this.socket.on('end', () => {this.setState({isStart: false});});
        this.changeCount = this.changeCount.bind(this);
        this.changePaper = this.changePaper.bind(this);
        this.changeAction = this.changeAction.bind(this);
        this.action = this.action.bind(this);
    }
    changeCount(e) {
        let temp = this.state.market;
        temp.count = e.target.value;
        this.setState({market: temp});
    }
    changePaper(e) {
        let temp = this.state.market;
        temp.paper = e.target.value;
        this.setState({market: temp});
    }
    changeAction(e) {
        let temp = this.state.market;
        temp.action = e.target.value;
        this.setState({market: temp});
    }
    action() {
        let temp = this.state.market;
        let name = this.state.partner.name;
        let papers = this.state.papers;
        let partner = this.state.partner;
        let buy = this.state.buy;
        let deltaMoney = 0;
        if(temp.count === 0 || temp.count === undefined || temp.count === null) {
            window.alert('Укажите количество акций!');
            return;
        }
        if(temp.action === 'продать') {
            for(let i = 0; i < papers.length; i++) {
                if(papers[i].name === temp.paper) {
                    if(buy[i].buy < temp.count) {
                        window.alert('Недостаточно акций для продажи!');
                        return;
                    }
                }
            }
        }
        for(let elem of papers) {
            if(elem.name === temp.paper) {
                deltaMoney = temp.count*elem.startPrice;
                let newMoney = 0;
                if(temp.action === 'купить') {
                    newMoney = parseInt(partner.money) - deltaMoney;
                    if(newMoney < 0) {
                        window.alert('Недостаточно средств!');
                        return;
                    }
                } else {
                    newMoney = parseInt(partner.money) + deltaMoney;
                }
                partner.money = newMoney;
                break;
            }
        }
        this.setState({partner: partner});
        this.socket.json.emit("action", {'paper': temp.paper, 'count': temp.count, 'action': temp.action, 'name': name, 'deltaMoney': deltaMoney});
    }
    componentDidMount() {
        axios.get('http://localhost:3333/partner')
            .then((result) => {
                let temp = this.state.market;
                temp.paper = result.data.papers[0].name;
                let array = [];
                for(let i = 0; i < result.data.papers.length; i++) {
                    let value = {};
                    value.paper = result.data.papers[i].name;
                    value.buy = 0;
                    value.price = result.data.papers[i].startPrice;
                    array.push(value);
                }
                this.setState({papers: result.data.papers, partner: result.data.partner, isLoaded: true, market: temp, buy: array, startMoney: result.data.partner.money});
            });
    }
    render() {
        const {papers, partner, isLoaded, market, buy, startMoney, isStart} = this.state;
        if(!isLoaded) return <h1>Загрузка...</h1>;
        else {
            const items = papers.map((paper) => {
                return <Option key={paper.name} value={paper.name}/>
            });
            return (
                <div className="w3-margin">
                    <TablePartnerTitle partner={partner} startMoney={startMoney}/>
                    <TablePartnerPapers buy={buy}/>
                    <TableMarket papers={papers}/>
                    <div className="w3-center w3-container" id="panel">
                        <div className="w3-container w3-teal" id="label">
                            <h3><b><i>Сделка</i></b></h3>
                        </div>
                        <select onChange={this.changePaper} className="w3-select">
                            {items}
                        </select>
                        <input type="number" min="0" step="1" placeholder="Количество" onChange={this.changeCount} className="w3-input"/>
                        <select onChange={this.changeAction} className="w3-select">
                            <option>купить</option>
                            <option>продать</option>
                        </select>
                        <button onClick={this.action} disabled={!isStart} className="w3-btn w3-teal w3-hover-cyan w3-border w3-border-white microMarginTop">заключить</button>
                    </div>
                </div>
            )
        }
    }
}
