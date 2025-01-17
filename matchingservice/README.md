
# MatchingService

The `matchingservice` is a microservice designed to interact with `dataservice`, fetch privacy policy and Thing Description (TD) data, and analyze the TD actions based on privacy mappings. It is triggered by a POST request that includes a `DATASERVICE_URL`, which is used to fetch the necessary data and conduct an analysis based on privacy regulations.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Configuration](#docker-configuration)
- [Directory Structure](#directory-structure)
- [Example Request](#example-request)

## Installation

To install the necessary dependencies, navigate to the `matchingservice` directory and run:

```bash
npm install
```

## Usage

To start the service locally, run:

```bash
node app.js
```

This will start the server on the port specified in `.env` or default to port `8082`.

## API Endpoints

The `matchingservice` provides the following endpoint:

- **Analyze Device**
    - **URL:** `POST /api/analyze-device`
    - **Description:** Analyzes TD actions based on privacy policies.
    - **Request Body**:
        - `DATASERVICE_URL`: URL of the `dataservice` to fetch the TD and privacy policy.
    - **Response**:
        - Returns an array of actions with attributes like `actionType`, `humanReadableAction`, `dpvMapping`, and `actionId`.

## Environment Variables

`matchingservice` uses a `.env` file to define its environment variables. Key variables include:

- `PORT`: Specifies the port on which the service will run (default: `8082`).

## Docker Configuration

The service is designed to run in a Docker container. Below is an example `docker-compose` configuration:

```yaml
matchingservice:
  build: ./matchingservice
  depends_on:
    - dataservice
  ports:
    - "8082:8082" # Expose matchingservice on port 8082
  networks:
    - imp-network
```

## Directory Structure

```plaintext
matchingservice/
├── src/
│   ├── controllers/
│   │   └── deviceController.js
│   ├── routes/
│   │   └── matchingRoutes.js
│   ├── services/
│   │   ├── thingDescriptionService.js
│   │   └── analysisService.js
│   ├── helpers/
│   │   ├── policyParser.js
│   │   └── tdParser.js
├── .env
├── Dockerfile
├── app.js
└── package.json
```

## Example Request

To trigger analysis, send a POST request to `http://localhost:8082/api/analyze-device` with `dataservice_url` in the request body:

Hier noch wo dass man die URLs findet.

```bash
curl --location 'http://localhost:8082/api/analyze-device' \
--header 'Content-Type: application/json' \
--data '{
        "dataservice_url": [
        "http://172.19.0.3:3000",
        "http://172.19.0.3:4000"]
      }'
```

