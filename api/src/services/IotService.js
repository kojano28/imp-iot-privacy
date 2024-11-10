// IotService.js

let dataForHololens = {};  // Assume this is the in-memory storage for action data

// Function to store data for HoloLens (could be called from a different controller if needed)
exports.storeDataForHololens = (data) => {
    dataForHololens = data;
    console.log('Data stored successfully for HoloLens');
};

// Function to get action details based on actionId and humanReadableAction
exports.getActionDetails = (actionId, humanReadableAction) => {
    const analysisArray = dataForHololens.analysis || [];

    // Find the action matching actionId and humanReadableAction
    const actionItem = analysisArray.find(item =>
        item.action.actionId === actionId &&
        item.action.humanReadableAction === humanReadableAction
    );

    if (!actionItem) return null;

    // Extract the relevant form details
    const form = actionItem.action.forms[0];  // Assuming the first form is the one we need
    return {
        href: form.href,
        op: form.op,
        contentType: form.contentType,
        actionId
    };
};
