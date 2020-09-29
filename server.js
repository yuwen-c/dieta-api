const express = require('express'); // import module
const cors = require('cors');

const app = express(); // create one

// plan:
// ok "/" get: to see if it's working
// ok "/signin" post: sign in, return user 
// ok "/register" post: register
// ok"/activity" post: get activity data last week from database
// ok"/exercise" post: get exercise data
// ok"/calculate" put: 0. if weight = 0，從資料庫叫weight, deficit。1. do calculation, 2. show it on page (前端)
//     3. save 所有數據 to database(weight, totalDeficit, 每日總熱量, 每日碳水量, 活動運動量, )
// ok"/result" post: 從database叫出上次儲存的結果

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {
    res.json("hi there!")
})
// **** get 不能有body，要傳的資料會放在網址。 (有放body會出現syntax error)
// **** body-parser用在post和put, 跟get, delete無關


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
            userEmail:'marina@gmail.com',
            0:'1',
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

app.post('/signin', (req, res) => {
    if(req.body.email === database.table_userLogin[0].email && req.body.password ===database.table_userLogin[0].password){
        res.json(database.table_users[0])
    }
    else{
        res.status(404).json('signin failed');
    }
})


app.post('/signup', (req, res) => {
    console.log("signup", req.body.name);
    const {name, email, password} = req.body;
    if(name && email && password){
        database.table_userLogin.push({
            id: 124,
            email: email,
            password: password
        });
        database.table_users.push({
            id: 124,
            name: name, 
            email: email,
            weight: 0,
            deficit: 0,
        });
        res.json(database.table_users[database.table_users.length-1]);
    }
    else{
        res.status(404).json("registration failed!!")
    }
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

// "/calculate": 
app.put("/calculate", (req, res) => {
    if(req.body.email === database.table_carbohydrate[0].userEmail){
        let carbohydrateObj = {};
        req.body.dailyCarbon.map((item, index) => {
            carbohydrateObj = Object.assign(carbohydrateObj, {[`day${index+1}`] : item})
        })
        database.table_carbohydrate[0] = Object.assign(database.table_carbohydrate[0], carbohydrateObj);

        let totalCalorie = {};
        req.body.dailyCalorie.map((item, index) => {
            totalCalorie = Object.assign(totalCalorie, {[`day${index+1}`]: item});
        });
        database.table_totalCalorie[0] = Object.assign(database.table_totalCalorie[0], totalCalorie)
    }
    res.json("ok")
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
app.listen(3000, () => {console.log("server is running on 3000!")});