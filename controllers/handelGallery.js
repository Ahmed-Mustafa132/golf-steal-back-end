const express = require("express");
const gallery = require('../models/galleryModel');

const getAllGallery = async (req, res) => {
    const limit = parseInt(req.query.limit) || 7;
    const page = parseInt(req.query.page) || 0;
   try {
       const galleries = await gallery.find({}).skip(page).limit(limit);
       galleryWithEncodedImages = galleries.map(gallery => {
           const galleryObject = gallery.toObject();
           console.log(galleryObject);
           if (gallery.Image && gallery.Image.data) {
               galleryObject.encodedImage = `data:${gallery.Image.contentType};base64,${gallery.Image.data.toString('base64')}`;
            }
            return galleryObject;
        });
        res.status(200).send({count: galleries.length, data: galleryWithEncodedImages});

   } catch (err) {
    res.status(500).send({err:err.message, message: "error"});
  }
};
  

const creatGallery = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file;
        const newGallery = new gallery({
            name,
            Image: {
                data: image.buffer,
                contentType: req.file.mimetype
            }
        });
        await newGallery.save();
        res.send(newGallery);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = {
    getAllGallery,
    creatGallery
}