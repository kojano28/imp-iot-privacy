const axios = require('axios');
const os = require('os');
const { onDeviceFound } = require('./deviceProcessor'); // Ensure onDeviceFound is correctly imported
const commonPorts = [80, 8080, 443, 5683, 3000, 4000, 8000, 8084]; // Common ports to scan
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

// Function to fetch the Thing Description from a single IP and port
const fetchThingDescription = async (ip, port) => {
    const url = `http://${ip}:${port}/.well-known/wot-thing-description`;
    try {
        const response = await axios.get(url, { timeout: 1000 });
        console.log(`Found Thing Description at ${ip} on port ${port}`);
        return { ip, port, thingDescription: response.data };
    } catch (error) {
        if (error.code !== 'ECONNABORTED' && error.response?.status !== 404) {
            // Suppress errors other than timeout or 404
        }
    }
    return null;
};

// Function to scan a single IP across all ports
const scanDevicePorts = async (ip) => {
    const scanResults = await Promise.all(
        commonPorts.map(port => fetchThingDescription(ip, port))
    );

    // Filter out null results and process discovered devices
    for (const result of scanResults.filter(r => r !== null)) {
        await onDeviceFound(result);
    }
};

// Function to continuously scan the network for devices
const startScanning = async () => {
    console.log('Starting network scanning...');
    while (true) {
        const devices = scanNetwork();
        console.log(`Discovered ${devices.length} IP addresses. Checking for Thing Descriptions...`);

        // Scan each IP for Thing Descriptions on all common ports
        await Promise.all(devices.map(ip => scanDevicePorts(ip)));

        console.log('Device discovery iteration complete. Waiting for next scan...');
        await new Promise(resolve => setTimeout(resolve, scanInterval));
    }
};

module.exports = { startScanning };
