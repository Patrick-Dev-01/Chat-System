const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

// quando um novo usuario conectar, ele gera um socket
io.on('connection', socket => {
    console.log(`Socket conectado ${socket.id}`);

    socket.emit('previousMessages', messages);

    // receber as mensagens
    socket.on('sendMessage', data => {
        // armazenar as mensagens no array
        messages.push(data);
        // enviar para todos os sockets conectados 
        socket.broadcast.emit('receiveMessage', data)
    })
})

server.listen(3000)