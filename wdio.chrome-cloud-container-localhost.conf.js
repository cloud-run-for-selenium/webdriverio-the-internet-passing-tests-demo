// wdio.chrome-cloud-container-localhost.conf.js

/*
 This configuration runs locally, and headfully, meaning not headless.
 To simulate the Cloud Run environment, only one port is exposed on port 8080

 From the WebdriverIO docs:
 $ CLOUD_CONTAINER_ACCESS_TOKEN=abcde npx wdio wdio.chrome-cloud-container-localhost.conf.js

*/


const merge = require('deepmerge');
const config = {};
config.default = require('./wdio.conf.js').config;

// insert modified configuration inside
config.override = {
    debug: false,
    execArgv: [],
    port: 8080,
    protocol: 'http',
    hostname: 'localhost',
    headers: {
        'authorization': 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
    },
    strictSSL: false,
    services: [/* cloud-container service is inlined in the onPrepare hook but configured for http */],
    path: '/wd/hub',
    automationProtocol: 'webdriver',
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome'
        /*'goog:chromeOptions': {
            args: [
                '--headless',
                '--window-size=1280,800'   // required with headless option
            ]
        }*/
    }],
    logLevel: 'info',
    mochaOpts: {
        ui: 'bdd',
        timeout: 1200000    // larger value helps prevent the browser closing while debugging
    },
    onPrepare(config, capabilities) {
        const opts = {
            retryTimeout: 4000,
            maxAttempts: 5
        }
        const port = config.port ? `:${config.port}` : '';
        const https = require('http');
        const wdioLogger = require('@wdio/logger').default;
        const logger = wdioLogger('wdio-cloud-run-service');
        var attempts = 0;
        logger.warn('Warming up Cloud Run host at: ' + config.hostname + '...');
        return new Promise((resolve, reject) => {
            const healthCheckInterval = setInterval(() => {
                https.get(`${config.protocol}://${config.hostname}${port}${config.path}/status`, {
                    headers: {
                        'authorization': 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
                    }
                }, res => {
                    if (++attempts > opts.maxAttempts) {
                        logger.error('Problem launching Cloud Run service. Status: ' + res.statusCode);
                        clearInterval(healthCheckInterval);
                        reject(new Error('Cloud Run Service failed'));
                        return;
                    }
                    let data = [];
                    //logger.warn('Status Code:', res.statusCode);

                    res.on('data', chunk => {
                        data.push(chunk);
                    });

                    res.on('end', () => {
                        //logger.warn('Response ended: ');
                        if (res.statusCode >= 200 && res.statusCode < 400) {
                            clearInterval(healthCheckInterval);
                            resolve();
                        } else {
                            logger.warn('Waiting for Cloud Run service to launch... Status code: ' + res.statusCode);
                        }
                    });
                }).on('error', err => {
                    console.log('Error: ', err.message);
                    reject(err.message);
                });
            }, opts.retryTimeout);
        }).catch((err) => {
            logger.error('SEVERE: Cloud Run service failed to launch. Exiting...')
            process.exit(1)
        });
    }
};

// overwrite any arrays in default with arrays in override.
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

// have main config file as default but overwrite environment specific information
exports.config = merge(config.default, config.override, { arrayMerge: overwriteMerge, clone: false });
