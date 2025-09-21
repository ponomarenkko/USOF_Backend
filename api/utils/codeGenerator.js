import randomstring from "randomstring"

export default length => {
    return randomstring.generate({ length, charset: `numeric` })
}