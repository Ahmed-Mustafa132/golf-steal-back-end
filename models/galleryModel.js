const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    name: String,
    Image: {
        data: Buffer,
        contentType: String,
    },
});

const Gallery = mongoose.model("gallery", gallerySchema);
module.exports = Gallery;
