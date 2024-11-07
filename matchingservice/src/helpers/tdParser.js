// tdParser.js

/**
 * Function to extract actions from a Thing Description (TD)
 * @param {Object} td - The Thing Description object
 * @returns {Array} - List of action JSON objects with additional fields
 */
function extractActions(td) {
    if (!td || !td.actions) {
        return [];
    }

    return Object.keys(td.actions).map((actionName, index) => {
        const actionDetails = td.actions[actionName];
        // Format index to always be a three-digit number, starting with 001
        const actionId = `action-${String(index + 1).padStart(3, '0')}`;

        return {
            action: {
                humanReadableAction: actionName,
                actionId: actionId,
                description: actionDetails.description || '',
                output: actionDetails.output || {},
                forms: actionDetails.forms ? actionDetails.forms.map(form => ({
                    href: form.href,
                    contentType: form.contentType,
                    op: form.op
                })) : []
            }
        };
    });
}

module.exports = { extractActions };
