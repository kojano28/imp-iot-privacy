const fetch = require('node-fetch');
const rdf = require('rdflib');

// Function to fetch Thing Description from IoT device
async function fetchThingDescription(deviceUrl) {
    try {
        const response = await fetch(`${deviceUrl}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch TD from ${deviceUrl}: ${response.statusText}`);
        }
        const thingDescription = await response.json();
        return thingDescription;
    } catch (error) {
        console.error(`Error fetching Thing Description from ${deviceUrl}:`, error);
        throw error;
    }
}

// Function to analyze Thing Description
function analyzeThingDescription(thingDescription) {
    console.log('Raw Thing Description:', JSON.stringify(thingDescription, null, 2));

    const store = rdf.graph();
    const rdfNamespace = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    const wotNamespace = rdf.Namespace('https://www.w3.org/2019/wot/td#');

    // Parse Thing Description JSON-LD into RDF graph
    const thingDescriptionJsonLd = JSON.stringify(thingDescription);
    rdf.parse(thingDescriptionJsonLd, store, '', 'application/ld+json');

    // Extract properties, actions, and events
    const properties = store.each(null, rdfNamespace('type'), wotNamespace('Property'));
    const actions = store.each(null, rdfNamespace('type'), wotNamespace('Action'));
    const events = store.each(null, rdfNamespace('type'), wotNamespace('Event'));

    return {
        properties: properties.map(property => store.any(property, rdfNamespace('label')).value),
        actions: actions.map(action => store.any(action, rdfNamespace('label')).value),
        events: events.map(event => store.any(event, rdfNamespace('label')).value),
    };
}

// Main function to fetch and analyze Thing Description
async function fetchAndAnalyzeThingDescription(deviceUrl) {
    try {
        const thingDescription = await fetchThingDescription(deviceUrl);
        const analysis = analyzeThingDescription(thingDescription);
        console.log('Thing Description Analysis:', analysis);
        return analysis;
    } catch (error) {
        console.error('Error in fetching or analyzing Thing Description:', error);
        throw error;
    }
}

// Example usage
fetchAndAnalyzeThingDescription('http://plugfest.thingweb.io:8083/testthing')
    .then(analysis => {
        // Do something with the analysis
    })
    .catch(error => {
        console.error('Error:', error);
    });
