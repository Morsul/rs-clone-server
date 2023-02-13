import express, {Application, IRouter, response} from 'express';
import { Collection, Db, MongoClient } from 'mongodb';
import { mongoDB, port, dbName} from './constants/index';
import { IUser, IResult } from './types';

import { UserRouter } from './router/user';
import { Server } from 'http';


export class RSCloneServer{
  private _db!: Db;
  private _client: MongoClient;
  private _usersCollection!: Collection<IUser>;
  private _resultCollection!: Collection<IResult>;
  private _app: Application;
  private _userRouter!: UserRouter;
  private _server: Server;
  constructor(){
    this._client = new MongoClient(mongoDB);
    
    this._app = express();
    this._app.use(express.json())

    this._server = this._app.listen(port, ():void => {
      console.log(`Example app listening on port ${port}!`);
    });

    process.on('SIGKILL', () => {
      this._server.close(() => {
        console.log('close connection, close server');
      })
    })
    // process.on('SIGINT', () => {
    //   this._server.close(() => {
    //     console.log('close connection, exiting server');
    //   })
    // })

    
    this.Start()
    .then(response=>{
      this._db = response;
      this._usersCollection = this._db.collection('usercollections');
      this._resultCollection = this._db.collection('resultcollections');
      this._userRouter = new UserRouter(this._usersCollection);
      this._app.use(this._userRouter as IRouter)
      console.log('done!')
    })
    .catch(console.error);
  }

  private Start = async (): Promise<Db> => {
    return await this._client.connect().then(()=>{
        console.log('Connected successfully to server');        
        return this._client.db(dbName);            
      })
  }
 
}

