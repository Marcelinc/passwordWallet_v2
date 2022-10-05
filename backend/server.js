const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const cors = require('cors')

const PORT = process.env.PORT || 8000


const app = express()


//Connect to DB
connectDB()

//Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))




app.listen(PORT,() => console.log('Server is up and running'))
