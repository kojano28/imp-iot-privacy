const axios = require('axios');
const os = require('os');
const { onDeviceFound } = require('./deviceProcessor'); // Make sure to import the onDeviceFound function
const commonPorts = [80, 8080, 443, 5683, 3000, 8000, 8084]; // Common ports to scan
const scanInterval = 20000; // 20 seconds

// Function to scan the local network and discover devices
const scanNetwork = () => {
    console.log('Scanning network for devices...');
    const networkInterfaces = os.networkInterfaces();
    const devices = [];

    for (const iface in networkInterfaces) {
        const addresses = networkInterfaces[iface];
        addresses.forEach(addr => {
            if (addr.family === 'IPv4' && !addr.internal) {
                const baseIP = addr.address.split('.').slice(0, 3).join('.');
                for (let i = 1; i <= 254; i++) {
                    devices.push(`${baseIP}.${i}`);
                }
            }
        });
    }
    return devices;
};

// Function to check if a device has a Thing Description on any of the common ports
const fetchThingDescription = async (ip) => {
    for (const port of commonPorts) {
        const url = `http://${ip}:${port}/.well-known/wot-thing-description`;
        try {
            const response = await axios.get(url, { timeout: 1000 });
            console.log(`Found Thing Description at ${ip} on port ${port}`);
            return { ip, port, thingDescription: response.data };
        } catch (error) {
            if (error.code !== 'ECONNABORTED' && error.response?.status !== 404) {
                //console.error(`Error fetching Thing Description from ${ip} on port ${port}:`, error.message);
            }
        }
    }
    return null;
};

// Function to continuously scan the network for devices
const startScanning = async () => {
    console.log('Starting network scanning...');
    while (true) {
        const devices = scanNetwork();
        console.log(`Discovered ${devices.length} devices. Checking for Thing Descriptions...`);

        const scanPromises = devices.map(async (device) => {
            const result = await fetchThingDescription(device);
            if (result) {
                await onDeviceFound(result);
            }
        });

        await Promise.all(scanPromises);
        console.log('Device discovery iteration complete. Waiting for next scan...');
        await new Promise(resolve => setTimeout(resolve, scanInterval));
    }
};

module.exports = { startScanning };
