const OpenAI = require('openai');

// Instantiate the OpenAI client with the API key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is loaded properly
});

/**
 * Generates a CURL command that improves the user's privacy for a given action.
 * @param {Object} action - The action object containing details about the IoT action.
 * @returns {Promise<string>} - The generated CURL command.
 */
exports.generateCurlCommand = async (action) => {
    try {
        // Prepare the prompt to send to GPT
        const prompt = createPrompt(action);

        // Use OpenAI's completion endpoint
        const response = await client.completions.create({
            model: 'text-davinci-003', // Ensure this is the model you want to use
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        });

        // Extract and return the CURL command
        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error.message);
        throw error;
    }
};

/**
 * Creates a prompt for the OpenAI API based on the action.
 * @param {Object} action - The action object.
 * @returns {string} - The prompt string.
 */
function createPrompt(action) {
    return `Given the following action from an IoT device:

${JSON.stringify(action, null, 2)}

Provide a CURL command that, when executed, will improve the end user's privacy by interacting with the IoT device for this action.

Please only provide the CURL command in your response, without any additional explanation.`;
}
