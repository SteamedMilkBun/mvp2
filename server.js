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
    .then((data) => {
        console.log(data.rows);
        res.json(data.rows);
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
    .then((data) => {
        if (data.rows.length === 0) {
            console.log(`No matches for: ${name}.`)
            res.sendStatus(400);
            return;
        }
        console.log(data.rows);
        res.json(data.rows);
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
    .then((data) => {
        console.log("Created character:");
        console.log(data.rows[0]);
        res.json(data.rows[0]);
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

    if(Number.isNaN(id)){
        console.log(`Bad Request: ${id} is a ${typeof id}, not a number.`);
        res.sendStatus(400);
        return;
    }

    pool.query(`UPDATE character SET 
                char_name = COALESCE($1, char_name),
                char_race = COALESCE($2, char_race)
                WHERE char_id = $3 RETURNING *`, 
                [name, race, id])
    .then((data) => {
        console.log(`Successfully edited character at id: ${id}`);
        console.log(data.rows[0]);
        res.json(data.rows[0])
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})

//delete char
app.delete('/character/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    if(Number.isNaN(id)){
        console.log(`Bad Request: ${id} is a ${typeof id}, not a number.`);
        res.sendStatus(400);
        return;
    }

    console.log(`Want to delete character with id: ${id}`);

    pool.query(`DELETE FROM character WHERE char_id = $1 RETURNING *`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            console.log(`Nothing found at id: ${id} to delete`);
            res.sendStatus(404);
            return;
        }
        console.log(`Deleted ${data.rows[0].char_name}`);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

//get all item
app.get('/item', (req, res) => {
    console.log(`get request to item table`);
    pool.query(`SELECT * FROM item`)
    .then((data) => {
        console.log(data.rows);
        res.json(data.rows);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
})

//get one item
app.get('/item/:name', (req, res) => {
    const name = '%' + req.params.name + '%';
    console.log(`Queried item table for name: ${name}`);
    pool.query(`SELECT * FROM item WHERE item_name ILIKE $1`, [name])
    .then((data) => {
        if (data.rows.length === 0) {
            console.log(`No matches for: ${name}.`)
            res.sendStatus(404);
            return;
        }
        console.log(data.rows);
        res.json(data.rows);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
})

//post to item table
app.post('/item', (req, res) => {
    const { item_name, item_value } = req.body;

    //edge case outsides of existing races
    if(item_name.length === 0 || item_value.length === 0){
        console.log("item_name and/or item_value not entered");
        res.sendStatus(400);
        return;
    }

    pool.query('INSERT INTO item (item_name, item_value) VALUES ($1, $2) RETURNING *', [item_name, item_value])
    .then((data) => {
        console.log(`Created ${data.rows[0].item_name} costing ${data.rows[0].item_value} gold`);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err.message);
        res.sendStatus(500);
    })
})

//patch item
app.patch('/item/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const { item_name, item_value} = req.body;

    if(Number.isNaN(id)){
        console.log(`Bad Request: ${id} is a ${typeof id}, not a number.`);
        res.sendStatus(400);
        return;
    }

    pool.query(`UPDATE item SET 
                item_name = COALESCE($1, item_name),
                item_value = COALESCE($2, item_value)
                WHERE item_id = $3 RETURNING *`, 
                [item_name, item_value, id])
    .then((data) => {
        console.log(`Successfully edited item at id: ${id}`);
        console.log(data.rows[0]);
        res.json(data.rows[0])
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})

//delete item
app.delete('/item/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    if(Number.isNaN(id)){
        console.log(`Bad Request: ${id} is a ${typeof id}, not a number.`);
        res.sendStatus(400);
        return;
    }

    console.log(`Want to delete item with id: ${id}`);

    pool.query(`DELETE FROM item WHERE item_id = $1 RETURNING *`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            console.log(`Nothing found at id: ${id} to delete`);
            res.sendStatus(404);
            return;
        }
        console.log(`Deleted ${data.rows[0].item_name}`);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})