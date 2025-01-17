// In-memory store for completed actions (shared between controllers)
const completedActionsStore = require('../services/completedActionsStore');

exports.getCompletedActions = (req, res) => {
    try {
        // Transform the completedActionsStore into an array format
        const executedActions = Object.entries(completedActionsStore).map(([actionId, action]) => ({
            actionId: actionId,
            title: action.title,
            humanReadableAction: action.humanReadableAction,
            status: action.status,
        }));

        res.json({ executedActions });
    } catch (error) {
        console.error('Error fetching completed actions:', error);
        res.status(500).json({ error: 'Failed to retrieve completed actions' });
    }
};


exports.clearCompletedActions = (req, res) => {
    try {
        // Clear the completed actions store
        Object.keys(completedActionsStore).forEach(actionId => {
            delete completedActionsStore[actionId];
        });

        res.json({ status: 'Completed actions cleared' });
    } catch (error) {
        console.error('Error clearing completed actions:', error);
        res.status(500).json({ error: 'Failed to clear completed actions' });
    }
};
