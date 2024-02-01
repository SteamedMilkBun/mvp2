# MVP 2

## Purpose
* The purpose of this repository is to create an app that performs CRUD operations on a deployed database using client input

## Set up local files in project directory
### Set up database using files inside MVP2/db
* separate local migration and seed sql from Render sql by name
* copy local sql files into /tmp directory of PostgreSQL Docker container
* create and seed local database using copied local sql files in /tmp
* create Render database sql files, which will seed the database on Render later

## Set up database on Render
### Create, seed, and connect to Render database
* connect to Render database using psql from PostgreSQL Docker container - refer to setup.md for specific instructions
* seed Render database using sql files
* check Render database logs to confirm that the desired data from PostgreSQL Docker container was correctly seeded

### Set up web service for database
* create and connect Render web service to Github repo
* use npm install and npm start for build and start commands, respectively
* in 'environment', add variable 'DATABASE_URL' and set to 'Internal Database URL', which can be found in Render database info

## Set up server api
### Set up server
* port = process.env.DATABASE_URL
* routes to perform CRUD operations on Render database
* listener for process.env.PORT
* use middleware express.static("public") in server app to connect to html file homepage

## Set up front-end
* access two routes by requesting and receiving data from database on render through PostgreSQL
* made front-end app the source for javascript on html file, in order to dynamically render info on homepage
* optional: use css to style homepage