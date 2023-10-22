const express = require("express");
const router = express.Router();
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
const config = require("./firebaseConfigs");

require('dotenv').config();    

const apiKey=process.env.FireBaseApiKey

//Implemented an API key authentication middleware to secure specific routes.
const apiKeyAuthMiddleware = (req, res, next) => {
    const providedApiKey = req.headers['x-api-key'];//Checking for a valid API key in the request headers.
    if (providedApiKey === apiKey) {//If valid, continue to the next middleware, 
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });//Otherwise, return a 401 Unauthorized response.
    }
  };

// Check if the 'config' object exists
if (config && config.fireBaseApp) {

    // Initialize Cloud Storage and get a reference to the service
    const storage = getStorage();

    // Setting up multer as a middleware to handle file uploads
    const upload = multer({ storage: multer.memoryStorage() });

    router.post("/firebase", apiKeyAuthMiddleware, upload.single("file"), async (req, res) => {
        try {
            const dateTime = giveCurrentDateTime();
            

            //Giving the bucket Name and the Orginal name to be stored in the Firebase Bucket
            const storageRef = ref(storage, `bucketImages/${req.file.originalname} ${dateTime}`);

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file to the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            // Get the public URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);


            return res.send({
                message: 'File uploaded to Firebase storage',
                data: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL
            });
        } catch (error) {
            return res.status(400).send(error.message);
        }
    });
} else {
    console.error("Missing 'config' object or 'firebaseConfig' in firebaseConfig.js");
}

function giveCurrentDateTime() {
    const today = new Date();
    const dateTime = today.toISOString();
    return dateTime;
}

module.exports = router;
