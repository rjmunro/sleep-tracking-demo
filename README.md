# Sleep Tracker App

This is the Sleep Tracker application.

## Run Locally

### Server

- Navigate to server application in terminal (e.g. `cd server`)

Setup (once only):

- Install dependencies by running `npm i` in terminal
- Copy .env.example file to .env and check the values in it

To run the development environment:

- Start the DB (Postgresql) container with `docker compose up`
- In another terminal, start the server with `npm run dev`

This starts a service listening on port 5002. You can check it is working by visiting
http://localhost:5002/ in your browser. This will return an error because there is no route
configured.

The docker container also comes with a PGAdmin instance on port 5050. You can visit it at
<http://localhost:5050/>. The email address and password to log in are set in environment variables
in the docker-compose.yml file. By default they are email admin@admin.com and password root.

### Client

- Navigate to client application in terminal (e.g. `cd client`)

Setup (once only):

- Install dependencies by running `npm i`

To run the development environment:

- Run `npm run dev`
