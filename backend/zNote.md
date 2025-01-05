#  <span style="color: #86efac;">MarketHub</span>
## MarketHub is an Online marketplace website platform where multiple sellers can sell their products or services

# <span style="color:rgb(136, 236, 90) ; "> 1.) Backend Initial SetUp </span>

## <span style="color:rgb(236, 90, 212) ; "> 1.) Technology Used </span>
- Node js
- Express js
- Json web token for Auth
- MongoDB
- Cloudinary
- cookie-parser
- cors
- dotenv


## <span style="color:rgb(236, 90, 212) ; "> 2.) Setting Up  Project Environment </span>

### <span style="color: #1d4ed8; "> 2. 1) Initialize the project</span>

To get started with building the application, we first need to set up the server by creating subfolder called backend under project  folder MarketHub.



```bash
 mkdir backend
```

This will create the sub folder backend under MarketHub folder. 

```bash
     ~/Desktop/Project/MERN STACK PROJECTS/Ecommerce/MarketHub/backend
```
On backend folder run the following command in the terminal to initialize the project. -y means accept  all default options. 

```bash
 npm init -y
```

On the created  package.json file do the following


```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "SET NODE_ENV=development& nodemon index.js",
    "start_prod": "SET NODE_ENV=production& nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "MarketHub is an Online marketplace website platform where multiple sellers can sell their products or services."
}
```
### <span style="color: #1d4ed8 ; "> 2. 2) Install the required dependencies in server folder </span>

- <a> Express.js </a>, which is our Node.js web application framework.

- <a> bcryptjs </a>, which helps us hash the user's password.

- <a> cookie-parser</a> is the the cookie-parser middleware that handles cookie-based sessions. It extracts information from cookies that may be required for authentication or other purposes.

- <a> nodemon</a> is a tool used to automatically restart a Node.js application whenever changes are made to the code.

- <a> CORS </a> is a middleware used to enable Cross-Origin Resource Sharing (CORS) for an Express.js application.

- <a> jsonwebtoken</a> helps us create and verify JSON Web Tokens.

- <a> dotenv </a> allows you to store configuration data in a .env file, which is typically not committed to version control, to separate sensitive information from your codebase. This file contains key-value pairs that represent the environment variables.

- <a>mongoose </a> is an Object Data Modeling (ODM) library for MongoDB and Node.js.

- <a> Cloudinary </a> is an end-to-end image- and video-management solution for websites and mobile apps, covering everything from image and video uploads, storage, manipulations, optimizations to delivery.
- <a> Nodemailer </a> is a module for Node.js applications to allow to send emails.

- **<a>js-cookie</a>**  is javaScript cookies. Are small data stored on a user's device by a web browser. These cookies play a crucial role in web development, enabling websites to store and retrieve information about user preferences, session states, and other data.
- <a>Stripe</a>  provides a set of programmable APIs and tools to let you facilitate payments and pay out sellers globally. 

- <a>EJS</a> is a simple templating language that lets you generate HTML markup with plain JavaScript

```bash
npm install jsonwebtoken mongoose bcryptjs cookie-parser cors dotenv express ejs cloudinary nodemailer nodemon
 ```

### <span style="color: #1d4ed8 ; "> 2. 3) Setting up files and folders structure of project  </span>

             ______frontend
            |
      MarketHub |                  ____ controllers
            |______backend ___|____ db
                              |____ mails
                              |____ middlewares
                              |____ models
                              |____ routes
                              |____ utils
                              |____ app.js
                              |____ index.js
                              |____ package.json

### <span style="color: #1d4ed8 ; "> 2. 4) Setting up Server </span>


In backend folder create <lg>.env </lg>, app.js and  index.js files write the following code respectively, to set up server

.env

```json
PORT = 8000
```

app.js

```js
import express from "express";
export const app = express();
```

index.js

```js
import { app } from "./app.js";
import "dotenv/config.js";

const port = process.env.PORT || 8000;

//create server
app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
```

### <span style="color: #1d4ed8 ; "> 2. 5) Watching file changes and build directory  </span>
Before you start the server, update your package.json file in the server by adding the code below:

```js
"scripts": {
    "dev": "nodemon server.js"
  },
```

This will make sure your application restarts on any update. Now, you can start your server by running

```bash
npm run dev
```

in your terminal.

or

```js
"scripts": {
 "dev": "nodemon server.js",
    "start": "SET NODE_ENV=development& nodemon server.js",
    "start_prod": "SET NODE_ENV=production& nodemon server.js"
}
```

This will make sure your application restarts on any update. Now, you can start your server by running

```bash
npm run dev

  or

npm start
```

in your terminal.


### <span style="color: #1d4ed8 ; "> 2. 6) Adding bodyParser into app.js </span>

Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit. Specifically in the context of a POST, PATCH, or PUT HTTP request where the information you want is contained in the body. Using body-parser allows you to access req.body from within routes and use that data.  if we don't put app.use(expess.json()) middleware in our app, req.body is undefined.


When adding the body-parser middleware to the app like bellow code, by default request body size is (100kb);

