const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const fs = require('fs');
const { connectDB } = require('./src/config/db');
const PORT = process.env.PORT || 4000;
const socketIO = require('socket.io')(http);
const ChatRoom = require('./src/Models/Rooms');
const Message = require('./src/Models/Message');

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}
jsonReader('./data.json', (err, customer) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(customer); // => "Infinity Loop Drive"
});
socketIO.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('createRoom', async name => {
    console.log({ name });
    socket.join(name);
    let cr = await ChatRoom.create({ id: generateID(), name });
    console.log(cr);
    chatRooms.unshift({ id: generateID(), name, messages: [] });
    socket.emit('roomsList', cr);
  });

  socket.on('findRoom', async id => {
    let rs = await ChatRoom.find({ id }).populate('messages');

    // let result = chatRooms.filter(room => room.id == id);
    console.log(rs);
    // console.log(chatRooms);
    socket.emit('foundRoom', rs[0].messages);
    // console.log("Messages Form", result[0].messages);
  });

  socket.on('newMessage', async data => {
    const { room_id, message, user, timestamp } = data;
    console.log(room_id);

    const newMessage = {
      id: generateID(),
      text: message,
      user,
      time: `${timestamp.hour}:${timestamp.mins}`,
    };

    let msg = await Message.create(newMessage);
    ChatRoom.findOneAndUpdate(
      { id: room_id },
      { $push: { messages: msg._id } }
    ).exec(function (err, managerparent) {
      //
    });
    let rss = await ChatRoom.find().populate('messages');
    let rs = await ChatRoom.find({ id: room_id }).populate('messages');
    socket.to(rs[0].name).emit('roomMessage', msg);

    socket.emit('roomsList', rss);
    socket.emit('foundRoom', rs[0].messages);
  });
  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', async (req, res) => {
  let crs = await ChatRoom.find();
  res.json(crs);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
