const handleResult = (req, res, db) => {
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
}

module.exports = {
    handleResult
}