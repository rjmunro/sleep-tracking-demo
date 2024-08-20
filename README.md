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

## Progress and next steps

I started with a form showing only name, date and hours of sleep. Multiple submissions are matched
by name so you can add hours for different days. I did not include gender or any other fields
because it's not clear how they can be included on a single form - what would happen if you enter a
different gender each time you add another sleep rating.

In a real project I would talk to the UX designer or product owner and decide on the best layout
which would depend on exactly how this would be used, and what the direction we will be heading in
the next stages.

For example, there could be 2 forms, one to add new users including their name, gender and other
fields, and a separate one where you can select the already added user (e.g. with a drop down),
select the date and enter the hours. Should they be on a single page or on multiple pages?

Alternatively there could be a single form that let you enter several days data, e.g. 7 boxes, one
for each day. This is simpler, but means you can't add more sleep records later.

Do we need the ability to change names or edit other fields?

For now everything is on a single page. This keeps things simple - there is not too much information
on the page, but I'd like to talk with a designer about that, and about how the layout should look.
It's relatively easy to split things onto multiple pages using react-router.

It might make sense to allow adding sleep recordings by selecting people in the table. This could
cause a pop-up form, or change the form to be ready to accept data for the specific person.

Rather than a standard date selector, maybe it should have something that showed only dates that
haven't already been filled in.
