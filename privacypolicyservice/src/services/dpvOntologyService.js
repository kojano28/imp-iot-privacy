const rdf = require('rdflib');
const store = rdf.graph();  // RDF graph to hold the DPV ontology

// DPV ontology URL or local file path
const dpvOntologyUrl = 'https://w3c.github.io/dpv/2.0/dpv/dpv.ttl';

// DPV namespace
const dpvNamespace = rdf.Namespace('https://w3id.org/dpv/2.0');
const rdfNamespace = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const rdfsNamespace = rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');


let dpvFieldsCache = null;

// Function to load DPV ontology into the store
async function loadDPVOntology() {
    const fetcher = new rdf.Fetcher(store);
    try {
        await fetcher.load(dpvOntologyUrl);
        console.log('DPV Ontology loaded successfully');
        dpvFieldsCache = extractDPVFields();  // Extract and cache the fields
    } catch (error) {
        console.error('Error loading DPV Ontology:', error);
        throw error;
    }
}

// Function to extract DPV fields
function extractDPVFields() {
    const personalDataCategories = store.each(null, rdfNamespace('type'), dpvNamespace('PersonalDataCategory'));
    const processingActivities = store.each(null, rdfNamespace('type'), dpvNamespace('ProcessingActivity'));
    const legalBases = store.each(null, rdfNamespace('type'), dpvNamespace('LegalBasis'));

    // Extract labels and values from each field
    return {
        personalDataCategories: personalDataCategories.map(category => store.any(category, rdfsNamespace('label')).value),
        processingActivities: processingActivities.map(activity => store.any(activity, rdfsNamespace('label')).value),
        legalBases: legalBases.map(base => store.any(base, rdfsNamespace('label')).value),
    };
}

// Function to get cached DPV fields (initialize if not already done)
async function getDPVFields() {
    if (!dpvFieldsCache) {
        await loadDPVOntology();  // Load ontology if it's not yet loaded
    }
    return dpvFieldsCache;
}

module.exports = {
    loadDPVOntology,
    getDPVFields
};
