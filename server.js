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
    const name = '%' + req.params.name + '%';
    console.log(`Queried table character for name: ${name}`);
    pool.query(`SELECT * FROM character WHERE char_name ILIKE $1`, [name])
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
app.post('/character', (req, res) => {
    const name = req.body.char_name;
    const race = req.body.char_race;

    //edge case outsides of existing races
    if(name.length === 0 || race.length === 0){
        console.log("Name and/or race not entered");
        res.sendStatus(400);
        return;
    }

    pool.query('INSERT INTO character (char_name, char_race) VALUES ($1, $2) RETURNING *', [name, race])
    .then((charData) => {
        console.log("Created character:");
        console.log(charData.rows[0]);
        res.json(charData.rows[0]);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
})

//patch char
app.patch('/character/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const name = req.body.char_name;
    const race = req.body.char_race;

    pool.query(`UPDATE character SET 
                char_name = COALESCE($1, char_name),
                char_race = COALESCE($2, char_race)
                WHERE char_id = $3`, 
                [name, race, id])
    .then((patchData) => {
        console.log(`Successfully edited character at id: ${id}`);
        console.log(patchData.rows);
        console.log(patchData.rows[0]);
        res.json(patchData.rows[0])
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})

//delete char

//get all item

//get one item

//post to char table

//patch char

//delete char

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})