var app = require('express')();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.send('<h1>Parking server</h1>');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

});

server.listen(3000, function () {
    console.log('listening on *:3000');

    io.emit('unavailable');

    setInterval(() => {

        http.get('http://192.168.0.110', function (resp) {

            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(data);
            });
        });


    }, 1000);

});
