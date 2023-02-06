const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const sortQuery = {
  field: {
    time: "timeField",
    score: "scoreFiel"
  },
  order:{
    ASC: 1,
    DESC: -1
  }
}

const { MongoClient } = require('mongodb');

const mongoDB = 'mongodb+srv://d2200423:3E24xrgBBgqbl2I0@mm1.yflufpd.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoDB);
app.use(express.json())

// Database Name
const dbName = 'mmData';
let db;
let users;
let result;

//connection to server
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
  users = db.collection('usercollections')
  result = db.collection('resultcollections')
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
//connection to server


// add user
app.post('/user', (req, res) => {
  const user = req.body
  
  users.insertOne(user)
  .then(result=>{
    res.status(201).json(result)
  })
  .catch(err =>{
    res.status(500).json({err: 'Could note create new user'})
  })
});

// get user by name(login)
app.get('/user/:name', (req, res) => {
  users.findOne(
    {userField: req.params.name}, 
    {projection: {_id: 0, pwdField: 0}}
  )
  .then(result=>{
    res.status(200).json(result);
  })
  .catch(err =>{
    res.status(500).json({err: 'Could note get info'})
  })
});


// login
app.get('/login', (req, res) => {
  const userPwd = req.body.userPwd
  users.findOne(
    {userField: req.body.userField}, 
    {projection: {_id: 0}}
  )
  .then((result)=>{
    if(result.pwdField !== userPwd){
      return res.status(404).json({err: 'Wrong password'});
    } else {
      delete result.pwdField;
      return res.status(200).json(result);
    }    
  })
  .catch(err =>res.status(500).json({err: 'Could note get info'}))
});

// add score start
app.post('/score', (req, res) => {
  const score = req.body;
  
  result.insertOne(score)
  .then(result=>res.status(201).json(result))
  .catch(err=>res.status(500).json({err: 'Could not save score'}))
});
// add score end

//get score + sorting
app.get('/score', (req, res)=>{
  result.find(
    {},
    {projection: {_id: 0}}
  )
  .sort(
    {[sortQuery.field[req.query.sort]]: sortQuery.order[req.query.order]}
  ).toArray()
  .then(result=> res.status(200).json(result))
  .catch(err=>res.status(500).json({err: 'Could not get score'}))
})
//get score + sorting

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});