const handleSignin = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleSignin
}