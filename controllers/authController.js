const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    console.log('touch register')

    const {username, password, isAdmin} = req.body

    const db = await req.app.get('db')
    const existingUser = await db.get_user([username])

    if(existingUser[0]) {
        res.status(409).send('Username taken')
        return
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const registeredUser = await db.register_user([isAdmin, username, hash])
    const user = registeredUser[0]
    delete user.hash

    req.session.user = {...user}

    res.status(201).send(req.session.user)

}

const login = async (req, res) => {

    const { username, password } = req.body

    const db = await req.app.get('db')
    const foundUser = await db.get_user([username])

    const user = foundUser[0]
    if(!user) {
        res.status(401).send('User not found. Please register as a new user before logging in.')
        return
    }

    console.log(user)

    const isAuthenticated = bcrypt.compareSync(password, user.hash)

    if (isAuthenticated) {
        delete user.hash
        req.session.user = {...user}

        res.status(200).send(req.session.user)
    }
    else {
        res.status(401).send('Invalid password')
    }
}

const logout = async (req, res) => {

    req.session.destroy()
    res.status(200).send('OK')
}

module.exports = {
    register,
    login,
    logout
}