const mongoose = require('mongoose');
const HttpError = require('../utils/httpError');

exports.connectDB = async () => {
  const con = await mongoose.connect(
    'mongodb://meRahit:meRahit@devconnector-shard-00-00.us7kg.mongodb.net:27017,devconnector-shard-00-01.us7kg.mongodb.net:27017,devconnector-shard-00-02.us7kg.mongodb.net:27017/?ssl=true&replicaSet=DevConnector-shard-0&authSource=admin&retryWrites=true&w=majority'
  );
  console.log(`mongoDB Connected ${con.connection.host}`);
};
