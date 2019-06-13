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
        req.session.user = registeredUser
        res.status(201).send(req.session.user)
    }
}