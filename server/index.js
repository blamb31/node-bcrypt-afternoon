const express = require('express')
const app = express()
const session = require('express-session')
require('dotenv').config()
const massive = require('massive')

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env
const autCtlr = require('./controllers/auth')

app.use(express.json())

massive(CONNECTION_STRING).then( (db) => {
    app.set('db',db)
})

app.use(session({
    secret:SESSION_SECRET,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', autCtlr.register)

app.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`))
