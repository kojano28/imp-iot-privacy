// IotService.js

let mainDataStorage = {};  // Persistent in-memory storage for action data

// store data in the main storage (could be called from a different controller if needed)
exports.storeDataForHololens = (data) => {
    mainDataStorage = data;
    console.log('Data stored successfully in main storage');
};

// get action details based on actionId and humanReadableAction
exports.getActionDetails = (actionId, humanReadableAction) => {
    const analysisArray = mainDataStorage.analysis || [];

    // action matching actionId and humanReadableAction
    const actionItem = analysisArray.find(item =>
        item.action.actionId === actionId &&
        item.action.humanReadableAction === humanReadableAction
    );

    if (!actionItem) return null;

    // Extract the relevant form details
    const form = actionItem.action.forms[0];
    return {
        href: form.href,
        op: form.op,
        contentType: form.contentType,
        actionId
    };
};
