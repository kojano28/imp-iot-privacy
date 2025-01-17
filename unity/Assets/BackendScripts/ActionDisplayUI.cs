using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ActionDisplayUI : MonoBehaviour
{
    public TextMeshProUGUI titleText;         // Title field
    public TextMeshProUGUI descriptionText;  // Description field
    public TextMeshProUGUI humanReadableActionText; // Optional
    public TextMeshProUGUI actionIdText;     // Optional
    public TextMeshProUGUI actionTypeText;   // Optional
    public TextMeshProUGUI legalBasisTypeText; // Optional

    public System.Action onButtonClick; // Reference to the action button

    /// <summary>
    /// Updates the UI with action data and assigns button functionality.
    /// </summary>
    public void UpdateActionUI(
        string title,
        string description,
        string humanReadableAction,
        string actionId,
        string actionType,
        string legalBasisType,
        System.Action buttonCallback)
    {
        // Update mandatory fields
        titleText.text = title;
        descriptionText.text = description;
        onButtonClick = buttonCallback;

        // Update optional fields
        SetText(humanReadableActionText, humanReadableAction, "Action: ");
        SetText(actionIdText, actionId, "ID: ");
        SetText(actionTypeText, actionType, "Type: ");
        SetText(legalBasisTypeText, legalBasisType, "Legal Basis: ");

        Debug.Log($"UI Updated: Title = {title}, Description = {description}, Action ID = {actionId}");

    }
    // Method to trigger when the button is clicked
    public void OnActionButtonClicked()
    {
        if (onButtonClick != null)
        {
            Debug.Log($"Button clicked for action: {titleText.text}");
            onButtonClick.Invoke();

        }
        else
        {
            Debug.LogWarning("Button callback is not set.");
        }
    }
    /// <summary>
    /// Sets the text of an optional field, adding a prefix if the field is not null.
    /// </summary>
    private void SetText(TextMeshProUGUI textField, string value, string prefix = "")
    {
        if (textField != null)
        {
            textField.text = string.IsNullOrEmpty(value) ? "" : prefix + value;
            textField.gameObject.SetActive(!string.IsNullOrEmpty(value)); // Hide field if value is null/empty
        }
    }
}
