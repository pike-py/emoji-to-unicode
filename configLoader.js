const fs = require('fs');

let config = null;
let lastReadTime = 0;
const CONFIG_FILE_PATH = './config.json';
const CONFIG_REFRESH_INTERVAL = 3000; // Refresh interval in milliseconds (e.g., 60 seconds)

const loadConfig = () => {
    try {
        const stats = fs.statSync(CONFIG_FILE_PATH);
        if (stats.mtimeMs > lastReadTime) {
            const rawData = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
            config = JSON.parse(rawData);
            lastReadTime = stats.mtimeMs;
            console.log('Configuration file reloaded:', config);
        }
    } catch (e) {
        console.error(`Error loading JSON configuration file: ${e.message}`);
    }
};

const getConfig = () => {
    if (!config) {
        loadConfig();
    }
    return config;
};

// Periodically refresh the configuration
setInterval(loadConfig, CONFIG_REFRESH_INTERVAL);

module.exports = {
    getConfig
};
