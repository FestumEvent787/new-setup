const { admin } = require("../firebase-config");
const bucket = admin.storage().bucket();

const imageUpload = async (imageFile) => {
  try {
    if (Array.isArray(imageFile)) {
      let imageUrl = [];
      imageFile.forEach((item) => {
        const fileName = item.originalname;
        const fileUploadData = bucket
          .file(fileName)
          .createWriteStream()
          .end(item.buffer);

        imageUrl.push(
          `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_IMAGE_UPLOAD_URL}/o/${fileName}?alt=media`
        );
      });
      return imageUrl;
    } else {
      const fileName = imageFile.originalname;
      const fileUploadData = bucket
        .file(fileName)
        .createWriteStream()
        .end(imageFile.buffer);

      let singleImageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_IMAGE_UPLOAD_URL}/o/${fileName}?alt=media`;
      return singleImageUrl;
    }
  } catch (error) {
    console.error("imageUploadError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = imageUpload;