```js
app.use(express.json());
```
### <span style="color:rgb(231, 63, 63) ; ">  Changing bodyParser Limits </span>
Express applications that receive a request with a body larger than the set limit (default 100kb), will throw a “Error: Request entity too large”. To change this limit, Use the following code.
```js
app.use(express.json({ limit: "50mb" }));
```

The two lines of code below are middleware configurations for an Express.js application. Both of them handle incoming request data, but they handle different types of data and have distinct settings.
```js
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
```


#### <span style="color:rgb(231, 63, 63) ; ">  1. app.use(express.json({ limit: "50mb" })) </span>
This middleware is used to parse incoming JSON payloads from the request body. The limit option specifies the maximum size of the JSON payload that will be accepted. If the payload exceeds 50MB, Express will reject the request with a 413 Payload Too Large status code.

Content-Type: This middleware is triggered for requests with the Content-Type: application/json header.
Purpose: It is used when you're expecting data in JSON format (e.g., objects or arrays) in the request body.

#### <span style="color:rgb(231, 63, 63) ; ">   2. app.use(express.urlencoded({ extended: true, limit: "50mb" })); </span>
This middleware is used to parse URL-encoded data. URL-encoded data is typically sent when submitting form data from a web browser (via the application/x-www-form-urlencoded content type). The extended: true option allows you to parse nested objects (using the querystring library), while extended: false would use the querystring module for simpler key-value pairs.

Content-Type: This middleware is triggered for requests with the Content-Type: application/x-www-form-urlencoded header (which is common in HTML form submissions).
Purpose: It is used for parsing form data (key-value pairs) that is submitted via a POST request, for example.
Key Differences:
Data Type:

express.json() is used for parsing JSON payloads.
express.urlencoded() is used for parsing URL-encoded form data.
Use Case:

express.json() is typically used when receiving data from APIs that send JSON (often with RESTful APIs).
express.urlencoded() is typically used for form submissions in HTML forms, or any URL-encoded data.
extended option:

express.urlencoded() has an extended option that determines how complex the data can be (nested objects). If extended: true, it uses the qs library, which supports complex objects; if extended: false, it uses the querystring module, which only supports simple key-value pairs.

### <span style="color: #1d4ed8 ; "> 2. 7) Cookie-Parser into app.js</span>

cookie-parser is a middleware which parses (gets) cookies attached to the client request object.
The req.cookies property is used when the user is using cookie-parser middleware. This property is an object that contains cookies sent by the request.

```js
import cookieParser from "cookie-parser";

app.use(cookieParser());
```

access cookie-parser

```js
req.cookie;
```

### <span style="color: #1d4ed8 ; "> 2. 8) CORS into our app.js file </span>

Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell the browser to let a web application running at one origin(domain) have permission to access selected resources from a server at a different origin. A web application makes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, and port) than its own origin.

An example of a cross-origin request is:
We always have a separated server and client in our project. Now client and server both communicate with each other. If both server and client running on the same host, then communication is there without any error.
```json
Client = "http://localhost:8000"
Server = "http://localhost:8000"
```
But if both client and server are on a different host, then communication in such a situation fails the request and throw an error.

```json
Client = "http://localhost:3000"
Server = "http://localhost:8000"
```

This is the security mechanism as no one should be able to access the data on the server or its resources if you are not running on the same server. So, if this type of request is there on different servers, this will give up an error called CORS error.

In .env file we define the following

```json
ORIGIN = ["http://localhost:3000"]
```

In app.js file we define cors

```js
import cors from "cors";
import "dotenv/config.js";

const { ORIGIN } = process.env;

app.use(
  cors({
    origin: ORIGIN,
    credentials: true
  })
);
```
## <span style="color:rgb(236, 90, 212) ; "> 3) Connect MongoDB Atlas with NodeJS Express Backend </span>

