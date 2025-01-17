
# Unity HoloLens 2 Application with MRTK3

The Unity Application serves as the frontend for our backend application. Furthermore, this application receives JSON structured data of possible actions and present it to the user. The hololens user chooses an action he wants to disable and the backend scripts send the request to the backend. After completion of the action on the corresponding device, a script polls the backend for completed actions and notify the user through the popup.

## Table of Contents
- [Steps](#Steps)
- [Communication](#communication)
- [Directory Structure](#directory-structure)
- [Implemented Unity Parts](#implemented-unity-parts-in-assets)

## Steps
1. Clone the Repository

   ```bash
   git clone https://github.com/Interactions-HSG/2024-IMP-RightToPrivacyInMR.git
   cd 2024-IMP-RightToPrivacyInMR/Unity
   ```


2. Open the Project in Unity 
   - Ensure you have Unity 2022.x.x (or compatible version) installed. This project was built with Editor Version: 2022.3.49f1
   - Open Unity Hub and select the Add button.
   - Navigate to the cloned folder and select it as a project.


3. Set Up MRTK3: If MRTK3 is not already configured, follow these steps:

   - Install the MRTK3 packages via the Unity Package Manager.
   - Check the project settings to ensure MRTK3 components are properly set up for your target platform (e.g., HoloLens).


4. Run the Project
   - Go to Mixed > Remoting > Holographic Remoting for Play mode
   - Enter the IP-address of the Hololens
   - Enable the Holographic Remoting
   - Start Application by pressing play button on top of the Editor


## Communication

The `Unity Application` communicates to the backend through with this request:

- **ActionsPoll**
    - **URL:** `GET http://localhost:8090/api/getActions/fetchDataForHololens`
    - **Description:** Fetches action data from the backend, processes it into a cumulative list, and updates the HoloLens UI via the `UIManager`.
    - **Request Body:** None.
    - **Response:**
        - **200 OK:**
            - A JSON object containing an `analysis` array of action data.
            - Each action includes fields like `actionId`, `title`, `description`, `dataservice_url`, and the corresponding `dpv fields`.
        - **Error:** Logs errors in Unity if the request fails or data is invalid.


- **ActionSender**
    - **URL:** `POST http://localhost:8090/api/executeActions/data`
    - **Description:** Sends action data to the backend for execution. The data is formatted as JSON and transmitted via a POST request.
    - **Request Body:**
        - A JSON object containing the action data. Fields depend on the structure of the `ActionData` object.
    - **Response:**
        - **200 OK:**
            - Confirmation that the action was received and processed by the backend.
            - Response body may include additional status information.
        - **Error:** Logs an error in Unity if the request fails or the backend is unreachable.


- **ActionsExecutedPoll**
    - **URL:** `GET http://localhost:8090/api/checkActionsStatus/completedActions`
    - **Description:** Polls the backend for the status of executed actions, processes the received data, and updates the HoloLens UI. Ensures that already processed actions are not duplicated.
    - **Request Body:** None.
    - **Response:**
        - **200 OK:**
            - A JSON object containing an array of executed actions.
            - Each action includes fields like:
                - `actionId` (string): Unique identifier for the action.
                - `title` (string): Title of the executed action.
                - `humanReadableAction` (string): Human-readable description of the action.
                - `status` (string): Status of the executed action.
        - **Error:** Logs an error in Unity if the request fails or no valid actions are received.


## Directory Structure

```plaintext
unity/
├── src/
│   ├── .plastic/
│   ├── Assets/
│   │   ├── BackendScripts/
│   │   └── Prefabs/
│   ├── Packages/
│   ├── ProjectSettings/
├── .gitignore
├── .vsconfig
├── README.md
├── ignore.conf
└── packages.config
```

## Implemented Unity Parts in /Assets

### Scripts
- [ActionDisplayUI.cs](./Assets/BackendScripts/): 
- [ActionSender.cs](./Assets/BackendScripts/ActionSender.cs)
- [ActionSenderData.cs](./Assets/BackendScripts/ActionSenderData.cs) Data Serializer for the ActionSender
- [ActionsPoll.cs](./Assets/BackendScripts/ActionsPoll.cs)
- [ActionsPollData.cs](./Assets/BackendScripts/ActionsPollData.cs) Data Deserializer for the ActionsPoll
- [ActionsExecutedPoll.cs](./Assets/BackendScripts/ActionsExecutedPoll.cs)
- [ActionsExecutedPollData.cs](./Assets/BackendScripts/ActionsExecutedPollData.cs) Data Deserializer for the ActionsExecutedPoll
- [ActionDataCard.cs](./Assets/ActionDataCard.cs)
- [PopUpController.cs](./Assets/PopUpController.cs)
- [UIManager.cs](./Assets/UIManager.cs): 
- [BackendManager.cs](./Assets/BackendScripts/BackendManager.cs)


### UI-Elements in SampleScene as Gameobjects

- **ContainerListDevices**: This container holds the base canvas for the list of all possible actions, the actions itself will be created by the [DiscoveredActionswithScript.prefab](#prefabs)
- **ContainerStart**: This container holds UI elements for the start canvas.
- **ContainerLoadingDevices**: This container is used as a loading canvas placeholder, till the backend has processed the data.
- **ContainerPopUp**: This holds UI elemenents for different notifications which will be shown as popups.


### Prefabs
- [DiscoveredActionswithScript.prefab](./Assets/Prefabs/DiscoveredActionswithScript.prefab): This prefab is used for visualize each action on the ContainerListDevices element.


