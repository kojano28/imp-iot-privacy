const { getMainDataStorage } = require('../controllers/getActionsController');

// Get action details based on actionId, humanReadableAction, and title
exports.getActionDetails = (actionId, humanReadableAction, title) => {
    const mainDataStorage = getMainDataStorage(); // Retrieve mainDataStorage

    if (!mainDataStorage || !mainDataStorage.analysis) {
        console.error("Main data storage is empty or not properly structured.");
        return null;
    }

    const actionsArray = mainDataStorage.analysis; // Updated to use `analysis`

    // Find the matching action
    const actionItem = actionsArray.find(item =>
        item.actionId === actionId &&
        item.humanReadableAction === humanReadableAction &&
        item.title === title
    );

    if (!actionItem) {
        console.error(`Action not found for actionId: ${actionId}, humanReadableAction: ${humanReadableAction}`);
        return null;
    }

    // Validate and extract forms
    const form = actionItem.forms && actionItem.forms[0];
    if (!form) {
        console.error(`No forms found for actionId: ${actionId}, humanReadableAction: ${humanReadableAction}`);
        return null;
    }

    // Return the required details
    return {
        href: form.href,
        op: form.op,
        contentType: form.contentType,
        methodName: form.methodName,
        actionId,
        title,
        humanReadableAction
    };
};
