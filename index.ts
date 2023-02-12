// const express = require("express");
import express, {Request,Response,Application} from 'express';
import { Collection, Db, MongoClient } from 'mongodb';
import { mongoDB, port, sortQuery} from './src/constants';
import { IUser, IResult } from './src/types';
import bcrypt from 'bcrypt';

const client = new MongoClient(mongoDB);

const app:Application = express();
app.use(express.json())

// Database Name
const dbName = 'mmData';
let db: Db;
let users:Collection<IUser>;
let result:Collection<IResult>;

//connection to server
const main = async () => {
  await client.connect().then(res=>{
      console.log('Connected successfully to server');
      db = client.db(dbName);
      users = db.collection('usercollections');
      result = db.collection('resultcollections');
    }).then(res=>{console.log('done.')})
}

main()
  .then()
  .catch(console.error)
//connection to server


// add user
app.post('/user', async (req:Request, res:Response) => {
  const user = req.body
  user.username = await bcrypt.hash(user.username, Math.random()*(10-25)+10)
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
    {username: req.params.name}, 
    {projection: {_id: 0, username: 0}}
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
  const userPwd = req.query.password as string
  users.findOne(
    {username: req.query.username}, 
    {projection: {_id: 0}}
  )
  .then((result)=>{
    if(result){
      const isPWDSame = bcrypt.compare(userPwd, result.password!);
      if(!isPWDSame){
        return res.status(500).json({err: 'Wrong password'});
      } else {
        delete result.password;
        return res.status(200).json(result);
      }    
    } else{
      res.status(404).json({err: 'User not found'})
    }

  })
  .catch((err: any) =>res.status(404).json({err: 'User not found'}))
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
  const searchQuery = query.level === undefined ? {} : {level: Number(query.level)}
  let limit = 0
  let skip = 0;

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
    {[query.sort as string]: (sortQuery.order as any)[query.order as string]}
  ).toArray()
  .then((result: any)=> res.status(200).json(result))
  .catch((err: any)=>res.status(500).json({err: 'Could not get score'}))
})
//get score + sorting

app.listen(port, ():void => {
  console.log(`Example app listening on port ${port}!`);
});