// third-party 
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
//local 
import routes from './router.js'

const app = express()

try {
    const uri = "mongodb://localhost:27017/angular-exam"

    await mongoose.connect(uri)
    console.log("DB connected") 
} catch (err) {
    console.error("DB not connected")
    console.error(err.message)
}
 
app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(5000, console.log("Server listening on http://localhost:5000"))