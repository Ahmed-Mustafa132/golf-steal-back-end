const fs = require("fs");
const path = require("path");
const gallery = require("../models/galleryModel");

const getAllGallery = async (req, res) => {
  const limit = parseInt(req.query.limit) || 7;
  const page = parseInt(req.query.page) || 0;
  try {
    const galleries = await gallery
      .find({})
      .skip(page * limit)
      .limit(limit);

    const total = await gallery.countDocuments();

    const galleryWithEncodedImages = galleries.map((galleryDoc) => {
      const galleryObject = galleryDoc.toObject();
      if (galleryObject.Image && typeof galleryObject.Image.data === "string") {
        const imagePath = path.join(
          __dirname,
          "..",
          "gallery",
          galleryObject.Image.data
        );
        if (fs.existsSync(imagePath)) {
          const imgBuffer = fs.readFileSync(imagePath);
          galleryObject.encodedImage = `data:${
            galleryObject.Image.contentType
          };base64,${imgBuffer.toString("base64")}`;
        } else {
          galleryObject.encodedImage = null;
        }
      } else {
        galleryObject.encodedImage = null;
      }
      return galleryObject;
    });

    res.status(200).send({
      count: total,
      page,
      limit,
      data: galleryWithEncodedImages,
    });
  } catch (err) {
    res.status(500).send({ err: err.message, message: "error" });
  }
};

const creatGallery = async (req, res) => {
  try {
    const images = req.files;
    if (!images || images.length === 0) {
      return res.status(400).send("No images uploaded");
    }

    const galleryDir = path.join(__dirname, "..", "gallery");
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir);
    }

    const savedGalleries = [];
    for (const image of images) {
      const fileName = `${Date.now()}_${image.originalname}`;
      const filePath = path.join(galleryDir, fileName);
      fs.writeFileSync(filePath, image.buffer);

      const newGallery = new gallery({
        name: "", // No title
        Image: {
          data: fileName,
          contentType: image.mimetype,
        },
      });
      await newGallery.save();
      savedGalleries.push(newGallery);
    }
    res.send(savedGalleries);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
module.exports = {
  getAllGallery,
  creatGallery,
};
