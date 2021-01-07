const handleSaveData = (req, res, db) => {
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
}

module.exports = {
    handleSaveData
}