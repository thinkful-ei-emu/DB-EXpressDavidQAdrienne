const app = require('express')();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const knex = require('knex');
const bookmarksRoute = require('./bookmarks/bookmarksRouter');

const {NODE_ENV} = require('./config');

const morganOptions = 'common';

app.use(helmet());

app.use(cors());
app.use(morgan(morganOptions));
app.get('/',(req,res)=>{
  res.status(200).send('Hello World');
});

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

app.set('db', db);

app.use('/bookmarks', bookmarksRoute);

app.use((err, req, res, next)=>{
  let response;
  if(NODE_ENV === 'production'){
    console.log(err);
    response = {error:{message:'Critical Server Error'}};
  }else{
    response = {error:{message:err.message,err}};
  }
  res.status(500).json(response);
});
module.exports = app;