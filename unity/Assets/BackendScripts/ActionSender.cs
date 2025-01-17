using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;

public class ActionSender : MonoBehaviour
{
    private string actionUrl = "http://localhost:8090/api/executeActions/data";

    // Send each action data to the backend
    public void SendActionToBackend(ActionData actionData)
    {
        string jsonData = JsonUtility.ToJson(actionData);
        Debug.Log("Formatted JSON data to send: " + jsonData);
        StartCoroutine(PostRequest(actionUrl, jsonData));
    }

    private IEnumerator PostRequest(string url, string jsonData)
    {
        Debug.Log("Sending JSON data to backend: " + jsonData);

        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] jsonToSend = Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(jsonToSend);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Action sent successfully: " + request.downloadHandler.text);
        }
        else
        {
            Debug.LogError("Error sending action: " + request.error);
        }
    }
}
