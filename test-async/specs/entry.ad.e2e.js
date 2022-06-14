//const logger = require('#utils/logger');

const expectChai = require('chai').expect;


describe('Entry Ad Tests', () => {

    beforeEach(async () => {
        logger.log('loading the home page');
        await browser.url('/');
        await $('h1.heading').waitForDisplayed();
    })

    xit('should display the popup on the first pageload', async () => {
        await browser.url('/');
        logger.debug('resetting the ad state to be able to trigger it on the next page load.')
        await browser.execute(() => {
            $.post('/entry-ad');
        });

        await browser.url('/entry_ad');

        expect(await $('#modal')).toBeDisplayed();
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
        expect(await $('#modal')).toExist();

        //expectChai(await $('#modal').isDisplayed()).to.be.false;
        await expect($('#modal')).not.toBeDisplayed();
        logger.info('Test 2 ends...');
    })

});
