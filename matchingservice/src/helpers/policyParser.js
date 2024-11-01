// policyParser.js

/**
 * Function to extract DPV mappings from the privacy policy
 * @param {Object} privacyPolicy - The privacy policy object
 * @returns {Object} - dpvMapping JSON object for the action
 */
function extractDpvMapping(privacyPolicy) {
    return {
        action: {
            dpvMapping: {
                "dpv:Process": privacyPolicy.process || "ex:AnalyzeSpeech",
                "dpv:hasProcessing": privacyPolicy.processing || "dpv:Use",
                "dpv:hasDataController": privacyPolicy.dataController || "ex:ACMM",
                "dpv:hasPersonalData": privacyPolicy.personalData || [
                    {
                        "dpv:PersonalDataCategory": "AudioData"
                    }
                ],
                "dpv:hasLegalBasis": {
                    type: privacyPolicy.legalBasis || "dpv:LegitimateInterestOfController"
                }
            }
        }
    };
}

module.exports = { extractDpvMapping };
