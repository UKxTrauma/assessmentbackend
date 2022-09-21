const Users = require("./userModel");

exports.addUser = async (req, res) => {
    try {
        if (req.body.name && req.body.email && req.body.password) {
            console.log(req.body)
            const newUser = new Users(req.body);
            const token = await newUser.generateAuthToken();
            await newUser.save();
            res.status(201).send({ user: newUser.name, token })
        } else {
            console.log("no name, email and/or password entered")
            res.status(400).send({ error: "no name, email and/or password entered" })
        }
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).send({ error: "Email already registered" })
        } else {
            console.log("error in addUser")
            res.status(500).send({ error: "internal server error" })
            console.log(error)
        }
    }
}

exports.listUsers = async (req, res) => {
    try {
        let userList = await Users.find({});
        if (userList.length > 0) {
            console.log("inside listUsers")
        res.status(200).send({userList});
        } else {
            console.log("Nothing to display")
            res.status(400).send({error: "request failed, no users to display"})
        }
    } catch (error) {
        console.log("error in listUsers")
        res.status(500).send({error:"internal server error"})
        console.log(error)
    }
}

exports.userDelete = async (req, res) => {
    try {
        if (req.user) {
        await Users.findByIdAndDelete({ _id : req.user._id })
        res.status(200).send("Account deleted")
        } else {
            console.log("Please log in")
            res.status(400).send({error: "request failed, please log in"})
        }
    } catch (error) {
        console.log("error in userDeleteOne")
        res.status(500).send({error:"internal server error"})
        console.log(error)
    }
}

exports.nameEdit = async (req, res) => {
    try{
        if(req.user) {
            await Users.findByIdAndUpdate({ _id : req.user._id } ,{ $set : {name: req.body.name} })
            res.status(200).send(await Users.find({name: req.body.name}))
        } 
    } catch (error) {
            res.status(400).send(console.log("Failed to update items"))
            console.log(error)
    }
}

exports.emailEdit = async (req, res) => {
    try{
        if(req.user) {
            await Users.findByIdAndUpdate({_id : req.user._id} ,{ $set : {email: req.body.email} })
            res.status(200).send(await Users.find({email: req.body.email}))
        } 
    } catch (error) {
            res.status(400).send(console.log("Failed to update items"))
            console.log(error)
    }
}

exports.passwordEdit = async (req, res) => {
    try{
        if(req.user) {
            await Users.findByIdAndUpdate({_id : req.user._id} ,{ $set : {password: req.body.password} })
            res.status(200).send(await Users.find({password: req.body.password}))
        } 
    } catch (error) {
            res.status(400).send(console.log("Failed to update items"))
            console.log(error)
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.filterByCredentials(email, password)
        const token = user.generateAuthToken()
        res.status(200).send({ user : user.name, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}