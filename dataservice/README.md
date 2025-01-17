# DataService

The `dataservice` is a microservice designed to simulate IoT devices. It provides interfaces for accessing the Thing Descriptions (TDs) and privacy policies of two devices: `Hue Lamp` and `HIKVision Camera`.

---

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Configuration](#docker-configuration)
- [Directory Structure](#directory-structure)
- [Example Requests](#example-requests)
---

## Overview

The `dataservice` runs two subservices:
- **Camera Service**: Provides the Thing Description and privacy policy for a simulated HIKVision camera.
- **Hue Lamp Service**: Provides the Thing Description and privacy policy for a simulated Hue Lamp.

Each service operates independently, with APIs to retrieve device metadata and privacy-related information.

---

## Installation

### Prerequisites
- Node.js and npm installed
- `dotenv` for environment variable management

### Steps
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd dataservice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file. Example:
   ```env
   CAMERA_PORT=3000
   HUELAMP_PORT=4000
   ```

---

## Usage

To start the services, run the following commands:

### Start Camera Service
```bash
node app.js
```

### Start Hue Lamp Service
```bash
node app.js
```

The services will run on the ports specified in the `.env` file or default to `3000` for Camera and `4000` for Hue Lamp.

---

## API Endpoints

### Camera Service
- **Thing Description**
    - **URL**: `GET /.well-known/wot-thing-description`
    - **Description**: Retrieves the Thing Description for the camera.

- **Privacy Policy**
    - **URL**: `GET /api/privacypolicy`
    - **Description**: Retrieves the privacy policy for the camera.

### Hue Lamp Service
- **Thing Description**
    - **URL**: `GET /.well-known/wot-thing-description`
    - **Description**: Retrieves the Thing Description for the Hue Lamp.

- **Privacy Policy**
    - **URL**: `GET /api/privacypolicy`
    - **Description**: Retrieves the privacy policy for the Hue Lamp.

---

## Environment Variables

| Variable       | Description                   | Default |
|----------------|-------------------------------|---------|
| `PORT`         | Port for the Docker Service   | `8084`  |

---

## Docker Configuration

The `dataservice` is containerized for easy deployment. Below is a sample `docker-compose.yml` configuration:

```yaml
dataservice:
  build: ./dataservice
  ports:
    - "3000:3000" # Camera Service
    - "4000:4000" # Hue Lamp Service
  networks:
    - imp-network
```

---

## Directory Structure

```
dataservice/
├── services/
│   ├── camera.js           # Camera Service Logic
│   ├── huelamp.js          # Hue Lamp Service Logic
├── data/
│   ├── TD/
│   │   ├── camera.json     # Thing Description for Camera
│   │   └── huelamp.json    # Thing Description for Hue Lamp
│   └── privacypolicies/
│       ├── 01_camera.ttl   # Privacy Policy for Camera
│       └── 02_huelamp.ttl  # Privacy Policy for Hue Lamp
├── .env
├── Dockerfile
├── app.js                  # Entry Point
└── package.json
```

---

## Example Requests

### Fetch Camera Thing Description
```bash
curl http://localhost:3000/.well-known/wot-thing-description
```

### Fetch Hue Lamp Privacy Policy
```bash
curl http://localhost:4000/api/privacypolicy
```
