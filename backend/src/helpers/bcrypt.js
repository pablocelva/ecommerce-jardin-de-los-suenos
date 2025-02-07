const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt)
}

const verifyPassword = async (password, passwordHashed) => {
    return await bcrypt.compareSync(password, passwordHashed)
}

module.exports = { hashPassword, verifyPassword }