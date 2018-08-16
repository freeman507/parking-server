var bodyParser = require('body-parser');
var cors = require('cors');
var app = require('express')();
var http = require('http');
var net = require('net');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors({ origin: '*' }));
// Settings for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

let lastValue;
let io;

function newSocket(socket) {
	// socket.write('Welcome to the Telnet server!\n');
	socket.on('data', (data) => {
        const value = '' + data.toString('utf8');

        if (lastValue === value) {
            io.emit('available');
        } else {
            io.emit('unavailable');
        }

        lastValue = value;
	});
}

var server = app.listen(3000);
var telnet = net.createServer(newSocket);

io = require('socket.io').listen(server, {
    log: false,
    agent: false,
    origins: '*:*',
    transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
});

telnet.listen(10002);

app.get('/', function (req, res) {
    res.send('<h1>Parking server</h1>');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});
