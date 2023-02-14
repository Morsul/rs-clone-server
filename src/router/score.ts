import { Router } from "express";
import { Collection } from "mongodb";
import { ScoreHandler } from "../controler/scoreController";
import { IScore } from "../types";

export class ScoreRouter{
  constructor(collection: Collection<IScore>){
    const router = Router();
    const scoreHandler = new ScoreHandler(collection);
    router.route('/score')
    .get(scoreHandler.getScore)
    .post(scoreHandler.addScore);
    return router;
  }
}

// export const userRouter = new UserRouter();
