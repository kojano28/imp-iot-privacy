/**
 * Function to extract actions from a Thing Description (TD)
 * @param {Object} td - The Thing Description object
 * @returns {Array} - List of action JSON objects with additional fields
 */
function extractActions(td) {
    if (!td || !td.actions) {
        return [];
    }

    const title = td.title || 'UnknownDevice'; // Default to 'UnknownDevice' if not provided
    const uniquePrefix = title.replace(/\s+/g, '_').toLowerCase(); // Create a unique prefix from the TD's title

    return Object.keys(td.actions).map((actionName, index) => {
        const actionDetails = td.actions[actionName];
        // Format actionId to include the unique prefix and a three-digit index
        const actionId = `${uniquePrefix}-action-${String(index + 1).padStart(2, '0')}`;

        return {
            action: {
                humanReadableAction: actionName,
                actionId: actionId, // Globally unique action ID
                title: title, // Include the title of the TD
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
