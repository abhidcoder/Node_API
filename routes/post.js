
const express = require('express');             //Imported Express and created an instance of the routerlication.
const router = express.Router();                        // Create a router instead of an router
const multer = require('multer');               // Import the 'multer' library for handling file uploads
const path = require('path');                   // Import the 'path' module for working with file paths
const { dbData } = require('../models/PostSchema');  //Imported the database model from './models/Schema'.
const apiKey = process.env.API_KEY;             //apiKey for auithentication 
           

require('dotenv').config();                   //Loaded environment variables from a .env file using dotenv.
router.use(express.json());               //Used express.json() to enable JSON parsing for incoming requests.


// Calculate whether there are more pages to load (Pagination info)
const ifHasMore = (page, limit, totalItems) => (page * limit) < totalItems;


//Implemented an API key authentication middleware to secure specific routes.
const apiKeyAuthMiddleware = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'];//Checking for a valid API key in the request headers.
  if (providedApiKey === apiKey) {//If valid, continue to the next middleware, 
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });//Otherwise, return a 401 Unauthorized response.
  }
};

//Created a new data entry with API key authentication.
router.post('/createPost', apiKeyAuthMiddleware, async (req, res) => {
    try {
      const { title, description, image, price, tags } = req.body;
      
      // Create a new instance of the dbData model
      const newPost = new dbData({
        title,
        description,
        image,
        price,
        tags,
      });
  
      // Save the newPost instance to the database
      const savedPost = await newPost.save();
  
      // Query the total number of items without pagination
      const totalItems = await dbData.countDocuments();
  
  
      // Send the retrieved data and pagination metadata(hasMore) as a JSON response
      res.status(201).json({data:savedPost,hasMore:false,totalItems});
  
    } catch (err) {
      //Handling Exception for bad requests
      res.status(400).json({ error: err.message });
    }
  
  });

  
  
//Implemented various routes for creating, retrieving, filtering with tags, sorting data and pagination.

