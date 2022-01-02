const express = require('express');
const app = express();

const http = require('http');
const { Server } = require("socket.io");


const httpPort = 3000;

app.use('/', express.static('static'));


const server = app.listen(httpPort, () => {
	console.log(`reader is listening at http://localhost:${httpPort}`)
});

const io = new Server(server);

const clients = [];
io.on('connection', (socket) => {
	clients.push(socket);
});



const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
const port = new SerialPort('/dev/ttyUSB0', {
	//as root: setserial /dev/ttyUSB0 divisor 156 spd_cust
	baudRate: 38400
})

const parser = port.pipe(new Delimiter({
	delimiter: [0xaa, 0x55],
	includeDelimiter: false
}));

parser.on('data', buffer => {
	clients.forEach(client => client.emit('data', buffer));
});
