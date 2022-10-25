// wdio.minibrowser-cloud-container-service.conf.js 

/*
 - This configuration runs in Google Cloud Run, and headfully, meaning not headless.
 - It runs against a container running WebKitGTK browsers.

 From the WebdriverIO docs:
 $ CLOUD_CONTAINER_APP_URL=<your_cloud_container_url> CLOUD_CONTAINER_ACCESS_TOKEN=<token> npx wdio wdio.minibrowser-cloud-container-service.conf.js

*/


const merge = require('deepmerge');
const config = {};
config.default = require('./wdio.conf.js').config;

const ARCH = process.env.CLOUD_CONTAINER_ARCH === undefined
    ? 'x86_64'
    : process.env.CLOUD_CONTAINER_ARCH;

const REQUEST_INTERVAL_TIME = process.env.REQUEST_INTERVAL_TIME === undefined
    ? 0 
    : parseInt(process.env.REQUEST_INTERVAL_TIME);

console.log('REQUEST_INTERVAL_TIME = ' + REQUEST_INTERVAL_TIME);

// insert modified configuration inside
config.override = {
    debug: false,
    execArgv: [],
    port: 443,
    protocol: 'https',
    hostname: process.env.CLOUD_CONTAINER_APP_URL,
    headers: {
        'authorization': 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
    },
    strictSSL: true,
    services: [['cloud-container', {
        maxAttempts: 12,
        retryTimeout: 6000,
        requestIntervalTime: REQUEST_INTERVAL_TIME
    }]],
    path: '/',
    automationProtocol: 'webdriver',
    capabilities: [{
        maxInstances: 1,
        browserName: 'MiniBrowser',
        'webkitgtk:browserOptions': {
            args: [
                '--automation'
            ],
            binary: `/usr/lib/${ARCH}-linux-gnu/webkit2gtk-4.0/MiniBrowser`
        }
    }],
    logLevel: 'debug',
    mochaOpts: {
        ui: 'bdd',
        // 60 secs or 20 minutes - larger value helps prevent the browser closing while debugging
        timeout: 60000 //1200000
    },
    reporters: [
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }], 'spec'
    ]
};

// overwrite any arrays in default with arrays in override.
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

// have main config file as default but overwrite environment specific information
exports.config = merge(config.default, config.override, { arrayMerge: overwriteMerge, clone: false });

