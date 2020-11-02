# [SyncRoom](https://sync.ssprojects.ca/)

-   **SyncWatch** allows you and your friends to watch synchronized YouTube videos together.
-   Create SyncWatch room and invite others to join. Join either from the front page or by direct personal URL you can get in the room.
-   Play a video of your choice and communicate using the built-in chat room.
-   Synchronization handles video seeking, buffering as well as playing and pausing.

## How does it work?

1. Create SyncWatch room
1. Invite your friends
1. Play the video

## Getting started

Download [Docker](https://docs.docker.com/engine/install/) and follow the provided instructions to install it

Create a local copy of this repository

### Development

Run:

    docker-compose -f docker-compose.dev.yml build

After the containers have been built (this may take a few minutes) run:

    docker-compose -f docker-compose.dev.yml up

React frontend can be accessed at:

    http://0.0.0.0:8080/

And the backend API at:

    http://0.0.0.0:8080/api

To stop running local server:

    docker-compose down

in a separate terminal window or press **control + C**.

### Production

Run

    docker-compose up -d --build

### License

**SyncWatch** is [MIT licensed](./LICENSE).
