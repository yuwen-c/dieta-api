const handleUser = (req, res, db) => {
    console.log(req.body)
        const {email} = req.body;
        if(email){
            db('users')
            .where({email: email})
            .then(user => {res.json(user[0])})
            .catch(console.log);        
        }
        else{
            res.json("Unable to get user");
        }
}


module.exports = {
    handleUser: handleUser
}