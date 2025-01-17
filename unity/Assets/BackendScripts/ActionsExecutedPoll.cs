using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class ActionsExecutedPoll : MonoBehaviour
{
    private string pollingUrlExecutedActions = "http://localhost:8090/api/checkActionsStatus/completedActions";
    public UIManager uiManager; 
    private HashSet<string> processedActions = new HashSet<string>(); // To track already processed actions

    public void StartPollingExecutedActions()
    {
        // Start polling the backend every 10 seconds
        InvokeRepeating("PollExecutedActions", 0f, 10f);
    }

    public void StopPollingExecutedActions()
    {
        // Stop periodic polling
        CancelInvoke("PollExecutedActions");
    }

    public void PollExecutedActions()
    {
        Debug.Log("Polling for executed actions...");
        StartCoroutine(GetRequest(pollingUrlExecutedActions));
    }

    private IEnumerator GetRequest(string url)
    {
        UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Received executed actions data: " + request.downloadHandler.text);

            // Deserialize JSON response
            ExecutedActionResponse response = JsonConvert.DeserializeObject<ExecutedActionResponse>(request.downloadHandler.text);

            if (response != null && response.executedActions != null && response.executedActions.Length > 0)
            {
                Debug.Log($"Received {response.executedActions.Length} executed actions.");
                ProcessExecutedActions(response.executedActions);
            }
            else
            {
                Debug.LogWarning("No executed actions received from backend.");
            }
        }
        else
        {
            Debug.LogError("Error fetching executed actions: " + request.error);
        }
    }

    private void ProcessExecutedActions(ExecutedAction[] executedActions)
    {
        foreach (var action in executedActions)
        {
            if (action != null)
            {
                if (!processedActions.Contains(action.actionId))
                {
                    Debug.Log($"Processing Executed Action - ID: {action.actionId}, Title: {action.title}, HumanReadable: {action.humanReadableAction}, Status: {action.status}");

                    // Mark the action as processed
                    processedActions.Add(action.actionId);

                    // Display the action in the UI
                    uiManager.DisplayExecutedAction(action.actionId, action.title, action.humanReadableAction, action.status);
                }
                else
                {
                    Debug.Log($"Action ID {action.actionId} has already been processed. Skipping.");
                }
            }
            else
            {
                Debug.LogWarning("An executed action in the array is null.");
            }
        }
    }
}
