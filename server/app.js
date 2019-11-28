const express = require('express');
const cors = require('cors');
const io = require('socket.io').listen(3030);
const config = require('./config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept'
};
app.use(cors(corsOptions));

let arrayBegin = config.settings.start.split(":");
let arrayEnd = config.settings.end.split(":");
let arrayInterval = config.settings.interval.split(":");
let interval = parseInt(arrayInterval[0])*60*1000 + parseInt(arrayInterval[1])*1000;
let admin = '';
let randomInterval;

let isStart = false;
let countRandomNumberGeneration = 20;
function getRandomInRange(min, max, rule) {
    let sumRandomNumber = 0;
    if(rule == 'нормальный') {
        for(let i = 0; i < countRandomNumberGeneration; i++) {
            sumRandomNumber += Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Math.floor(sumRandomNumber/countRandomNumberGeneration);
    }
    let value = Math.floor(Math.random() * (max - min + 1)) + min;
    if(value <= 0) value = 1;
    return value;
}

io.sockets.on('connection', (socket) => {
    socket.on('hello', (msg) => {
        socket["name"] = msg.name;
        if(msg.name === "ADMIN") admin = socket.id;
        //else send("msg", socket, `${msg.name} участвует в аукционе`);
    });

    socket.on('disconnect', (msg) => {
        //if(socket["name"] !== "ADMIN") send("msg", socket, `${socket["name"]} покинул аукцион`);
    });

    socket.on('action', (msg) => {
       socket.json.emit('action', msg);
       socket.broadcast.json.emit('action', msg);
    });

    socket.on('start', (msg) => {
        socket.broadcast.json.emit('start');
        isStart = true;
        clearInterval(startInterval);
        //io.sockets.sockets[admin].json.emit();
        randomInterval = setInterval(() => {
            let test = [];
            for(let elem of config.papers) {
                elem.startPrice = getRandomInRange(elem.startPrice-elem.max, elem.startPrice+elem.max, elem.rule);
                test.push(elem.startPrice);
            }
            socket.broadcast.json.emit('change', {msg: 'ИЗМЕНЕНИЯ ЦЕНЫ!', value: test});
            }, interval);
    });

    socket.on('rules', (msg) => {
        for(let elem of config.papers) {
            if(elem.name == msg.paper) {
                elem.rule = msg.value;
                break;
            }
        }
    });

    let startInterval = setInterval(() => {
        if(arrayBegin[1] == new Date().getMinutes() && arrayBegin[0] == new Date().getHours()) {
            clearInterval(startInterval);
            socket.json.emit('start');
            if(!isStart) {
                isStart = true;
                randomInterval = setInterval(() => {
                    let test = [];
                    for(let elem of config.papers) {
                        elem.startPrice = getRandomInRange(elem.startPrice-elem.max, elem.startPrice+elem.max);
                        test.push(elem.startPrice);
                    }
                    socket.json.emit('change', {msg: 'ИЗМЕНЕНИЯ ЦЕНЫ!', value: test});
                    socket.broadcast.json.emit('change', {msg: 'ИЗМЕНЕНИЯ ЦЕНЫ!', value: test});
                }, interval);
            }
        }
    }, 500);

    let endInterval = setInterval(() => {
        if(arrayEnd[1] == new Date().getMinutes() && arrayEnd[0] == new Date().getHours()) {
            clearInterval(endInterval);
            clearInterval(randomInterval);
            socket.json.emit('end');
        }
    }, 500);
});

function send(type, socket, msg, otherSockets = true) {
    socket.json.emit(type, {"message": msg, "time": new Date()});
    if(otherSockets) socket.broadcast.json.emit(type, {"message": msg, "time": new Date()});
}

app.get('/', function (req, res) {
    res.json({ msg: 'connect', number: '200' });
});
app.get('/admin', function (req, res) {
    res.json(config);
});
let lastPartner;
app.post('/logon', function (req, res) {
    if(req.body.name === 'ADMIN') {
        res.json({ref: 'admin', config: config});
        return;
    }
    for(let element of config.partners) {
        if(element.name === req.body.name) {
            lastPartner = element;
            res.json({ref: 'partner', config: config});
            return;
        }
    }
    res.json({ref: 'null'});
});
app.get('/partner', function (req, res) {
    res.json({partner: lastPartner, papers: config.papers});
});
app.listen(3333);
