import React, {Component} from 'react';
import openSocket from 'socket.io-client';
import axios from "axios";
import {TablePartner} from "./tablePartner";
import {TablePaper} from "./tablePaper";

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
                <TablePartner papers={papers} partners={partners}/>
                <TablePaper papers={papers} isStart={isStart} socket={this.socket}/>
                <button onClick={this.start} disabled={isStart} className="w3-btn w3-margin w3-teal w3-hover-cyan w3-border w3-border-white">Начать торг</button>
            </div>
        )
    }
}
