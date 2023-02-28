# rs-clone-server

## How to start
1. npm i 
2. npm start

## How to use it

### Registration
URL: ``` \user ``` <br>
Method: ```POST```.<br>
Data Params:
```
{
  username: string | number,
  password: string | number,
}
```

### Login
URL: ``` \login ``` <br>
Method: ```POST```.<br>
Data Params:
```
{
  username: string | number,
  password: string | number,
}
```

### Add winner
URL: ``` \score ``` <br>
Method: ```POST```.<br>
Data Params:
```
{
  username: string,
  level: number,
  score: number,
  time: number,
}
```
### Get winner list
URL: ``` \score ``` <br>
Method: ```POST```.<br>
Query Params:<br>
Combained: <br>```sort=[number]```, <br>
```order=['ASC'\'DESC']``` <br>
Others: <br>
```level=[number]```<br>
```page=[number]``` <br>
```limit=[number]``` <br>





