const dragonTreasure = async (req, res) => {
    const db = req.app.get('db')
    const treasure = await db.get_dragon_treasure([1])

    res.status(200).send(treasure)
}

const getUserTreasure = async (req, res) => {

    const db = req.app.get('db')
    const treasure = await db.get_user_treasure([req.session.user.id])

    res.status(200).send(treasure)
}

const addUserTreasure = async (req, res) => {
    console.log('hit add user treasure')

    const { treasureURL } = req.body
    const { id } = req.session.user

    const db = req.app.get('db')

    const userTreasure = await db.add_user_treasure([treasureURL, id])


    res.status(200).send(userTreasure)
}

const getAllTreasure = async (req, res) => {

    const db = req.app.get('db')

    const treasure = await db.get_all_treasure()

    res.status(200).send(treasure)
}

module.exports = {
    dragonTreasure,
    getUserTreasure,
    addUserTreasure,
    getAllTreasure
}