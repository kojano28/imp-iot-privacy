using System.Collections.Generic;
using UnityEngine;

public class UIManager : MonoBehaviour
{
    public BackendManager backendManager;

    public Canvas startCanvas;
    public Canvas loadingCanvas;
    public Canvas listActionsCanvas;
    public Canvas disabledActionsCanvas;
    public Canvas popUpCanvas;

    public PopupController popupController;

    public GameObject actionCardPrefab;    // Prefab for individual action cards
    public Transform actionsListParent;   // Parent object for the list of action cards

    public TMPro.TextMeshProUGUI popupMessageText;

    private void Start()
    {
        ActivateCanvas(startCanvas);
    }

    public void OnStartButtonPressed()
    {
        backendManager.StartPolling();
        ActivateCanvas(loadingCanvas);
        Invoke(nameof(GoToListActionsCanvas), 2f);
    }

    public void ReloadButtonPressed()
    {
        backendManager.StartPolling();
        ShowPopup("Refreshing available actions. Please wait...");
    }

    public void GoToListActionsCanvas()
    {
        ActivateCanvas(listActionsCanvas);
    }

    public void GoToDisabledActionsCanvas()
    {
        ActivateCanvas(disabledActionsCanvas);
    }

    public void BackFromListActions()
    {
        ActivateCanvas(startCanvas);
    }

    public void BackFromDisabledActions()
    {
        ActivateCanvas(startCanvas);
    }

    private void ActivateCanvas(Canvas targetCanvas)
    {
        startCanvas.gameObject.SetActive(false);
        loadingCanvas.gameObject.SetActive(false);
        listActionsCanvas.gameObject.SetActive(false);
        disabledActionsCanvas.gameObject.SetActive(false);

        // Do not deactivate the PopUpCanvas, as it is managed by PopupController
        if (targetCanvas != popUpCanvas)
        {
            popUpCanvas.gameObject.SetActive(false);
        }

        targetCanvas.gameObject.SetActive(true);
    }

    public void ShowPopup(string message)
    {
        if (popupController != null)
        {
            popupController.ShowPopup(message); // Delegate to the PopupController
        }
        else
        {
            Debug.LogError("PopupController is not assigned in UIManager.");
        }
    }

    public void DisplayExecutedAction(string actionId, string title, string humanReadableAction, string status)
    {
        Debug.Log($"Displaying Executed Action: ID = {actionId}, Title = {title}, Message = {humanReadableAction}, Status = {status}");

        // Display different messages based on the status
        if (status.ToLower() == "success")
        {
            ShowPopup($"The action '{humanReadableAction}' from device '{title}' was successfully executed.");
        }
        else if (status.ToLower() == "failure")
        {
            ShowPopup($"The action '{humanReadableAction}' from device '{title}' failed to execute. Please check the system for issues.");
        }

        Debug.Log($"Executed Action status: {status}");
    }

    public void DisplayActions(List<ActionDataCard> actions)
    {
        Debug.Log($"Displaying {actions.Count} actions.");

        // Clear existing action cards
        foreach (Transform child in actionsListParent)
        {
            Destroy(child.gameObject);
        }

        // Instantiate a new card for each action
        foreach (var action in actions)
        {
            Debug.Log($"Attempting to instantiate card for Action: Title = {action.title}, ID = {action.actionId}");

            try
            {
                GameObject actionCard = Instantiate(actionCardPrefab, actionsListParent);
                if (actionCard == null)
                {
                    Debug.LogError("Failed to instantiate action card prefab.");
                    continue;
                }

                ActionDisplayUI displayUI = actionCard.GetComponent<ActionDisplayUI>();
                if (displayUI == null)
                {
                    Debug.LogError("ActionDisplayUI component missing on instantiated prefab.");
                    continue;
                }

                // Update UI for this card
                displayUI.UpdateActionUI(
                    action.title,
                    action.description,
                    action.humanReadableAction,
                    action.actionId,
                    action.actionType,
                    action.legalBasisType,
                    () =>
                    {
                        backendManager.SendAction(action.ToActionData());
                        ShowPopup($"The action '{action.humanReadableAction}' from device '{action.title}' has been successfully sent to the backend. Polling for execution status will start.");
                    }
                );

                Debug.Log($"Successfully instantiated card for Action: Title = {action.title}, ID = {action.actionId}");
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Error instantiating card for Action: Title = {action.title}, Exception: {ex.Message}");
            }
        }

        // Verify total children in the parent
        Debug.Log($"Total child objects in ActionsListParent: {actionsListParent.childCount}");
    }

    // Method to trigger all action buttons
    public void DisableAllActions()
    {
        Debug.Log("Disabling all actions...");

        foreach (Transform child in actionsListParent)
        {
            ActionDisplayUI actionUI = child.GetComponent<ActionDisplayUI>();
            if (actionUI != null)
            {
                Debug.Log($"Disabling action: {actionUI.titleText.text}");
                actionUI.OnActionButtonClicked(); // Trigger the button callback
            }
            else
            {
                Debug.LogWarning("No ActionDisplayUI component found on child object.");
            }
        }
        // Show a popup confirming the action
        ShowPopup("All available actions have been disabled as requested.");
    }

    public void ClosePopup()
    {
        popupController?.ClosePopup(); // Safely call ClosePopup on the PopupController
        Debug.Log("Popup manually closed via UIManager.");
    }

}
