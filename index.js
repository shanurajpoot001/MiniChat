const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");


app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , "public"))); // use to connect css style.css from public folder
app.use(express.urlencoded({extended:true})); // use to get data access ree.body from post
app.use(methodOverride("_method")); // use to use put request

main()
.then(() => {
  console.log("connected to mongodb")})
.catch(err => {
  console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
}



// Index chats
app.get("/chats" , async(req , res) =>{
  try{
    let chats = await  Chat.find();
    //console.log(chats);
    //res.send("working...");
    res.render("index.ejs" , {chats});
  } catch(err) {
    next(err);
  }

});


// new route use for new chat

app.get("/chats/new" , (req , res) => {
//  throw new ExpressError( 404 , "page not found");
res.render("new.ejs");
})

// create route
app.post("/chats" , asyncWrap ( async (req , res) =>{

  // try {
    let { from , to , msg} = req.body;
    let newChat = new Chat ({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });
  
   await newChat
   .save();
  /* .then((res) =>{
    console.log("chat saved");
   })
   .catch((err) => {
    console.log(err);
   });*/
  
  res.redirect("/chats");
   //} catch(err) {
   // next(err);
  // }
}));

function asyncWrap(fn) {
  return function (req , res , next) {
    fn( req,  res , next).catch((err) => next(err));
  };
}


// new show route
app.get("/chats/:id" ,  asyncWrap ( async (req, res , next ) => {
//try{
  let{id} = req.params;
  let chat = await Chat.findById(id);
  if (! chat){
    next( new ExpressError( 500 , "page not found"));
  }
    res.render("edit.ejs" , { chat});

//} catch(err){
  //next(err);
//}
}));

// edit route
app.get("/chats/:id/edit" , asyncWrap ( async (req, res) => {
 
 //try{
  let {id} = req.params;
  let chat = await (Chat.findById(id));
  res.render("edit.ejs" , {chat});
  //}catch(err){
 // next(err);
 //}
}));


// update route
app.put("/chats/:id" , asyncWrap ( async (req , res) => {
 //try{
  let {id} = req.params;
  let {msg: newMsg} = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
     id ,
     { msg: newMsg} , 
     { runValidators: true , new: true}
    );

    console.log(updatedChat);
    res.redirect("/chats");
 // }
  //catch(err){
   // next(err);
  //}
}));


// delete route
app.delete("/chats/:id" , asyncWrap ( async (req , res) => {
 // try{
    let {id} = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chats");

 // } catch(err) {
 //   next(err);
 // }
}));



app.get("/" , (req , res) => {
  // res.send("root is working");
   res.redirect("/chats");
});



const handleValidationError = (err) => {
  console.log("this was validation error , please follow the rule");
  consol.dir(err.message);
  return err;
}

app.use((err , req , res , next ) => {
  console.log(err.name);
  if ( err.name === "ValidationError")
 {
  err = handleValidationError(err);
 }  next(err);
});



// error handling middleWare

app.use(( err , req , res , next) => {
  let { status = 500 , message = " some error occurred"} = err;
  res.status(status).send(message);

});

app.listen(8080 , () => {
  console.log("server is listening on port 8080");
})



