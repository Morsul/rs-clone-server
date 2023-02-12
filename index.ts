// const express = require("express");
import express, {Request,Response,Application} from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { mongoDB, port } from "./src/const";

const app:Application = express();


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

const client = new MongoClient(mongoDB);
app.use(express.json())

// Database Name
const dbName = 'mmData';
let db;
let users:any;
let result:any;

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
app.post('/user', async (req:Request, res:Response) => {
  const user = req.body
  user.pwdField = await bcrypt.hash(user.pwdField, Math.random()*(10-25)+10)
  users.insertOne(user)
  .then((result: any)=>{
    res.status(201).json(result)
  })
  .catch((err: any) =>{
    res.status(500).json({err: 'Could note create new user'})
  })
});

// get user by name(login)
app.get('/user/:name', (req:Request, res:Response) => {
  users.findOne(
    {userField: req.params.name}, 
    {projection: {_id: 0, pwdField: 0}}
  )
  .then((result: any)=>{
    res.status(200).json(result);
  })
  .catch((err: any) =>{
    res.status(500).json({err: 'Could note get info'})
  })
});


// login
app.get('/login', (req:Request, res:Response) => {
  const userPwd = req.body.userPwd
  users.findOne(
    {userField: req.body.userField}, 
    {projection: {_id: 0}}
  )
  .then(async (result: { pwdField: any; })=>{
    const isPWDSame = await bcrypt.compare(userPwd, result.pwdField);
    if(!isPWDSame){
      return res.status(404).json({err: 'Wrong password'});
    } else {
      delete result.pwdField;
      return res.status(200).json(result);
    }    
  })
  .catch((err: any) =>res.status(500).json({err: 'Could note get info'}))
});

// add score start
app.post('/score', (req:Request, res:Response) => {
  const score = req.body;
  
  result.insertOne(score)
  .then((result: any)=>res.status(201).json(result))
  .catch((err: any)=>res.status(500).json({err: 'Could not save score'}))
});
// add score end

//get score + sorting
app.get('/score', (req:Request, res:Response)=>{
  const {query} = req;
  const searchQuery = query.levelIDFild === undefined ? {} : {levelIDFild: query.levelIDFild}
  let limit = 0
  let skip = 0;
  let a = query.sort as string;
  if (query.limit !== undefined){
    limit = Number(query.limit);
    if (query.page !== undefined){
      skip = Number(limit*(Number(query.page) -1))
    }
  }
  
  result.find(
    searchQuery,
    {projection: {_id: 0}}
  )
  .skip(skip)
  .limit(limit)
  .sort(
    
    {[(sortQuery.field as any)[query.sort as string]]: (sortQuery.order as any)[query.order as string]}
  ).toArray()
  .then((result: any)=> res.status(200).json(result))
  .catch((err: any)=>res.status(500).json({err: 'Could not get score'}))
})
//get score + sorting

app.listen(port, ():void => {
  console.log(`Example app listening on port ${port}!`);
});