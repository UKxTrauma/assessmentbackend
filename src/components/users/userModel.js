const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

userSchema.statics.filterByCredentials = async (email, password) => {
    const user = await Users.findOne({email})
    if (!user) {
        throw new Error("Wrong email")
    }
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
        throw new Error("Wrong password")
    }
    return user
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this.id }, process.env.SECRET);
    return token;
}

const Users = mongoose.model('Users', userSchema);

module.exports = Users