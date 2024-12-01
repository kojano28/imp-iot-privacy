const { getMainDataStorage } = require('../controllers/getActionsController');

// Get action details based on actionId and humanReadableAction
exports.getActionDetails = (actionId, humanReadableAction, title) => {
    const mainDataStorage = getMainDataStorage(); // Retrieve mainDataStorage

    if (!mainDataStorage || !mainDataStorage.actions) {
        console.error("Main data storage is empty or not initialized.");
        return null;
    }

    const actionsArray = mainDataStorage.actions;

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

    return {
        href: form.href,
        op: form.op,
        contentType: form.contentType,
        //mthd: form.mthd,
        actionId,
        title,
        humanReadableAction
    };
};
