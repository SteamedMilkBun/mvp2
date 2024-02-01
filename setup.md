# Deployment Exercise

## Part 1: Get up and running locally

### Step 1: Getting Started

1. Fork and clone this repository.
1. `$ cd` into the project, and run `$ npm install`.

### Step 2: Setup Database Locally

Create a database called `example_db` and run migration and seed files:

```sh
$ createdb example_db
$ psql -f db/migration.sql example_db
$ psql -f db/seed.sql example_db
```

Connect to the `example_db` database via `psql` and confirm everything is there:

```sh
$ psql example_db
example_db=# SELECT * FROM student;
```

## Part 2: Rework so our application works in a deployed environment

Simply put, we're going to run our application on a remote computer that is hosted by an organization called Render. It makes our life a lot easier, they handle some of the network security, and ensure the computer is maintainted and running. **All we have to do is make our application flexible enough to run on different machines, which may use different port numbers, database names, passwords, etc.** And then we can push our code up to our Render computer and viola! It's live, in production, accessible by the public, or your future employers!

### Step 1: Install dotenv

To prepare our application for deployment we'll need to do the following in our project directory:

```sh
$ npm install dotenv
```

`dotenv` is a node package that allows us to store enviroment variables in a file we'll create that will be named `.env`.

**Enviroment variables** are just placeholders for variables that might be different accross machines, here are some examples:

- **Port Number** - Which port to listen on - your application might be hard-coded to use port "3000" or some other number, e.g. `app.listen(3000,...)`, but what if someone is runnning your application and they are using that port number for something else? Let them choose by placing an enviroment variable as placeholder instead.
- **Database Name / URL** - Similar reason as port number, someone might want a different database name. Also, as with port number, when you are deploying using a free service level, like we're doing with Heroku, you get whatever the hosted machine gives you.
- **Passwords / Keys** - The most immediate example you'll run in to is your database password. Your program needs that information to connect to the database, but it will be different for other machines that are running your code. The solution is once again to use an enviroment variable.

### Step 2: Create an `.env` file

Create a `.env` file:

```sh
$ touch .env
```

Add your environment variables as key/value pairs:

```sh
PORT=3000
DATABASE_URL=postgres://user:password@host:5432/database
```

### Step 3: Update code to use environment variables

Replace values in our code with the placeholder variables. (**See comments in the code below for what to do.**)

We only need to run `dotenv.config() ` in one place, the **entry point** of our code, where everything else is brought it and nothing is exported -- In our case, `server.js`. Once we do that, the `dotenv` node package lets us reference the environment variables we specified in `.env` with the `process.env` object (see the examples above).

### Step 4: Add `.env` to `.gitignore`

Add `.env` to `.gitignore`. This tells git that we don't want to share this `.env` file with others.

Example .gitignore:

```
/node_modules/
.env
```

### Step 5: Create `.env.template`

Create a `.env.template` file for other developers to copy and fill in with their own information, then rename to `.env` so they have their own copy:

```sh
$ touch .env.template
```

```
PORT=
DATABASE_URL=
```

The template above is not used by your app, it's just there for other developers who want to run your application on their machine. It makes it easy for them to create their own `.env` file.

Finally don't forget to add and commit your code!

## Part 3: Deploying to Render

Create account on [render.com](https://render.com).

## Step 1: Create Remote Postgres Database

1. Create PostgreSQL database in Render.

> Note: This database is what you want to connect to in your deployed app. It is completely separate from your local database. Also, it is blank, so we need to create our tables and seed data (see below).

2. Copy the `External Database URL` and use it to run your migration.sql and seed.sql against this remote database:

```
$ psql -f db/migration.sql <EXTERNAL_DATABASE_URL>
$ psql -f db/seed.sql <EXTERNAL_DATABASE_URL>
```

3. Copy the `Internal Database URL` and save it for later.

## Step 2: Create Web Service

1. Create a Web Service in Render.
1. Connect your web service to your GitHub repo for automatic deploys.
1. Change the `Build Command` to be `$ npm install`.
1. Change the `Start Command` to be `$ npm start`.
1. Navigate to `Environment` and add an environment variable called `DATABASE_URL` and give it the value of the `Internal Database URL` you copied from your remote database in the previous step.
