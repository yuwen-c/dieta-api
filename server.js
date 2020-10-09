const express = require('express'); // import module
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const app = express(); // create one

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'Dieta'
    }
  });




app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// console.log("db", db.select('*').from('users'));

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(result => res.json(result))
    // res.json("hi there!")
})


// create an object variable to mimic database
// database => 大資料庫 {  }
// users => table [ ] = 想成都是object, 只是這個table需要有名字，所以用
// users[0] => table裡面一筆資料 { }
// users[0] 裡面的pair: { }的property 是欄位名稱，value是資料
const database = {
    table_userLogin: [
        {
            id:123,
            email: 'marina@gmail.com',
            password: '1111',
        },
    ],
    table_users:[
        {
            name:'marina',
            email: 'marina@gmail.com',
            weight: 55,
            deficit: 300,
        }
    ],
    table_activity: [
        {
            userEmail:'marina@gmail.com',  //table column改為email
            0:'1',  // table column 改為day1, day2...
            1:'1',
            2:'1',
            3:'1',
            4:'0',
            5:'3',
            6:'2',
        }
    ],
    table_exercise: [
        {
            userEmail:'marina@gmail.com',
            0:'0',
            1:'0',
            2:'0',
            3:'2',
            4:'0',
            5:'2',
            6:'1',
        }
    ],
    table_carbohydrate: [
        {
            userEmail: 'marina@gmail.com',
            day1:84,
            day2:84,
            day3:84,
            day4:145,
            day5:54,
            day6:205,
            day7:145,

        }
    ],
    table_totalCalorie: [
        {
            userEmail: 'marina@gmail.com',
            // protein: 0,
            // oil:0,

            day1:1273,
            day2:1273,
            day3:1273,
            day4:1515,
            day5:1152,
            day6:1757,
            day7:1515,
        }
    ]

} 

// compare password and return user data to front end
app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
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
            }
            else{
                res.json("wrong password------need change later")
            }
        }
        else(res.json("no such user"))
    })
    .catch(console.log)
})

// use transaction to add one data to two tables: userlogin, users
// also, create a user in every table with default value 0:
app.post('/signup', (req, res) => {
    const {name, email, password} =  req.body;
    const hash = bcrypt.hashSync(password);

    // method 1, trx as a query builder
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
        res.json(user[0])
    })
    .catch(error => console.log(error));

    // method 2: trx as a transaction obj:
    // db.transaction((trx) => {
    //     db.insert({
    //         email: email,
    //         password: hash
    //     }, ['email'])
    //     .into('userlogin')
    //     .transacting(trx)
    //     .then((loginEmail) => {
    //         return db('users').insert({
    //             email: loginEmail[0],
    //             name: name,
    //         }, ['*'])
    //         .transacting(trx)
    //     })
    //     .then(trx.commit)
    //     .catch(trx.rollback)
    // })
    // .then((user)=> {
    //     res.json(user[0])
    //     console.log(user[0]);
    // })
    // .catch((error)=> {
    //     console.log(error)
    // });
})

// load activity record
app.post("/activity", (req, res) => {
    if(req.body.email === database.table_activity[0].userEmail){
        //console.log(database.table_activity[0]);
        res.json(database.table_activity[0]);
    }
    else{
        res.status(404).json('get activity failure');;
    }
})

// load exercise record
app.post("/exercise", (req, res) => {
    if(req.body.email === database.table_exercise[0].userEmail){
        //console.log(database.table_exercise[0]);
        res.json(database.table_exercise[0]);
    }
    else{
        res.status(404).json('get exercise failure')
    }
})

// save data to database: weight, deficit, activity, exercise, carbohydrate, totalcalorie
app.put("/calculate", (req, res) => {
    const {email, weight, deficit, activity, exercise, dailyCarbon, dailyCalorie} = req.body;
    console.log(req.body);

    db('users')
    .where({ email: email })
    .update({
        weight: weight,
        deficit: deficit        
    })
    .then(console.log);

    db('activity')
    .where({ email: email})
    .update({
        day1: activity[0],
        day2: activity[1],
        day3: activity[2],
        day4: activity[3],
        day5: activity[4],
        day6: activity[5],
        day7: activity[6],
    })
    .then(console.log);

// str 轉 int? 好像不用轉也可以？
    db('exercise')
    .where({ email: email })
    .update({
        day1: exercise[0],
        day2: exercise[1],
        day3: exercise[2],
        day4: exercise[3],
        day5: exercise[4],
        day6: exercise[5],
        day7: exercise[6]
    })
    .then(console.log);

    db('carbohydrate')
    .where({ email: email })
    .update({
        day1: dailyCarbon[0],
        day2: dailyCarbon[1],
        day3: dailyCarbon[2],
        day4: dailyCarbon[3],
        day5: dailyCarbon[4],
        day6: dailyCarbon[5],
        day7: dailyCarbon[6]
    })
    .then(console.log);

    db('totalcalorie')
    .where({ email: email })
    .update({
        day1: dailyCalorie[0],
        day2: dailyCalorie[1],
        day3: dailyCalorie[2],
        day4: dailyCalorie[3],
        day5: dailyCalorie[4],
        day6: dailyCalorie[5],
        day7: dailyCalorie[6]
    })
    .then(console.log);

    res.json("ok");
})

// "/result" : post 從database叫出上次儲存的結果
app.post("/result", (req, res) => {
    if(req.body.email === database.table_totalCalorie[0].userEmail){
        res.json({
            dailyCalorie: database.table_totalCalorie[0],
            dailyCarbon: database.table_carbohydrate[0]
        })
    }
})


// set port
// app.listen(3000, () => {console.log("server is running on 3000!")});

// make a port for heroku
app.listen(process.env.PORT || 3000, () => {
    console.log(`it's running on PORT ${process.env.PORT}`);
})

// plan:
// ok "/" get: to see if it's working
// ok "/signin" post: sign in, return user 
// ok "/register" post: register
// ok"/activity" post: get activity data last week from database
// ok"/exercise" post: get exercise data
// ok"/calculate" put: 0. if weight = 0，從資料庫叫weight, deficit。1. do calculation, 2. show it on page (前端)
//     3. save 所有數據 to database(weight, totalDeficit, 每日總熱量, 每日碳水量, 活動運動量, )
// ok"/result" post: 從database叫出上次儲存的結果