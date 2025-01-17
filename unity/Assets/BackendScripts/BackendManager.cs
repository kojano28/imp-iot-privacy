using UnityEngine;

public class BackendManager : MonoBehaviour
{
    public ActionsPoll actionsPoll;
    public ActionsExecutedPoll actionsExecutedPoll;
    public ActionSender actionSender;

    // Start polling for actions
    public void StartPolling()
    {
        actionsPoll.StartPolling();
        Debug.Log("Polling started.");
    }

    // Stop polling for actions
    public void StopPolling()
    {
        actionsPoll.StopPolling();
        Debug.Log("Polling stopped.");
    }

    // Send a single action to the backend
    public void SendAction(ActionData actionData)
    {
        actionSender.SendActionToBackend(actionData);
        Debug.Log("Action sent.");
        actionsExecutedPoll.StartPollingExecutedActions();
        Debug.Log("Starting polling for executed actions...");
        
    }
}
