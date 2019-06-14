const express = require('express')
const app = express()
const session = require('express-session')
require('dotenv').config()
const massive = require('massive')

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env
const authCtlr = require('./controllers/auth')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')


app.use(express.json())

massive(CONNECTION_STRING).then( (db) => {
    app.set('db',db)
    app.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`))
})

app.use(session({
    secret:SESSION_SECRET,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', authCtlr.register)
app.post('/auth/login', authCtlr.login)
app.get('/auth/logout', authCtlr.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user',auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user',auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all',auth.usersOnly,auth.adminsOnly, treasureCtrl.getAllTreasure)
