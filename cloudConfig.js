//configuring our cloudinary account with the backend

//form npm doc of multer-storage-cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//form the cloudinarydocs not npm docs
//cloud_name , api_key , api_secret default names in the config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV", //defining the folder in the cloudinary account
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
};