MongoDB Atlas is a cloud-based database service.
Follow the following Link [MongoDB Atlas set up](https://www.geeksforgeeks.org/how-to-connect-node-js-to-mongodb-atlas-using-mongoose/)
### <span style="color: #86efac;"> 3.1) Create an account on MongoDB Atlas</span>

Create an account on MongoDB Atlas and select the free option as shown in the image below.
![[1__yCa03Ll4pBISamu02rZxw.webp]]
### <span style="color: #86efac;">3.2) Build a Database MongoDB Atlas </span>

From sidebar click on <a> Database </a> then click on <a>Build a Database </a> button.


The next step in the setup procedure is to deploy the database. You will choose the free <r> cluster </r>, which has 512MB of storage, shared RAM, and vCPU.
Next, select your provider; we will use <r>AWS </r>. Finally, choose your preferred area <r>N. Virginia (us-east) </r> and give the cluster the name <r> lms</r> in my instance, which also happens to be the name of my project.

![mongodb](/server/Znote/images/mogodb3.png)

next click on <g>Create </g> button

### <span style="color: #86efac;"> 3.3)  Step 3: Database credentials </span>
In this section, you will establish a database user with a username and a password (which you should copy or write down).

![mongodb](/server/Znote/images/mogodb4.png)

The IP address will be provided automatically when the user is created. The next step is to whitelist the IP address so that it accepts development requests from your computer on a regular basis. “Allow access from anywhere” should be selected. However, this should be modified during manufacturing.

###  <span style="color: #86efac;"> 3.4) Connect to the database </span>

In this step we will be connecting to the database.
![mongodb](/server/Znote/images/mogodb5.png)
Click on the “Connect” button which redirects you to the first part of the image shown.
![mongodb](/server/Znote/images/mogodb6.png)

From the list select <lg>MongoDB for vs code</lg> under the access your data through tools.

Next, it is to copy the connection string;
“mongodb+srv://umqondisi:<password>@xxxx.q3lnevu.mongodb.net/”

This is the string that we will link with our Nodejs/Express backend.

### <span style="color: #86efac;"> 3.5)  Setup on the backend </c>

In .env file create <a> MONGODB_URI </a> and we will paste the connection string which we coped before from MongoDB Atlas

Then we replace <password> with our own database user password. However, this information should not be made public.

Then create db folder under backend folder. In <a>db</a> folder create <a>database.js</a> file then write the following code to connect to the database.

```js
import mongoose from "mongoose";
import "dotenv/config.js";

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI).then(() => {
      console.log(`MongoDB Database Connected with ${data.connection.host}`);
    });
  } catch () {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
```

Then in <a>index.js </a> file import <a> connectDB </a>and run it here.

```js
import { app } from "./app.js";
import connectDB from "./utils/db.js";
import "dotenv/config.js";

const port = process.env.PORT || 8000;

//create server
app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
  connectDB(); // DB connection
});
```

If this is successful, the results are displayed on the console, as seen below.
![mongodb](/server/Znote/images/mogodb7.png)

## <span style="color:rgb(236, 90, 212) ; "> 4) Setting up Cloudinary in Backend </span>

Go to Cloudinary website and login and click Dashboard. From Dashboard you can find

- Cloud name
- Api key
- Api Secret

  then write them in <a>.env</a> file

  ```js
    CLOUDINARY_NAME =
    CLOUDINARY_API_KEY =
    CLOUDINARY_API_SECRET =
  ```
## <span style="color:rgb(236, 90, 212) ; "> 5) Setting up Test route </span>

In <a>app.js </a> file write the following code to simple test route

```js
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";

const { ORIGIN } = process.env;
export const app = express();

//passing bodyParser middleware
app.use(express.json({ limit: "50mb" }));

//cookie parser middleware
app.use(cookieParser());

//cors middleware
app.use(
  cors({
    origin: ORIGIN,
  })
);

//routes middleware go's here


//testing route
app.get("/test", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Test API is Working",
  });
});

//all Unknown Routes
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

```

# <span style="color:rgb(136, 236, 90) ; "> 2.) Setting Up Error Handler </span>
## <span style="color:rgb(236, 90, 212) ; "> 2.1) Custom Error Handler </span>
The error object is a built-in object in the Node.js runtime. It gives you a set of info about an error when it happens.

### <span style="color: #86efac;"> 2.1.1) Create Error Handler class</span>
Create a file inside <a>utils</a> folder call <a>errorHandler.js</a> and write the following code
the use of the class to extend the default Error by adding statusCode and Custom Message.

```js
class ErrorHandler extends Error {
 
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
```

### <span style="color: #86efac;"> 2.1.2) Handling Possible Errors</span>
In side <a>middleware </a> folder create <a>error.js</a> file and write the following code.

```js
import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resources not found with this ID. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Your URL is invalid, please try again later`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    const message = `Your URL is expired, please try again later`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
```

### <span style="color: #86efac;"> 2.1.3) Handling try-catch statements</span>
Again in side <a>middleware </a> folder create <a>catchAsyncErrors.js </a> file and write the following code.

```js
  const asyncErrorHandler = (theFunc) => (req, res, next) => {
   Promise.resolve(theFunc(req, res, next)).catch(next);
 };
 
 export default asyncErrorHandler;
```

### <span style="color: #86efac;"> 2.1.4) Integrate error handler middleware with app.js file</span>
now call error handler middleware inside <a> app.js</a> file and put it at the end of all middleware.

```js
// it's for ErrorHandling
app.use(ErrorHandlerMiddleware);
```

<a> app.js</a>

```js
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorHandlerMiddleware from "./middleware/error.js";
import "dotenv/config.js";

const { ORIGIN } = process.env;
export const app = express();

//passing bodyParser middleware
app.use(express.json({ limit: "50mb" }));

//cookie parser middleware
app.use(cookieParser());

//cors middleware
app.use(
  cors({
    origin: ORIGIN,
  })
);

//routes middleware go's here


//testing route
app.get("/test", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Test API is Working",
  });
});

//all Unknown Routes
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// it's for ErrorHandling
app.use(ErrorHandlerMiddleware);
```



### <span style="color: #86efac;"> 3.1) Create an account on MongoDB Atlas</span>

