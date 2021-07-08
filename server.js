const express = require('express');
const app = express();
const server = require('http').Server(app);
const io=require('socket.io')(server);
const {v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer( server,{
    debug: true
});
const EventEmitter = require('events');
const emitter = new EventEmitter()


app.set('view engine','ejs');
app.use(express.static('public'));


app.use('/peerjs', peerServer);

app.get('/', (req,res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection',socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message1',message1 =>{
            io.to(roomId).emit('createMessage',message1)
        socket.on('message', (evt) => {
            socket.to(roomId).emit('message', evt)
            emitter.setMaxListeners(100);
            })
        })
    })
})
io.on('disconnect', (evt) => {
    log('some people left')
})

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);



server.listen(process.env.PORT|| 3030);