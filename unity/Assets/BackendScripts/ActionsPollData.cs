[System.Serializable]
public class PollingResponse
{
    public ActionDetails[] analysis; // Adjusted to match the "analysis" array in the JSON
}

[System.Serializable]
public class ActionDetails
{
    public string humanReadableAction;
    public string actionId;
    public string title;
    public string description;
    public Output output;
    public Form[] forms;
    public DpvMapping dpvMapping;
    public string actionType;
    public string dataservice_url; 
}

[System.Serializable]
public class Output
{
    public string type; 
    public string description; 
    public DpvPersonalData dpv_PersonalData; 
    public string dpv_hasPurpose; 
    public string[] dpv_hasLegalBasis; 
}

[System.Serializable]
public class DpvPersonalData
{
    public DpvHasPersonalData[] dpv_hasPersonalData; 
}

[System.Serializable]
public class DpvHasPersonalData
{
    public string dpv_DataSubject; 
    public string dpv_PersonalDataType; 
}

[System.Serializable]
public class Form
{
    public string href; 
    public string contentType; 
    public string op; 
}

[System.Serializable]
public class DpvMapping
{
    public string dpv_Process; 
    public string dpv_hasProcessing; 
    public string dpv_hasDataController; 
    public DpvPersonalDataCategory[] dpv_hasPersonalData; 
    public DpvLegalBasis dpv_hasLegalBasis; 
}

[System.Serializable]
public class DpvPersonalDataCategory
{
    public string dpv_PersonalDataCategory; 
}

[System.Serializable]
public class DpvLegalBasis
{
    public string type; 
}
