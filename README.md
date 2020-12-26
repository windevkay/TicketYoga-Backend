This is the TypeScript + Node + GraphQl backend for the TicketYoga app

## Overall Structure

Apollo server is being used to create the GraphQl server.
MongoDB and MongoDB Atlas are employed for our database cloud service.

Resolvers call on service files where majority of code logic is domiciled.

Jest is being used for testing of all individual services.

Google OAuth is being used for as an outsourced service for user authentication.

A google access and google refresh token is being saved with user entities for Google API requests.

## Available Scripts

In the project directory, you can run:

### `npm run test`

Runs Jest to test all detected services test files.

### `npm run start`

Start the GraphQl server and access playground with /api.

### `npm run seed | clear`

Seed or Clear MongoDB Atlas with data. Said data can be found in the mocks folder.

### `npm run build`

Compile to Javascript.

## Running the server as a container

docker build -t <your username>/ticketyogaserver .

docker run -p 5555:9000 -d <your username>/ticketyogaserver
