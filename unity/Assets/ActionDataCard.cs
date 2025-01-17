[System.Serializable]
public class ActionDataCard
{
    public string humanReadableAction;
    public string actionId;
    public string description;
    public string title;
    public string actionType;
    public string legalBasisType;
    public string dataserviceUrl;

    // Method to convert ActionDataCard to ActionData
    public ActionData ToActionData()
    {
        return new ActionData
        {
            humanReadableAction = this.humanReadableAction,
            actionId = this.actionId,
            description = this.description,
            title = this.title,
            actionType = this.actionType,
            legalBasisType = this.legalBasisType,
            dataserviceUrl = this.dataserviceUrl
        };
    }
}
