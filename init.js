const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
.then(() => {
  console.log("connected to mongodb")})
.catch(err => {
  console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
}

 let allChats = [
  {
    from:"sr",
    to: "us",
    msg:"ram-ram",
    created_at: new Date(),
  },
  {
    from:"shanu",
    to: "usha",
    msg:"ram-ram",
    created_at: new Date(),
  },
  {
    from:"bhanu",
    to: "shanu",
    msg:"ram-ram",
    created_at: new Date(),
  },
  {
    from:"me",
    to: "you",
    msg:"ram-ram",
    created_at: new Date(),
  },
  {
    from:"you",
    to: "me",
    msg:"ram-ram",
    created_at: new Date(),
  },
];

Chat.insertMany(allChats);