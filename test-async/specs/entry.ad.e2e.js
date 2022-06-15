//const logger = require('#utils/logger');

const expectChai = require('chai').expect;


describe('Entry Ad Tests', () => {

    beforeEach(async () => {
        logger.log('loading the home page');
        await browser.url('/');
        await $('h1.heading').waitForDisplayed();
    })

    it('should display the popup on the first pageload', async () => {
        await browser.url('/');
        logger.debug('resetting the ad state to be able to trigger it on the next page load.')
        await browser.execute(async (baseUrl) => {
            //$.post('/entry_ad');
            await fetch(`${baseUrl}/entry_ad`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://the-internet.herokuapp.com/entry_ad",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }, browser.config.baseUrl);

        await browser.url('/entry_ad');

        await expect($('#modal')).toBeDisplayed();
        logger.info('Test 1 completed.')
    });

    it('should not display the popup on subsequent pageloads', async () => {
        logger.info('Test 2 begins...');
        await browser.url('/entry_ad');

        // wait for the page to load. we don't care if the modal is there or not the first time.
        await browser.waitUntil(async () => {
            var isExampleDisplayed = await $('.example').isDisplayed();
            var isModalDisplayed = await $('#modal').isDisplayed();
            logger.log('isModalDisplayed = ' + isModalDisplayed);
            logger.log('isExampleDisplayed = ' + isExampleDisplayed);
            return isExampleDisplayed || isModalDisplayed;
        });

        await browser.url('/entry_ad');
        await expect($('#modal')).toExist();

        //expectChai(await $('#modal').isDisplayed()).to.be.false;
        await expect($('#modal')).not.toBeDisplayed();
        logger.info('Test 2 ends...');
    })

});
