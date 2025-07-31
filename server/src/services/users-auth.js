//third-party
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
//local
import User from "../models/user.js"
import { secret } from "../secret.js"


const genToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        password: user.password
    }

    const token = jwt.sign(payload, secret, { expiresIn: "200h" })

    return token
}

const register = async (userData) => {
    const exist = await User.findOne({ email: userData.email, username: userData.username })

    if (exist) {
        return "User already exists"
    }
    
    if (userData.password == "" || userData.email === "" || userData.username === "") {
        return "Invalid data"
    }

    return genToken(userData)
}

const login = async (userData) => {
    const exist = await User.findOne({ email: userData.email, username: userData.username })
    const isValid = await bcrypt.compare(userData.password, exist.password)

    if (!isValid) {
        return "error"
    }

    return [genToken(exist), exist]
}

const authService = {
    register,
    login
}

export default authService