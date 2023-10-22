const express = require('express');             //Imported Express and created an instance of the application.
const app = express();                          // Create a router instead of an app
const cors = require('cors');                   //Enabled CORS (Cross-Origin Resource Sharing) for your server.
const postRoutes = require('./routes/post');    // Import the routes from the post file
const postSamples = require('./routes/importSampleData');   // Import the routes from the importSampleData file
require('dotenv').config();                     //Loaded environment variables from a .env file using dotenv.

app.use(cors());
app.use(express.json());                        //Used express.json() to enable JSON parsing for incoming requests.
app.use('/v1', postRoutes);                   // Using the '/post' prefix for the POST API
app.use('/insert', postSamples);                  // Using the '/insert' prefix for the POST datas from the json


//Handled the root route with a response to check if the server is working.
app.get("/", async (req, res) => {
  res.send( 'Node Server is Running.')
} )

//Start the server, specifying the port as either from the environment variable or a default value.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
