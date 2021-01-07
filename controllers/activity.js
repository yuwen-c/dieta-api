const handleActivity = (req, res, db) => {
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
}

module.exports = {
    handleActivity
}