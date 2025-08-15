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

boardController.get("/:id/ratings", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)

    const comments = await Comment.findOne({ _id: id })

    res.json({ message: comments })
})

boardController.post('/:id/ratings', async (req, res) => {
    const boardId = req.params.id;
    const { score, comment } = req.body;

    if (!score || !comment) {
        return res.status(400).json({ status: 400, message: 'Score and comment are required' });
    }

    try {
        const board = await Boards.findById(boardId);
        if (!board) return res.status(404).json({ status: 404, message: 'Board not found' });

        board.comments.push({ score, comment, date: new Date() });
        board.upvotes = board.comments.length;

        await board.save();

        res.json({
            status: 200,
            message: 'Rating added successfully',
            rating: board.comments[board.comments.length - 1],
            totalRatings: board.upvotes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Server error while saving rating' });
    }
});

boardController.post("/:id/order", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)
    const board = req.body

    await Boards.updateOne({ _id: id }, board)

    res.json({ status: 200 })
})

boardController.get("/:id/:user_id/ordered", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)
    const userId = new Types.ObjectId(req.params.user_id)
    let ordered = await Boards.findOne({ _id: id })

    if (ordered.upvoted.includes(userId)) {
        ordered = true
    } else {
        ordered = false
    }

    res.json({ status: 200, bool: ordered })
})


boardController.get("/:id/:user_id/isCreator", async function (req, res) {
    try {
        const { id, user_id } = req.params

        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ status: 400, bool: false })
        }

        const board = await Boards.findOne({ _id: id }).lean()
        if (!board) return res.json({ status: 200, bool: false })

        const isOwner = board.owner_id.toString() === user_id.toString()

        res.json({ status: 200, bool: isOwner })
    } catch (err) {
        res.status(500).json({ status: 500, bool: false })
    }
});


boardController.get("/:user_id/cart", async function (req, res) {
    try {
        const userId = new Types.ObjectId(req.params.user_id)

        const boards = await Boards.find({ upvoted: userId })

        if (boards.length > 0) {
            res.json({ status: 200, boards })
        } else {
            res.json({ status: 404, message: "Nothing found for this user." })
        }
    } catch (err) {
        res.json({ status: 500, message: "Server error." })
    }
});


boardController.post("/:id/:user_id/cart-remove", async function (req, res) {
    const id = new Types.ObjectId(req.params.id)
    const userId = new Types.ObjectId(req.params.user_id)
    let ordered = await Boards.findOne({ _id: id })

    ordered.upvoted = ordered.upvoted.filter(u => !u.equals(userId))

    await Boards.updateOne({ _id: id }, ordered)

    res.json({ status: 200 })
});


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

boardController.post("/search-products", async (req, res) => {
  const query = req.body;

  const boards = await Boards.find({ title: { $regex: query.name, $options: "i" } }).lean();

  res.json({ status: 200, recievedData: boards });
});


export default boardController