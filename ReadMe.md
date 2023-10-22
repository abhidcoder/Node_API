# You can Download the API Collection From the link Below:

**Use Postman or Thunder Client (VS code extension) to import this collection

--> https://drive.google.com/file/d/1sbnxSADNElaB3q5mUKFhYlbung2rbJ3M/view?usp=sharing

# Live on:

--> https://abhidcoder-node-api.onrender.com/


# RESTful API with Node.js and MongoDB

This project is a RESTful API implemented in Node.js with MongoDB as the database.
It provides the following features:

## API Endpoints


1. **Create Post:** Create a new post with fields like title, description, image, etc.

   - Endpoint: `/v1/createPost`
   - Method: POST
   - Request Body: JSON data with post details
   - Headers : x-api-key, value(FiredrakeSinsIsTheSampleAPIkey)

2. **Get All Post:** all posts with Pagination.

    - Endpoint: `/v1/getPaginatedData?page=1&limit=2`
    - Method: GET
    - Query Parameters: `page`, `limit`

3. **Get All Post:** all posts without Pagination.

    - Endpoint: `/v1/getAllData`
    - Method: GET
    - Query Parameters: NA

4. **Search Posts:** Search for posts based on keywords in the title and description.

   - Endpoint: `/v1/searchItems?searchText=Fire&page=1&limit=4`
   - Method: GET
   - Query Parameters: `searchText`, `page`, `limit`


5. **Sort The data in ascending and descending order with pagination

 - Endpoint: `/v1/getSortedDataByPrice?page=1&limit=14&sort=asc`
 - Method: GET
 - Query Parameters: `sort (values(asc,desc))`, `page`, `limit`

6. **Filter Posts by Tags:** Retrieve posts filtered by tags.

   - Endpoint: `/v1/filterByTag?tags=Tag11&page=1&limit=5`
   - Method: GET
   - Query Parameters: `tags`, `page`, `limit`

7.  **Upload Only Image:** Upload a post image (also has validation to check the image file) to a cloud service (e.g., EC2 or localserver ).

   - Endpoint: `/v1/upload`
   - Method: POST
   - Request Body: Form data with the image file (key value(image))
   - Headers : x-api-key, value(FiredrakeSinsIsTheSampleAPIkey)

8. ** Read the json file and import all the data from the json to MongoDB Atlas using Mongoose

   - Endpoint: `/insert/samples`
   - Method: POST
   - Request Body: Form data with the image file (key value(image))
   - Headers : x-api-key, value(ThoseWithThisKeyCanInsertManyDataAtOnce)

9. ** Uploading files to Firebase bucket with their original file name

   - Endpoint: `/bucket/firebase`
   - Method: POST
   - Request Body: Form data with the image file (key value(file))
   - Headers : x-api-key, value(ThoseWithThisKeyCanInsertIntoFirebaseBucket)


10. ** This Endpoint uses MongoDB aggregate to Filter, Sort and Paginate the data

   - Endpoint: `/v1/filterSortAndPaginate?tags=Fiction,Classic&sort=asc&page=1&limit=15`
   - Method: GET
   - Query Parameters: `tags (Fiction,Classic)`, `sort (value(asc,desc)), `page`, `limit`






   
## MogoDB Schema (Model)

- **Post Model:** Fields include `title`, `description`, `image`, tags, price.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.
4. Start the application with `npm start`.

## Deployment

To deploy this API in a production environment, consider using services like Heroku, AWS, or DigitalOcean.
Ensure that you configure environment variables for production.

## Documentation

API endpoints are documented in the code itself. 
You can find detailed information about each endpoint and request/response formats in the source code.

## Maintaining the Code

Feel free to reach out if you have any questions or need further assistance.



Happy Hacking!

