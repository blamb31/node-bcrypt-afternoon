const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username,password, isAdmin} = req.body

        const results = await db.get_user(username)
        const existingUser = results[0]

        if(existingUser){
            res.status(409).send('Username Taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const registeredUser = await db.register_user(isAdmin,username,hash)


        delete registeredUser.password
        req.session.user = registeredUser[0]
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body

        const foundUsers = await db.get_user(username)
        const user = foundUsers[0]

        if(!user) {
            res.status(401).send('User not found. Please register as a new user before logging in.')
        }
        
        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            res.status(403).send('Incorrect Password')
        }

        delete user.hash
        console.log(2222222222, user)
        req.session.user = user
        console.log(55555555, req.session.user)
        res.status(200).send(req.session.user)

    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}