import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

//for later refactor into modules
//import ownersController from "./ownersController.js";

dotenv.config();

const PORT = process.env.DATABASE_URL || 8000;

const pgConnect = `postgresql://postgres:postgres@localhost:6432/pg_test_db`;

const pgURI = process.env.DATABASE_URL || pgConnect;
console.log("pgURI: ", pgURI);

const pool = new pg.Pool({
    connectionString: pgURI,
});

pool.connect()
    .then((client) => {
        console.log(`Connected to postgres using connection string ${pgURI}`);
        client.release();
    })
    .catch((err)=>{
        console.log("Failed to connect to postgres: ", err.message);
    })

const app = express();
app.use(express.json());
app.use(express.static('public'));

//for later refactor into modules
//const charController = charController(pool);

//get all char
app.get("/char", (req, res) => {
    console.log(`get request to char table`);
    pool.query(`SELECT * FROM char`)
    .then((charData) => {
        console.log(charData.rows);
        res.json(charData.rows);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
})

//get one char
app.get("/char/:name", (req, res) => {
    
})

//post to char table

//patch char

//delete char

//get all item

//get one item

//post to char table

//patch char

//delete char

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})