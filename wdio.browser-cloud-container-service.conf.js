const BROWSER = process.env.CLOUD_CONTAINER_APP_URL.replace(/-.*/,'');
console.log('Run tests for browser ' + BROWSER);
module.exports.config = require(`./wdio.${BROWSER}-cloud-container-service.conf.js`).config;

