import { Router } from "express";
import { Collection } from "mongodb";
import { UserHandler } from "../controler/userController";
import { IUser } from "../types";

export class UserRouter{
  constructor(collection: Collection<IUser>){
    const router = Router();
    const userHandler = new UserHandler(collection);
    router.route('/user')
      .post(userHandler.addUser);
    router.route('/login')    
      .post(userHandler.getUP)
    return router;
  }
}

// export const userRouter = new UserRouter();