// Retrieve all data entries at once.
router.get('/getAllData', async (req, res) => {
    try {
  
      // Query your data source to retrieve all data
      const allData = await dbData.find()
  
      // Query the total number of items 
      const totalItems = await dbData.countDocuments();
  
      // Send the retrieved data and pagination metadata(hasMore) as a JSON response
      res.json({ data: allData, hasMore:false, totalItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // Retrieve data entries with pagination.
  router.get('/getPaginatedData', async (req, res) => {
    try {
  
      // Parsed the 'page' and 'limit' query parameter from the request URL, or default to 1 and 2 if not provided
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
      
      // Calculate the number of items to skip in the data source based on the page and limit
      const skip = (page - 1) * limit;
  
      // Query your data source to retrieve data with pagination
      const allData = await dbData.find().skip(skip).limit(limit)
  
      // Query the total number of items 
      const totalItems = await dbData.countDocuments();
  
      // Send the retrieved data and pagination metadata as a JSON response
      res.json({ data: allData, hasMore:ifHasMore(page, limit, totalItems), totalItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  // Retrieve and sort data entries by price with pagination.
  router.get('/getSortedDataByPrice', async (req, res) => {
    try {
      const sortDirection = req.query.sort || 'asc';     /* Default to ascending if sort direction 
                                                          is not provided*/
      let sortObject = {};
      if (sortDirection === 'asc') {
        sortObject.price = 1; // Ascending order
      } else if (sortDirection === 'desc') {
        sortObject.price = -1; // Descending order
      }
  
      // Query your data source and sort by 'price' based on the sort direction
      //routerlying pagination
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
  
      const skip = (page - 1) * limit;
  
      const sortedData = await dbData.find().skip(skip).limit(limit).sort(sortObject);
  
      // Query the total number of items 
      const totalItems = await dbData.countDocuments();
  
      // Send the sorted data as a JSON response
      res.json({data:sortedData, hasMore:ifHasMore(page, limit, totalItems), totalItems});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // Search for data entries by title or description with pagination.
  router.get('/searchItems', async (req, res) => {
    try {
      const searchText = req.query.searchText; // Get the search text from query parameters
  
      // Query your data source to search for items by description or title
      //routerlying pagination
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const skip = (page - 1) * limit;
  
  
      const searchResult = await dbData.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } }, // Case-insensitive title search
          { description: { $regex: searchText, $options: 'i' } }, // Case-insensitive description search
        ],
      }).skip(skip).limit(limit); 
  
  
      // Query the total number of items for pagination
       const totalItems = await dbData.countDocuments({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { description: { $regex: searchText, $options: 'i' } },
        ],
      });
  
  
      // Send the search results as a JSON response
      res.status(200).json({data:searchResult,hasMore:ifHasMore(page, limit, totalItems), totalItems});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // Filter data entries by tags with pagination.
  router.get('/filterByTag', async (req, res) => {
    try {
      const tags = req.query.tags; // Get the tags to filter by from the query parameters
  
      // Convert tags to an array if they are provided as a comma-separated string
     const tagArray = Array.isArray(tags) ? tags : tags.split(',');
  
     //routerlying pagination
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 2;
  
     const skip = (page - 1) * limit;
  
      // Query your data source to filter items by tags
      const filteredData = await dbData.find({ tags: { $in: tagArray } }).skip(skip).limit(limit);
  
      // Query the total number of items
      const totalItems = await dbData.countDocuments({ tags: { $in: tagArray } });
  
      // Send the filtered data as a JSON response
      res.status(200).json({data:filteredData,hasMore:ifHasMore(page, limit, totalItems),totalItems});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



// Combined endpoint for filtering, sorting, and pagination
router.get('/filterSortAndPaginate', async (req, res) => {
  try {
    // Get filter tags from the query parameters
    const tags = req.query.tags;
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');

    // Get sort direction from the query parameters
    const sortDirection = req.query.sort || 'asc';
    //The - sign before the field name -price indicates descending order.
    const sortField = 'price';

    let sortObject = {};
      if (sortDirection === 'asc') {
        sortObject.price = 1; // Ascending order
      } else if (sortDirection === 'desc') {
        sortObject.price = -1; // Descending order
      }

    // Apply pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    // MongoDB aggregation pipeline
    const pipeline = [
      {
        $match: {
          tags: { $in: tagArray },
        },
      },
      {
        $sort: {
          [sortField]: sortObject.price,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    // Query the database using the aggregation pipeline
    const [filteredAndSortedData, totalItems] = await Promise.all([
      dbData.aggregate(pipeline).exec(),
      dbData.countDocuments({ tags: { $in: tagArray } }),
    ]);

    // Send the filtered, sorted, and paginated data as a JSON response
    res.json({
      data: filteredAndSortedData,
      hasMore: ifHasMore(page, limit, totalItems),
      totalItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Define allowed extensions and MIME types for file uploads
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const absolutePath = path.resolve(__dirname, '../assets');
    cb(null, absolutePath); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name as the name of the stored file
  },
});
  
  // Set up the multer middleware with file filtering
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      console.log(ext)
      const isAllowedExtension = allowedExtensions.includes(ext);
      const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
      console.log(isAllowedExtension,isAllowedMimeType)
  
      if (isAllowedExtension && isAllowedMimeType) {
        cb(null, true); // Accept the file
      } else {
        cb(new Error('Invalid file type. Only specific image file types (jpg, jpeg, png, gif) are allowed.'), false);
      }
    },
  });
  
  // API for file upload with Authorization middleware
  router.post('/upload',apiKeyAuthMiddleware,(req, res) => {
    try {
      upload.single('image')(req, res, (err) => {
        if (err) {
          res.status(400).json({ error: err.message });
        } else if (req.file) {
          res.json({ message: 'File uploaded successfully', filename: req.file.originalname });
        } else {
          res.status(400).json({ error: 'File upload failed. Please ensure you are uploading a valid image file.' });
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


 

module.exports = router; // Export the router
