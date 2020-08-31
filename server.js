const expresss = require('express');

const app = express();

// create an object variable to mimic database
const database = {
    users: [
        {
            id:123,
            name:'marina',
            email: 'marina@gmail.com',
            password: '1111',
        },
    ]
} 
// 待修改
const initialState = {
    name: '',
    email: '',
    password: '',
  
    weight : 0,
    BMR : 0,
    isSignIn : false,
    route: 'home', // sign in, sign up, weight, activity, exercise, nutrition
  
    deficit : 0,
    activity : [], // store week activity, like: ['0', '1', '0', '1', '0', '3', '2']
    exercise : [], // store week exercise, like: ['0', '1', '0', '1', '0', '3', '2']
    
    protein : 0,
    oil : 0,
    dailyCalorie : [], // 7 days daily calorie
    dailyCarbon : [], // 7 days daily carbohydrate
  
    checkedActivity : initialchecked,
    checkedExercise : initialchecked,
    // the default of checked attribute of options
  
    modifySpeedUp: false,
    modifySlowDown: false, 
    modifyOption: 0,
  }
  


// plan:
// "/" get: to see if it's working
// "/signin" post: sign in 
// "/register" post: register
// "/loadActivity" get: get activity data last week from database
// "/loadExercise" get: get exercise data
// "/calculate" get: 0. if weight = 0，從資料庫叫weight, deficit。1. do calculation, 2. show it on page (前端)
//     3. save 所有數據 to database(weight, totalDeficit, 每日總熱量, 每日碳水量, 活動運動量, )
// "/result" get: 從database叫出上次儲存的結果

app.listen(3000);