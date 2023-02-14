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
    console.log('start addScore')
    const score = req.body;
    
    this._collection.insertOne(score)
    .then((result: InsertOneResult<IScore>)=>{
      console.log('end addScore')
      res.status(responseStatus.created).json(result)
    })
    .catch((err: any)=>{
      console.log('Error addScore')
      res.status(responseStatus.error).json({err: 'Could not save score'})
    })
    
  };

  getScore =(req:Request, res:Response)=>{
    console.log("start getScore")
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
    
    this._collection.find(
      searchQuery,
      {projection: {_id: 0}}
    )
    .skip(skip)
    .limit(limit)
    .sort(    
      {[query.sort as string]: (sortQuery.order as any)[query.order as string]}
    ).toArray()
    .then((result: WithId<IScore>[])=> {
        console.log("end getScore");
        res.status(responseStatus.ok).json(result
    )})
    .catch((err: any)=>{
      console.log('Error addScore')
      res.status(responseStatus.error).json({err: 'Could not get score'})
    })
    
  }
}