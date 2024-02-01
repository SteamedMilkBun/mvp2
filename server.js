import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

//for later refactor into modules
//import ownersController from "./ownersController.js";

dotenv.config();

const PORT = process.env.PORT;

//const pgConnect = `postgresql://postgres:postgres@localhost:6432/pg_test_db`;

//const pgURI = process.env.DATABASE_URL || pgConnect;
//console.log("pgURI: ", pgURI);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then((client) => {
        console.log(`Connected to postgres using connection string ${process.env.DATABASE_URL}`);
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
app.get('/character', (req, res) => {
    console.log(`get request to char table`);
    pool.query(`SELECT * FROM character`)
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
app.get('/character/:name', (req, res) => {
    const name = req.params.name;
    console.log(`Queried table character for name: ${name}`);
    pool.query(`SELECT * FROM character WHERE char_name ILIKE %${name}%`)
    .then((charData) => {
        if (charData.rows.length === 0) {
            console.log(`No matches for: ${name}.`)
            res.sendStatus(400);
            return;
        }
        console.log(charData.rows);
        res.json(charData.rows);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
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