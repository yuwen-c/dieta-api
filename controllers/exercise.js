const handleExercise = (req, res, db) => {
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
}

module.exports = {
    handleExercise
}