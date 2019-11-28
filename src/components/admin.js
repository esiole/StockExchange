import React, {Component} from 'react';
import openSocket from 'socket.io-client';
import axios from "axios";

function PaperTD(props) {
    const name = props.paper;
    return <td>{name}</td>
}

function PaperTR(props) {
    const value = props.papers;
    const items = value.map((paper) => {
        return <PaperTD key={paper.name} paper={paper.name}/>;
    });
    return (
        <tr className="w3-teal">
            <td>Участник</td>
            <td>Баланс</td>
            {items}
        </tr>
    );
}

function SelectTD(props) {
    const value = props.rule;
    const socket = props.socket;
    const paper = props.paper;

    function sendSocket(e) {
        socket.json.emit('rules', {value: e.target.value, paper: paper});
    }
    if(value === 'нормальный') {
        return (
            <td>
                <select disabled={props.isStart} onChange={sendSocket} className="w3-select">
                    <option selected="selected">нормальный</option>
                    <option>равномерный</option>
                </select>
            </td>
        );
    } else {
        return (
            <td>
                <select disabled={props.isStart} onChange={sendSocket} className="w3-select">
                    <option>нормальный</option>
                    <option selected="selected">равномерный</option>
                </select>
            </td>
        );
    }
}

function PaperTable(props) {
    const value = props.papers;
    const items = value.map((paper) => {
        return <PaperTD key={paper.name} paper={paper.name}/>;
    });
    const counts = value.map((paper) => {
        return <PaperTD key={paper.name} paper={paper.count}/>;
    });
    const rules = value.map((paper) => {
        return <SelectTD key={paper.name} rule={paper.rule} isStart={props.isStart} socket={props.socket} paper={paper.name}/>
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

function PartnerTR(props) {
    const value = props;
    const items = value.partner.papers.map((paper) => {
        return <PaperTD key={paper.name} paper={paper.count}/>;
    });
    return (
        <tr className="w3-hover-cyan">
            <td>{value.partner.name}</td>
            <td>{value.money}</td>
            {items}
        </tr>
    );
}

function PartnerTable(props) {
    const value = props;
    const items = value.partners.map((partner) => {
        return <PartnerTR key={partner.name} partner={partner} money={partner.money} papers={value.papers}/>;
    });
    return (
      <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
          <caption className="w3-teal"><b><i>Сотояние участников</i></b></caption>
          <tr className="w3-cyan">
              <td colSpan="2">Брокер</td>
              <td colSpan={value.papers.length}>Количество купленных акций</td>
          </tr>
          <PaperTR papers={value.papers}/>
          {items}
      </table>
    );
}

export class Admin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
            partners: [],
            isLoaded: false,
            isStart: false
        };
        this.socket = openSocket('http://localhost:3030');
        this.socket.on("connect", () => {this.socket.json.emit("hello", {"name": "ADMIN"});});
        this.socket.on('action', (msg) => {
            let temp = this.state.partners;
            for(let i = 0; i < temp.length; i++) {
                if(temp[i].name === msg.name) {
                    for(let j = 0; j < temp[i].papers.length; j++) {
                        if(temp[i].papers[j].name === msg.paper) {
                            if(msg.action === 'купить') {
                                temp[i].papers[j].count += parseInt(msg.count);
                                temp[i].money -= msg.deltaMoney;
                            } else {
                                temp[i].papers[j].count -= parseInt(msg.count);
                                temp[i].money += msg.deltaMoney;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            this.setState({partners: temp});
        });
        this.socket.on('start', () => { this.setState({isStart: true}); });
        this.socket.on('end', () => { this.setState({isStart: false}); });
        this.start = this.start.bind(this);
        this.createInfoPartner = this.createInfoPartner.bind(this);
    }

    createInfoPartner(name) {return {name: name, count: 0};}

    componentDidMount() {
        axios.get('http://localhost:3333/admin').then((result) => {
            let partners = result.data.partners;
            for(let elem of partners) {
                elem.papers = [];
                for(let i = 0; i < result.data.papers.length; i++) {
                    elem.papers.push(this.createInfoPartner(result.data.papers[i].name))
                }
            }
            this.setState({papers: result.data.papers, partners: result.data.partners, isLoaded: true});
        });
    }

    start() {
        this.socket.json.emit("start");
        this.setState({isStart: true});
    }

    render() {
        const {papers, partners, isLoaded, isStart} = this.state;
        if (!isLoaded) return <p>Загрузка...</p>;
        return (
            <div className="w3-center w3-margin" >
                <div className="w3-container w3-cyan" id="admin">
                    <h3><b><i>ADMIN</i></b></h3>
                </div>
                <PartnerTable papers={papers} partners={partners}/>
                <PaperTable papers={papers} isStart={isStart} socket={this.socket}/>
                <button onClick={this.start} disabled={isStart} className="w3-btn w3-margin w3-teal w3-hover-cyan w3-border w3-border-white">Начать торг</button>
            </div>
        )
    }
}
