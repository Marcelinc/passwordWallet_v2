const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const cors = require('cors')

const PORT = process.env.PORT || 8000


const app = express()



//Middlewares
app.use(cors({
    methods: ["POST","GET"],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//Connect to DB
connectDB()

app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/password',require('./routes/passwordRoutes'))

app.listen(PORT,() => console.log('Server is up and running'))
