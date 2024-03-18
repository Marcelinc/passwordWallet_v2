// @desc Hello world
// @route POST 
// @access Public
const sayHello = async (req,res) => {
    res.status(200).josn({message: 'Hello world'})
}

module.exports = {
    sayHello
}