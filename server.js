const express = require('express'); // import module
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const user = require('./controllers/user');
const signin = require('./controllers/signin');
const signup = require('./controllers/signup');
const activity = require('./controllers/activity');
const exercise = require('./controllers/exercise');
const saveData = require('./controllers/saveData');
const result = require('./controllers/result');

const app = express(); // create one

const db = knex({
    client: 'pg',
    connection: {
        // connectionString: process.env.DATABASE_URL,
        // ssl: {
        //   rejectUnauthorized: false
        // }
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'Dieta'
    }
  });

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {
    res.json("hi there!")
})

// get user data
// app.post('/user', (req, res) => {   })  //original syntax
app.post('/user', (req, res) => user.handleUser(req, res, db));

// compare password and return user data to front end
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));


// use transaction to add one data to two tables: userlogin, users
// also, create a user in every table with default value 0:
app.post('/signup', (req, res) => signup.handleSignup(req, res, db, bcrypt));

// load activity record
app.post("/activity", (req, res) => activity.handleActivity(req, res, db));

// load exercise record
app.post("/exercise", (req, res) => exercise.handleExercise(req, res, db));

// save data to tables: weight, deficit, activity, exercise, carbohydrate, totalcalorie
app.put("/saveData", (req, res) => saveData.handleSaveData(req, res, db));

// "/result" : post 從database叫出上次儲存的結果
app.post("/result", (req, res) => result.handleResult(req, res, db));


// set port
// app.listen(3000, () => {console.log("server is running on 3000!")});

// port for heroku
app.listen(process.env.PORT || 3000, () => {
    console.log(`it's running on PORT ${process.env.PORT}, ${process.env.DATABASE_URL} `);
})
// run command: $ env PORT=3000 node server.js