const express = require('express'); // import module
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const signin = require('./user');

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
    // db.select('*').from('users')
    // .then(result => res.json(result))
    // .catch(console.log)
    res.json("hi there!")
})

// get user data
// app.post('/user', (req, res) => {   })
app.post('/user', (req, res) => signin.handleUser(req, res, db))

// compare password and return user data to front end
app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        db('userlogin').where({
            email: email
        })
        .then(user => {
            if(user.length){
                const isValid = bcrypt.compareSync(password, user[0].password) 
                if (isValid){
                    db('users').where({
                        email: user[0].email
                    })
                    .then(userData => {res.json(userData[0])})
                    .catch(console.log)
                }
                else{
                    res.json("Sign in failure.")
                }
            }
            else(res.json("User doesn't exist."))
        })
        .catch(console.log)
    }
    else{
        res.json("Sign in failure.");
    }
})


// use transaction to add one data to two tables: userlogin, users
// also, create a user in every table with default value 0:
app.post('/signup', (req, res) => {
    const {name, email, password} =  req.body;
    if(name && email && password){
        const hash = bcrypt.hashSync(password);
        db.transaction((trx) => {
            return trx
            .insert({
                email: email,
                password: hash
            }, 'email')
            .into('userlogin')
            .then((loginEmail) => {
                return trx('users').insert({
                    email: loginEmail[0],
                    name: name
                }, '*')
            })
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(error => res.json("Fail to sign up."));
    }
    else{
        res.json("Sign up failure.");
    }
})

// load activity record
app.post("/activity", (req, res) => {
    const {email} = req.body;
    if(email){
        db("users")
        .where({email: email})
        .select('weight')
        .then(weight => {
            if(weight.length){ // if the user does exist
            // if the user have never saved data, the weight will be 0.
                if(weight[0].weight === 0){
                    res.json("No saved record.")
                }
                else{
                    db("activity")
                    .where({email: email})
                    .select("*")
                    .then(userActivity => {
                        res.json(userActivity[0])
                    })
                    .catch(console.log);
                }                 
            }
            else{ // guest user
                res.json("No saved record.")
            }
        })
        .catch(e => {console.log(e.name, e.message)});      
    }
    else{  
        // res.json("Get activity record failure.");
        res.json("No saved record.")
    }
})

// load exercise record
app.post("/exercise", (req, res) => {
    const {email} = req.body;
    if(email){
        db("users")
        .where({email: email})
        .select("weight")
        .then(weight => {
            if(weight.length){
            // if the user have never saved data, the weight will be 0.
                if(weight[0].weight === 0){
                    res.json("No saved record.")
                }
                else{
                    db("exercise")
                    .where({email: email})
                    .select("*")
                    .then(userExercise => {
                        res.json(userExercise[0])
                    })
                    .catch(console.log);
                }                
            }
            else{   // guest user
                res.json("No saved record.")
            }
        })
        .catch(console.log);        
    }
    else{
        // res.json("Get exercise record failure.");
        res.json("No saved record.")
    }
})

// save data to tables: weight, deficit, activity, exercise, carbohydrate, totalcalorie
app.put("/saveData", (req, res) => {
    const {email, weight, deficit, activity, exercise, dailyCarbon, dailyCalorie} = req.body;
    if(email, weight, deficit, activity, exercise, dailyCarbon, dailyCalorie){
        db('users')
        .where({email: email})
        .select('*')
        .then(user => {
            if(user.length){
                db.transaction(trx => {
                    return trx('users')
                    .select('*')
                    .where({email: email})
                    .update({
                        weight: weight,
                        deficit: deficit
                    })
                    .then(() => {
                        return trx('activity')
                        .where({email: email})
                        .update({
                            day1: activity[0],
                            day2: activity[1],
                            day3: activity[2],
                            day4: activity[3],
                            day5: activity[4],
                            day6: activity[5],
                            day7: activity[6],
                        })
                        .then(() => {
                            return trx('exercise')
                            .where({email: email})
                            .update({
                                day1: exercise[0],
                                day2: exercise[1],
                                day3: exercise[2],
                                day4: exercise[3],
                                day5: exercise[4],
                                day6: exercise[5],
                                day7: exercise[6]
                            })
                            .then(() => {
                                return trx("carbohydrate")
                                .where({email: email})
                                .update({
                                    day1: dailyCarbon[0],
                                    day2: dailyCarbon[1],
                                    day3: dailyCarbon[2],
                                    day4: dailyCarbon[3],
                                    day5: dailyCarbon[4],
                                    day6: dailyCarbon[5],
                                    day7: dailyCarbon[6]
                                })
                                .then(() => {
                                    return trx("totalcalorie")
                                    .where({email: email})
                                    .update({
                                        day1: dailyCalorie[0],
                                        day2: dailyCalorie[1],
                                        day3: dailyCalorie[2],
                                        day4: dailyCalorie[3],
                                        day5: dailyCalorie[4],
                                        day6: dailyCalorie[5],
                                        day7: dailyCalorie[6]
                                    })
                                    .catch(e => {console.log("totalcalorie", e)})
                                })
                                .catch(e => {console.log("carbohydrate", e)})
                            })
                            .catch(e => {console.log("exercise", e)})
                        })
                        .catch(e => {console.log("activity", e)})
                    })
                    .catch(e => {console.log("users", e)})
                })
                .then(() => res.json("ok"))
                .catch(e => console.log("db", e));
            }
            else{   // user doesn't exist
                res.json('user does not exist')
            }
        })
    }
    else{
        res.json("Calculation failure.");
    }
})

// "/result" : post 從database叫出上次儲存的結果
app.post("/result", (req, res) => {
    const {email} = req.body;
    if(email){
        db("users")
        .where({email: email})
        .select("*")
        .then(user => {
            db("carbohydrate")
            .where({email: email})
            .select("*")
            .then(userCarbon => {
                db("totalcalorie")
                .where({email: email})
                .select("*")
                .then(userCalorie => {
                    db("activity")
                    .where({email: email})
                    .select("*")
                    .then(userActivity => {
                        db("exercise")
                        .where({email: email})
                        .select("*")
                        .then(userExercise => {
                            res.json({
                                user: user[0],
                                userCarbon: userCarbon[0],
                                userCalorie: userCalorie[0],
                                userActivity: userActivity[0],
                                userExercise: userExercise[0]
                            })
                        })
                        .catch(console.log);
                    })
                    .catch(console.log);
                })
                .catch(console.log);
            })
            .catch(console.log);
        })
        .catch(console.log);
    }
    else{
        res.json("Get result failure.")
    }
})


// set port
// app.listen(3000, () => {console.log("server is running on 3000!")});

// port for heroku
app.listen(process.env.PORT || 3000, () => {
    console.log(`it's running on PORT ${process.env.PORT}, ${process.env.DATABASE_URL} `);
})
// run command: $ env PORT=3000 node server.js