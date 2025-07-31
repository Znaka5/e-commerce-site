//third-party
import { Router } from "express"
import { Types } from "mongoose"
import bcrypt from "bcrypt"
//local
import authService from "../services/users-auth.js"
import User from "../models/user.js"
import Boards from "../models/boards.js"


const userController = Router()

userController.post("/register", async function (req, res) {
    const userData = req.body

    try {
        const token = await authService.register(userData)

        if (token === "User already exists" || token === "Invalid data") {
            res.json({ status: 400, recievedData: "error", message: token })

        } else {
            const obj = await User.create(userData)

            res.json({ status: 200, recievedData: obj })
        }

    } catch (err) {
        res.json({ status: 400, recievedData: "error", message: "Cannot register" })
    }

})

userController.post("/login", async function (req, res) {
    const userData = req.body

    try {
        const token = await authService.login(userData)

        if (token === "error") {
            res.json({ status: 400, recievedData: "error", message: "Wrong email/username or password" })
        } else {
            res.json({ status: 200, recievedData: token[0], obj: token[1] })
        }

    } catch (err) {
        res.json({ status: 400, recievedData: "error", message: "User doesn't exist" })
    }
})

userController.post("/create", async function (req, res) {
    let userData = req.body
    userData.upvotes = "0"
    userData.comments = []
    userData.upvoted = []

    try {

        await Boards.create(userData)

        res.json({ status: 201 })
    } catch (err) {
        res.json({ status: 400, recievedData: "error" })
    }
})

userController.get("/:id/profile", async function (req, res) {
    const id = req.params.id
    const user = await User.findOne({ _id: id })

    res.json({ message: user })
})

userController.post("/profile-edit", async function (req, res) {
    let userData = req.body


    if (userData.username === "" || userData.email === "" || userData.password === "") {
        res.json({ status: 400, recievedData: "error", message: "Invalid data" })
    } else {
        userData.password = await bcrypt.hash(userData.password, 10)
        const id = new Types.ObjectId(userData._id)
        
        try {
            await User.updateOne({ _id: id }, userData)

            const response = await User.findOne({ _id: id })

            res.json({ status: 200, recievedData: response })
        } catch (err) {
            res.json({ status: 400, recievedData: "error", messsage: "Cannot update user credentials" })
        }
    }
})

export default userController