import { Request, Response } from "express";
import { Collection, InsertOneResult, WithId } from "mongodb";
import { IUser } from "../types";
import { getSaltValue, responseStatus } from "../constants";
import bcrypt from 'bcrypt';


export class UserHandler {
  private _collection: Collection<IUser>;

  constructor(collection: Collection<IUser>){
    this._collection = collection;
  }
  
  addUser = async (req:Request, res:Response) => {
    const userData = req.body;
    if(!userData.password || !userData.username){      
      return res.status(responseStatus.badRequest).json({err: 'Not enought parametrs to create user'})
    }
    const saltValue = getSaltValue();
    userData.password = await bcrypt.hash(userData.password, saltValue)
    return this._collection.insertOne(userData)
      .then((result: InsertOneResult<IUser>)=>{
        res.status(responseStatus.created).json(result)
      })
      .catch((err: any) =>{
        res.status(responseStatus.error).json({err: 'User already exists'})
      })
    
  }

  getUP = async (req:Request, res:Response) => {
    const userPwd = String(req.body.password);
    const user = req.body.username;
    console.log(userPwd, user)
    if(!userPwd || !user){
      return res.status(responseStatus.badRequest).json({err: 'Not enought parametrs'})
    }
    return this._collection.findOne(
        {username: user}, 
        {projection: {_id: 0}}
      )
      .then(async (result: WithId<IUser> | null)=>{ 
        if(result){
          const isPWDSame = await bcrypt.compare(userPwd, result.password!);
          if(!isPWDSame){
            return res.status(responseStatus.error).json({err: 'Wrong password'});
          } else {
            delete result.password;
            return res.status(responseStatus.ok).json(result);
          }    
        } else{
          res.status(responseStatus.notFound).json({err: 'User not found'})
        }
      })
      .catch((err: any) =>res.status(responseStatus.notFound).json({err: 'User not found'}))
  }

}

// export const userHandler = new UserHandler(users);