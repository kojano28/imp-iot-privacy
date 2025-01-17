
# MatchingService

The `api` service is a microservice designed to interact with the hololens, IoT devices and with the backend. First, this service receives the URLs from the detected devices and triggers the matchingservice for analysis. After the analysis the JSON will be received and stored in memory and the data is ready for the hololens to request it. If the user chooses an action to disable the api service handles this frontend requet and start an interaction with the IoT devices. After the action has been executed, the action will be stored in an in-memory storage and the hololens could retrieve it on request.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Configuration](#docker-configuration)
- [Directory Structure](#directory-structure)
- [Example Request](#example-request)

## Installation

To install the necessary dependencies, navigate to the `api` directory and run:

```bash
npm install
```

## Usage

To start the service locally, run:

```bash
node app.js
```

This will start the server on the port specified in `.env` or default to port `3001`.

## API Endpoints

The `api` service provides the following endpoints:

- **SendToHololens**
    - **URL:** `POST /api/getActions/sendToHololens`
    - **Description:** Stores incoming data in the main storage and creates a temporary copy for HoloLens retrieval.
    - **Request Body**:
        - The request body is a JSON object containing the data to be stored. The structure depends on the application context.

    - **Response**:
        - **200 OK**:
            - `status` (string): Confirmation that the data has been stored and a temporary copy has been created for HoloLens.

- **FetchDataForHololens**
    - **URL:** `GET /api/getActions/fetchDataForHololens`
    - **Description:** Allows the HoloLens to retrieve temporarily stored data. If data is available, it is sent and then cleared. If no data is available, an empty response is returned.
    - **Request Body**: None.

    - **Response**:
        - **200 OK**:
            - Returns the stored data as a JSON object.
        - **204 No Content**:
            - Indicates no temporary data is available for retrieval.

- **HandleFrontendPost**
    - **URL:** `POST /api/executeActions/data`
    - **Description:** Processes a frontend POST request to handle an IoT action. Validates the input, retrieves action details, sends the action to a device, and responds asynchronously.
    - **Request Body**:
        - `actionId` (string, required): The unique identifier of the action to process.
        - `humanReadableAction` (string, required): A user-friendly description of the action.
        - `title` (string, optional): An optional title for additional context.

    - **Response**:
        - **200 OK**:
            - `status` (string): Confirmation that the action has been received and processing has started.
        - **400 Bad Request**:
            - `error` (string): Error message indicating missing `actionId` or `humanReadableAction`.


- **HandleDetectedDevices**
    - **URL:** `POST /api/objectDetection/detectedDevices`
    - **Description:** Receives a list of detected device IP addresses, validates the input, and forwards each IP address to a matching service for further analysis.
    - **Request Body**:
        - A JSON array of IP addresses (strings), e.g., `["192.168.0.1", "192.168.0.2"]`.

    - **Response**:
        - **200 OK**:
            - `message` (string): Confirmation that all IP addresses were forwarded successfully.
        - **400 Bad Request**:
            - `error` (string): Error message indicating invalid or missing IP data.

- **HandleActionsStatusRequests**
    - **URL:** `GET /api/checkActionsStatus/completedActions`
    - **Description:** Retrieves a list of completed actions from the in-memory store, including their details and status.
    - **Request Body**: None.

    - **Response**:
        - **200 OK**:
            - `executedActions` (array): A list of completed actions, where each action contains:
                - `actionId` (string): The unique identifier of the action.
                - `title` (string): The title of the action.
                - `humanReadableAction` (string): A user-friendly description of the action.
                - `status` (string): The status of the action (e.g., "completed").
        - **500 Internal Server Error**:
            - `error` (string): Error message indicating a failure to retrieve completed actions.


## Environment Variables

`api` uses a `.env` file to define its environment variables. Key variables include:

- `PORT`: Specifies the port on which the service will run (default: `3001`).
- `HUE_IP`: Specifies the ip address of the Huelamp in the local network.
- `HUE_API_KEY`: Specifies the API key for the authentication to connect with the hueLamp
- `CAMERA_USERNAME`: Specifies the username for authentication with the camera
- `CAMERA_IP`: Specifies the ip address of the Hikvision camera in the local network.
- `HUE_PASSWORD`: Specifies the password for authentication to connect with the camera

## Docker Configuration

The service is designed to run in a Docker container. Below is an example `docker-compose` configuration:

```yaml
  api:
    build: ./api # Path to Dockerfile
    ports:
      - "8090:8090"
    networks:
      - imp-network
```

## Directory Structure

```plaintext
api/
├── src/
│   ├── adapters/
│   │   ├── CameraAdapter.js
│   │   ├── DeviceAdapter.js
│   │   └── HueLampAdapter.js
│   ├── controllers/
│   │   ├── checkActionsStatusController.js
│   │   ├── detectionController.js
│   │   ├── executeActionsController.js
│   │   ├── getActionsController.js
│   │   └── IotController.js
│   ├── routes/
│   │   ├── checkActionsStatusRoutes.js
│   │   ├── executeActionsRoutes.js
│   │   ├── getActionsRoutes.js
│   │   └── objectDetectionRoutes.js
│   ├── services/
│   │   ├── completedActionsStore.js
│   │   ├── digestAuth.js
│   │   └── IotService.js
├── .env
├── Dockerfile
├── app.js
└── package.json
```

## IoT Endpoints

In this project two IoT device were integrated for testing purposes. The whole logic is found in the [Adapters](./src/adapters)

The goals of the implemented .js files are the following:

- [DeviceAdapters](./src/adapters/DeviceAdapters.js): The Device Adapter is a simple if-else logic used to determine which device to interact with based on the device's URL.
- [CameraAdapter](./src/adapters/CameraAdapter.js): This adapter only contains the logic specific to a request for the camera.
- [HueLampAdapter](./src/adapters/HueLampAdapter.js): This adapter only contains the logic specific to a request for the HueLamp.