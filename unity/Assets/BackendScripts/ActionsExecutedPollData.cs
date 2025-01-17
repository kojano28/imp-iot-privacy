// Response structure for the backend's executed actions
[System.Serializable]
public class ExecutedActionResponse
{
    public ExecutedAction[] executedActions; // Array of executed actions
}

// Structure for a single executed action
[System.Serializable]
public class ExecutedAction
{
    public string actionId; // Unique identifier for the action
    public string humanReadableAction; // Human-readable message for the action
    public string title;
    public string status; // Status of the action (e.g., success, failure)
}