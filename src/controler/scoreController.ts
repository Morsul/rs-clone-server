import { Request, Response } from "express";
import { Collection, InsertOneResult, WithId } from "mongodb";
import { responseStatus, sortQuery } from "../constants";
import { IScore } from "../types";

export class ScoreHandler{
  private _collection: Collection<IScore>;

  constructor(collection: Collection<IScore>){
    this._collection = collection;
  }

  addScore = (req:Request, res:Response) => {
    const score = req.body;
    if (!score.username || !score.time || !score.level || !score.score){
      return res.status(responseStatus.badRequest).json({err: 'Not enought parametrs to create result record'})
    }
    this._collection.insertOne(score)
      .then((result: InsertOneResult<IScore>)=>res.status(responseStatus.created).json(result))
      .catch((err: any)=>res.status(responseStatus.error).json({err: 'Could not save score'}))  
  };

  getScore = async (req:Request, res:Response)=>{
    const {query} = req;
    const searchQuery = query.level === undefined ? {} : {level: Number(query.level)}
    let limit = 100;
    let skip = 0;

    if (!query.sort != !query.order){ // XOR if
      return res.status(responseStatus.badRequest).json({err: 'Missing sort or order query'})
    }

    if (query.limit !== undefined){
      limit = Number(query.limit);
      if (query.page !== undefined){
        skip = Number(limit*(Number(query.page) -1))
      }
    }

    const count = Math.ceil (await this._collection.countDocuments(searchQuery)/limit)

    this._collection.find(
      searchQuery,
      {projection: {_id: 0}}
    )
    .skip(skip)
    .limit(limit)
    .sort(    
      {[query.sort as string]: (sortQuery.order as any)[query.order as string]}
    ).toArray()
    .then((result: WithId<IScore>[])=> res.status(responseStatus.ok).json({data: result, pageCount: count}))
    .catch((err: any)=>res.status(responseStatus.error).json({err: 'Could not get score'}))
  }
}