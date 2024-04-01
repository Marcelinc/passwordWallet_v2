const Website = require("../models/Website");

// @desc Get websites
// @route GET /api/website/getAll
// @access Public
const getWebsites = async(req, res) => {
    try{
        const websites = await Website.find();
        console.log(websites);
        if(websites.length > 0) {
            res.status(200).json({message: 'Success',websites});
        } else{
            res.status(500).json({message: 'Can`t find any websites'});
        }
    } catch(err){
        res.statsu(500).json({message:'Can`t get websites'})
    }
    
}

module.exports = {
    getWebsites
}