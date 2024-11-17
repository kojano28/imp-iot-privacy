
# AIService

The `aiservice` is a microservice designed to interact with OpenAI's GPT model to generate CURL commands for IoT device actions that enhance privacy. It processes an action input, sends it to GPT for analysis, and returns a JSON response containing a CURL command.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Configuration](#docker-configuration)
- [Directory Structure](#directory-structure)
- [Example Request](#example-request)
- [License](#license)

## Installation

To install the necessary dependencies, navigate to the `aiservice` directory and run:

```bash
npm install
```

## Usage

To start the service locally, run:

```bash
node app.js
```

This will start the server on the port specified in `.env` or default to port `8080`.

## API Endpoints

The `aiservice` provides the following endpoint:

- **Generate CURL Command**
    - **URL:** `POST /api/get-curl`
    - **Description:** Generates a CURL command to improve user privacy for a specified IoT device action.
    - **Request Body**:
        - `action`: An object containing details about the IoT action (e.g., `actionId`, `title`, `forms`).
    - **Response**:
        - Returns a CURL command in JSON format.

## Environment Variables

`aiservice` uses a `.env` file to define its environment variables. Key variables include:

- `PORT`: Specifies the port on which the service will run (default: `8080`).
- `OPENAI_API_KEY`: Your OpenAI API key required for GPT interaction.

## Docker Configuration

The service is designed to run in a Docker container. Below is an example `docker-compose` configuration:

```yaml
aiservice:
  build: ./aiservice
  ports:
    - "8080:8080" # Expose aiservice on port 8080
  networks:
    - imp-network
  environment:
    OPENAI_API_KEY: your-openai-api-key
```

Replace `your-openai-api-key` with your actual OpenAI API key.

## Directory Structure

```plaintext
aiservice/
├── controllers/
│   └── aiController.js
├── routes/
│   └── aiRoutes.js
├── services/
│   └── aiService.js
├── .env
├── app.js
├── Dockerfile
└── package.json
```

## Example Request

To generate a CURL command, send a POST request to `http://localhost:8080/api/get-curl` with the `action` object in the request body:

```bash
curl -X POST http://localhost:8080/api/get-curl \
  -H "Content-Type: application/json" \
  -d '{
        "action": {
          "humanReadableAction": "takeSnapshot",
          "actionId": "action-001",
          "title": "Simple IoT Camera",
          "description": "Takes a snapshot and returns the image URL.",
          "forms": [
            {
              "href": "https://example.com/camera/actions/takeSnapshot",
              "contentType": "application/json",
              "op": "invokeaction"
            }
          ]
        }
      }'
```

**Expected Response**:

```json
{
  "message": "CURL command generated successfully",
  "data": {
    "curlCommand": "curl -X POST 'https://example.com/camera/actions/takeSnapshot' -H 'Content-Type: application/json' -d '{"consent":"withdrawn"}'"
  }
}
```

## License

This project is licensed under the MIT License.
