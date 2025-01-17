[System.Serializable]
public class ActionData
{
    public string actionId;
    public string humanReadableAction;
    public string title;
    public string description;
    public string actionType;
    public string legalBasisType;
    public string dataserviceUrl;
}

[System.Serializable]
public class AnalysisData
{
    public ActionData[] analysis;
}
