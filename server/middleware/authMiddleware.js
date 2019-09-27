const usersOnly = (req, res, next) => {
    
    if(req.session.user) {
        next()
    }
    else {
        res.status(401).send('Please log in')
    }
}

const adminsOnly = (req, res, next) => {

    console.log(req.session.user)

    if(!req.session.user.is_admin) {
        res.status(401).send('You are not an admin')
    }

    next()
}


module.exports = {
    usersOnly,
    adminsOnly
}