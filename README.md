# locker-system

## How to run

Just run the `docker-compose up` command and you should have 3 containers ready. The app, mongodb and a mongo-express for easy access to mongo to check the information.

On start a migration will be ran to populate the information provided at start.

You can also do a `docker-compose up -d mongodb mongo-express` and run locally with a `npm run dev` or `npm run start` after a build, just copy the `.env.example` to `.env` and change `mongodb` to `localhost` in the `MONGO_HOST`

## Assumptions and decisions

While reading and thinking about the problem at hand, both through the schemas and the data made available it was possible to retrieve some conclusions. 
There are 3 main entities, `Bloq`, `Locker`, `Rent` (which I assume is similar to a parcel). With these entities we have to deal with first, middle and last deliveries.

For this at start I thought the 3 controllers would be enough, but the more I thought about it the more it made sense to create a facade to deal with the "complex" logic surrounding the Rent and Locker system, this means the update of Rent/Locker is made only through the specific endpoints and not the entities regular `PUT`.

One of the biggest thinking points is how to deal with the delivery system, so for this I reached some assumptions for how I was going to develop this.

1. The client needs to be able to create a rent, but this rent can be "decoupled", created without a locker (as some of the default data shows)
2. Bloqs can be placed all over the locations, so for simplicity and for logic, I decided that whenever we wanted to allocate a rent we would have to at least provide a bloqId and within this `delivery` facade it would look for an open locker to place the rent. This could be eventually done through a worker but seemed too much for the current iteration
3. A client needs to dropoff the rent in the allocated locker
4. The locker will be closed and occupied while the rent is waiting for a pick up
5. The rent will then be picked up and the locker freed to receive other rents. I decided not to make a separate history table/collection so for now all rents are in the same collection, with the DELIVERED state.
6. The rent size made sense to be decided depending on weight, so it automatically provides a Size (S, M, L , etc) depending on a variable, that can be changed whenever.
7. I assume that a locker cannot be `Closed` and `Not occupied`, maybe this makes sense for a maintenance mode or having issues, but I did not apply that.

A small table for the status: 

| **Status**               | **Description**       |
|--------------------------|-----------------------|
| **OPEN & OCCUPIED**       | Waiting dropoff       |
| **OPEN & NOT OCCUPIED**   | OPEN                  |
| **CLOSED & OCCUPIED**     | Waiting pickup        |
| **CLOSED & NOT OCCUPIED** | N/A                   |

As an example, an open locker with occupied status means the related rent is waiting for a dropoff.
A closed locker that is occupied has a related rent that is waiting on pickup, etc.

Some important considerations, due to not using replicas or shards on mongo we don't have access to transactions (would be ideal due to the tight coupling of locker & rent).

## Other improvements

Other important improvements could be the error & logging, the worker queue to deal automatically with the rents allocating to the lockers, but I still don't have enough info on how the location of bloqs & user allocation is made, it would be something to clarify and see how to do after.

## If running locally

Use 'localhost' in the `MONGO_HOST` env variable, if running the app outside docker containers

## Tools
-node
-express
-express-validator
-mongodb
-mongoose
-mongo-migrate-ts
-mongo-express
-jest

