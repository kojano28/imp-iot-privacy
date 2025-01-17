// analysisService.js
const policyParser = require('../helpers/policyParser');
const tdParser = require('../helpers/tdParser');

exports.analyze = async (td, privacyPolicy) => {
    const actions = tdParser.extractActions(td);  // Array of actions with humanReadableAction and actionId
    const dpvMapping = policyParser.extractDpvMapping(privacyPolicy);  // dpvMapping object

    const analysis = actions.map(action => {
        const combinedAction = {
            action: {
                ...action.action,  // Add humanReadableAction and actionId from tdParser
                dpvMapping: dpvMapping.action.dpvMapping  // Add dpvMapping from policyParser
            }
        };

        // Add actionType if the legal basis is LegitimateInterestOfController
        if (combinedAction.action.dpvMapping["dpv:hasLegalBasis"].type === "dpv:LegitimateInterestOfController") {
            combinedAction.action.actionType = "assistiveToolDevice";
        }

        return combinedAction;
    });

    return analysis;
};
