const handleSignup = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleSignup
}