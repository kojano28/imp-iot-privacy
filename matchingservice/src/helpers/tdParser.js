// tdParser.js

/**
 * Function to extract actions from a Thing Description (TD)
 * @param {Object} td - The Thing Description object
 * @returns {Array} - List of action JSON objects
 */
function extractActions(td) {
    if (!td || !td.actions) {
        return [];
    }

    return Object.keys(td.actions).map((actionName, index) => ({
        action: {
            humanReadableAction: actionName,
            actionId: `action-0${index + 1}`
        }
    }));
}

module.exports = { extractActions };
