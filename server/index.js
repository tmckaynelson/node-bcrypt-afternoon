require('dotenv').config()

const express = require('express')
const session = require('express-session')
const massive = require('massive')

const authCtrl = require('../controllers/authController')
const treasureCtrl = require('../controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env

const app = express()

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
}))

massive(CONNECTION_STRING).then( dbInstance => {
    app.set('db', dbInstance)
    console.log('db connected')
})
.catch( error => {
    console.log(error)
})


app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

app.listen(SERVER_PORT, () => {
    console.log('server running')
})
