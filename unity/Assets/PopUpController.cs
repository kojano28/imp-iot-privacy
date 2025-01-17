using TMPro;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PopupController : MonoBehaviour
{
    public GameObject popupPanel;         // The panel GameObject
    public TextMeshProUGUI popupText;     // The TextMeshPro field for the message

    private Queue<string> messageQueue = new Queue<string>(); // Queue to store messages
    private bool isDisplayingMessage = false;                // Flag to prevent concurrent popups
    private float popupDuration = 5f;                        // Duration for each popup (minimum 5 seconds)

 
    /// <param name="message">The message to display.</param>
    public void ShowPopup(string message)
    {
        // Ensure the PopUpCanvas is active
        if (!popupPanel.activeInHierarchy)
        {
            popupPanel.SetActive(true);
        }

        popupText.text = message;  // Set the message text

        // Stop any running coroutines to avoid conflicts
        StopAllCoroutines();

        // Start the auto-close coroutine
        StartCoroutine(ProcessPopupQueue());
    }

    public void ClosePopup()
    {
        popupPanel.SetActive(false); // Hide the popup panel immediately
        StopAllCoroutines();         // Stop any running coroutines
        messageQueue.Clear();        // Clear the message queue to prevent further popups
        isDisplayingMessage = false; // Reset the flag for processing messages

        Debug.Log("Popup manually closed.");
    }




    private IEnumerator ProcessPopupQueue()
    {
        isDisplayingMessage = true; // Set the flag to indicate processing has started

        while (messageQueue.Count > 0)
        {
            string message = messageQueue.Dequeue(); // Get the next message
            Debug.Log($"Displaying popup message: {message}");

            popupText.text = message;  // Set the message text
            popupPanel.SetActive(true); // Show the popup panel

            // Wait for the popup duration
            yield return new WaitForSeconds(popupDuration);

            popupPanel.SetActive(false); // Hide the popup after the duration
        }

        isDisplayingMessage = false; // Reset the flag when all messages are processed
    }

}
