// wdio.minibrowser-heroku.conf.js

/**
 * This configuration file connects to the WebKitGTK2-based browser, MiniBrowser. 
 * Safari is one of the three most commonly used browsers, but to run it requires
 * expensive Apple hardware which cannot be virtualized in the cloud in a cost-effective
 * manner.  
 * 
 * MiniBrowser, like Safari, is based on the WebKit browser engine, and MiniBrowser runs
 * natively in Linux. Thus, MiniBrowser may be a suitable alternative to testing directly
 * on Apple's Safari browser.
 * 
 * Additionally, MiniBrowser can be deployed on a Docker image locally, or deployed to
 * a cloud platform, such as Heroku.
 * 
 * This configuration file connects to a cloud container service, as configured in the 
 * hidden .env file or by setting the following environment variables:
 * 
 * CLOUD_CONTAINER_APP_URL=https://YOUR_APP.herokuapp.com
 * CLOUD_CONTAINER_ACCESS_TOKEN=YOUR_CONTAINER_ACCESS_TOKEN (ex: set in Config Vars in Heroku app settings)
 * CLOUD_CONTAINER_ARCH=x86_64 by default
 */


const merge = require('deepmerge');
const config = {};
config.default = require('./wdio.conf.js').config;

const ARCH = process.env.CLOUD_CONTAINER_ARCH === undefined
    ? 'x86_64' 
    : process.env.CLOUD_CONTAINER_ARCH;

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
        requestIntervalTime: 125
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
    logLevel: 'info',
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
