//third-party
import { Router } from "express"
import { Types } from "mongoose"
//local
import Boards from "../models/boards.js"
import Comment from "../models/comments.js"

const boardController = Router()

boardController.get("/catalogs", async function (req, res) {
    const boards = await Boards.find({}).lean()

    res.json({ message: boards })
})

boardController.get("/:id/rating", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)

    const comments = await Comment.findOne({ _id: id })

    res.json({ message: comments })
})

boardController.get("/ratings", async function (req, res) {
    const comments = await Comment.find({})

    res.json({ message: comments })
})

boardController.post("/ratings", async function (req, res) {
    let userData = req.body

    userData.post_id = new Types.ObjectId(userData.post_id)
    userData.likes = 0
    userData.liked = []

    try {
        const data = await Comment.create(userData)
        let board = await Boards.findOne({ _id: userData.post_id })

        board.comments.push(data)

        await Boards.updateOne({ _id: userData.post_id }, board)

        res.json({ satus: 200, recievedData: data })
    } catch (err) {
        res.json({ status: 400, recievedData: "error" })
    }
})

// boardController.post("/:id/comments-like", async function (req, res) {
//     const id = new Types.ObjectId(req.params.id)
//     const { userId } = req.body

//     try {
//         let data = await Comment.findOne({ _id: id })
//         data.likes = data.likes + 1
//         data.liked.push(userId)

//         let board = await Boards.findOne({ _id: data.post_id })

//         let index = board.comments.findIndex(obj => obj._id === data._id)
//         board.comments.splice(index, 1, data)

//         await Boards.updateOne({ _id: data.post_id }, board)
//         await Comment.updateOne({ _id: data._id }, data)

//         const comments = await Comment.find({})

//         res.json({ satus: 200, recievedData: comments })
//     } catch (err) {
//         res.json({ status: 400, recievedData: "error" })
//     }
// })

boardController.post("/:id/rating-edit", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)
    const message = req.body

    if (message.message === "") {
        return res.json({ status: 400, recievedData: "error", message: "Cannot have empty message" })
    }

    try {
        let data = await Comment.findOne({ _id: id })
        data.message = message.message

        let board = await Boards.findOne({ _id: data.post_id })

        let index = board.comments.findIndex(obj => obj._id.equals(data._id))
        let comment = board.comments[index]
        comment.message = data.message

        await Boards.updateOne({ _id: data.post_id }, board)
        await Comment.updateOne({ _id: data._id }, data)

        res.json({ satus: 200, recievedData: board })
    } catch (err) {
        res.json({ status: 400, recievedData: "error", message: "Some error has occured" })
    }
})

boardController.get("/:id/rating-delete", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)

    try {
        let data = await Comment.findOne({ _id: id })
        let board = await Boards.findOne({ _id: data.post_id })

        let index = board.comments.findIndex(obj => obj._id === data._id)
        board.comments.splice(index, 1)

        await Boards.updateOne({ _id: data.post_id }, board)
        await Comment.deleteOne({ _id: data._id }, data)

        const comments = await Comment.find({})

        res.json({ satus: 200, recievedData: comments })
    } catch (err) {
        res.json({ status: 400, recievedData: "error" })
    }
})

boardController.get("/:id/ratings", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)
    const comments = await Comment.find({ post_id: id }).lean()

    res.json({ message: comments })
})


boardController.get("/:id/details", async function (req, res) {
    const id = req.params.id
    const board = await Boards.findOne({ _id: id })

    res.json({ message: board })
})

boardController.get("/best-sellers", async function (req, res) {
    const boards = await Boards.find({})
        .sort({ upvotes: -1 })
        .limit(10);
    res.json({ message: boards });
});


boardController.get("/:id/:user_id/rating", async function (req, res) {
    const id = req.params.id
    const userId = new Types.ObjectId(req.params.user_id)
    let board = await Boards.findOne({ _id: id })
    board.upvotes = `${Number(board.upvotes) + 1}`
    board.upvoted.push(userId)

    try {
        await Boards.updateOne({ _id: board._id }, board)

        res.json({ satus: 200, recievedData: board })
    } catch (err) {
        res.json({ status: 400, recievedData: "error" })
    }
})

boardController.get("/:id/delete", async function (req, res) {
    const id = req.params.id
    const board = await Boards.findOne({ _id: id })

    try {
        const res = await Comment.deleteMany({ post_id: board._id })

        await Boards.deleteOne({ _id: board._id }, board)

        res.json({ status: 200, data: res })
    } catch (err) {

        res.json({ status: 400 })
    }
})

boardController.post("/:id/edit", async function (req, res) {
    const id = req.params.id
    let boardData = req.body

    if (boardData.title === "") {
        return res.json({ status: 400, recievedData: "error", message: "title must be filled" })
    }

    try {
        await Boards.updateOne({ _id: id }, boardData)

        res.json({ status: 201 })
    } catch (err) {
        res.json({ status: 400, recievedData: "error", message: "error updating" })
    }
})

boardController.post("/search-products", async function (req, res) {
    const query = req.body
    let boards = await Boards.find({title: query.name}).lean()

    if (query.filter === "top") {
        boards = boards.sort((a, b) => b.upvotes - a.upvotes)
    } else {
        boards = boards.sort((a, b) => a.upvotes - b.upvotes)
    }

    res.json({status: 200, recievedData: boards})
})

// boardController.post("/search-comments", async function (req, res) {
//     const query = req.body
//     let boards = await Comment.find({message: query.name}).lean()

//     if (query.filter === "top") {
//         boards = boards.sort((a, b) => b.upvotes - a.upvotes)
//     } else {
//         boards = boards.sort((a, b) => a.upvotes - b.upvotes)
//     }
    
//     res.json({status: 200, recievedData: boards})
// })

export default boardController