using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;
using System;

public class ActionsPoll : MonoBehaviour
{
    private string pollingUrl = "http://localhost:8090/api/getActions/fetchDataForHololens";
    public UIManager uiManager; // Reference to UIManager

    private List<ActionDataCard> cumulativeActions = new List<ActionDataCard>(); // Store all actions cumulatively

    private void ProcessData(PollingResponse response)
    {
        Debug.Log("Processing actions...");

        if (response.analysis == null || response.analysis.Length == 0)
        {
            Debug.LogWarning("The analysis array is null or empty.");
            return;
        }

        foreach (var action in response.analysis)
        {
            if (action != null)
            {
                Debug.Log($"Processing Action ID: {action.actionId}");
                Debug.Log($"Action Title: {action.title}");
                Debug.Log($"Dataservice URL: {action.dataservice_url}");

                // Convert the raw action data into ActionDataCard format
                ActionDataCard actionDataCard = new ActionDataCard
                {
                    humanReadableAction = action.humanReadableAction,
                    actionId = action.actionId,
                    description = action.description,
                    title = action.title,
                    actionType = action.actionType,
                    legalBasisType = action.dpvMapping?.dpv_hasLegalBasis?.type ?? "N/A",
                    dataserviceUrl = action.dataservice_url
                };

                // Add the action card to the cumulative list
                cumulativeActions.Add(actionDataCard);
            }
            else
            {
                Debug.LogWarning("An action in the array is null.");
            }
        }

        // Log the total number of cumulative actions
        Debug.Log($"Total cumulative actions: {cumulativeActions.Count}");

        // Pass all action cards to UIManager for display
        uiManager.DisplayActions(cumulativeActions);
    }




    public void StartPolling()
    {
        PollBackend();
    }

    public void StopPolling()
    {
        CancelInvoke("PollBackend");
    }

    private void PollBackend()
    {
        Debug.Log("Polling started...");
        StartCoroutine(GetRequest(pollingUrl));
    }

    private IEnumerator GetRequest(string url)
    {
        UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Received raw JSON: " + request.downloadHandler.text);

            try
            {
                PollingResponse response = JsonConvert.DeserializeObject<PollingResponse>(request.downloadHandler.text);

                if (response != null && response.analysis != null && response.analysis.Length > 0)
                {
                    Debug.Log("Deserialization successful.");
                    ProcessData(response);
                }
                else
                {
                    Debug.LogWarning("The analysis array is null or empty.");
                }
            }
            catch (Exception e)
            {
                Debug.LogError("Deserialization error: " + e.Message);
            }
        }
        else
        {
            Debug.LogError("Error fetching data: " + request.error);
        }
    }


}
