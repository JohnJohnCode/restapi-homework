
# RestAPI homework

This project is my solution to a task given to me in a job interview. The project itself is just a backend API that connects to a MySQL database host and allows its users to GET a list of all the users in the database or a single user, POST a new user, PUT update an existing user or DELETE an existing user. 

A single user then looks like so:
```bash
  { ID: 1, username: "John", email: "John@John.com", age: 29 }
```

Part of this project is also a test file app.test.js inside of which is a Jest test suite that tests for possible invalid/valid user input.
## Tech Stack

**Server:** Node, Express, MySQL, Jest


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

`PORT`

`DB_HOST`
`DB_USERNAME`
`DB_PASSWORD`
`DB_DATABASE`

During development my host of choice was [db4free.net](https://www.db4free.net/).
## Installation

Install RestAPI homework dependencies with npm (make sure you're inside of the root folder of the project):

```bash
  npm i
```
Run a dev server (and possibly test using thunderbolt client / postman for example) with npm:

```bash
  npm run dev
```

To run the test suite:

```bash
  npm run test
```
## License

[MIT](https://choosealicense.com/licenses/mit/)

