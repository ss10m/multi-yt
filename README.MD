# [2d-pack](https://sync.ssprojects.ca/)

## Live

## Overview

2D bin packing

## How to Use

Download [Docker](https://docs.docker.com/engine/install/) and follow its instructions to install it

Create a local copy of this repository

### Development

Run:

    docker-compose -f docker-compose.dev.yml build

After the containers have been built (this may take a few minutes) run:

    docker-compose -f docker-compose.dev.yml up

React frontend can be accessed at:

    http://0.0.0.0:8080/

And the backend API at:

    http://0.0.0.0:8080/api/orders

To stop running local server:

    docker-compose down

in a separate terminal window or press **control + C**.

### Production

Run

    docker-compose up -d --build
