// imports 
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

// Custom imports 
import { initializeDB } from "./helper/readXLSX.js";
import { branchDetailRouter } from "./routes/branchDetail.js";
import { userRouter } from "./routes/users.js";


// creating an Express app
const app = express();

// for encoding the URL
app.use(express.urlencoded({
    extended: true,
})
);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json())


app.use(express.static(path.resolve(__dirname, '../../client/build')));



// Env file configuration
const ENV_FILE = path.join(__dirname, `../.env`);

dotenv.config({ path: ENV_FILE });


// Initializin Database and creating table 
initializeDB()
    .then(() => {
        console.log(`Databse initialization successful`);
    })
    .catch((err) => {
        console.log(err);
    });


// addBranchDetails();



app.use(cors());
app.use("/branch-detail", branchDetailRouter);
app.use("/user", userRouter);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening ${PORT} !`);
});