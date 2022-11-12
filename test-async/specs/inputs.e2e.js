const logger = require('#utils/logger');



describe('Test inputs page', () => {

    var inputElem;

    beforeEach(async () => {
        await browser.url('/inputs');
        inputElem = await $('#content > div > div > div > input');
        await inputElem.click();
    })

    it('should show 34 when we enter 34', async () => {
        await browser.keys(['3', '4']);
        await expect(inputElem).toHaveValue('34');
    });

    it('should show 56 when we enter 5ty6', async () => {
        await browser.keys(['5', 't', 'y', '6']);
        logger.warn('In Firefox, as well as in WebKit browsers, such as Apple Safari, or the Linux WebkitGTK browsers, MiniBrowser/Epiphany, this functionality of entering 5ty6 returns empty string whereas in Chromium-based browsers (Google Chrome, Microsoft Edge, Chromium, etc) we expect "56"!');
        const browserType = new BrowserType();
        if (browserType.isWebKit() || browserType.isFirefox())
            await expect(inputElem).toHaveValue('');
        else
            await expect(inputElem).toHaveValue('56');
    });

    it('should allow decimals', async () => {
        await browser.keys(['3', '.', '4']);
        await expect(inputElem).toHaveValue('3.4');
    });

    it('should not allow any other special characters', async () => {
        await browser.keys(['~', '!', '@', '#', '$', '%', '^', '&', '-', '*', '*', '(', ')', '+', '=']);
        await expect(inputElem).toHaveValue('');
        logger.log(await inputElem.getValue())
    });

    class BrowserType {
        isWebKit() {
            return browser.options.capabilities.browserName.toLowerCase().match('safari|minibrowser|epiphany') !== null;
        }
        isFirefox() {
            return browser.options.capabilities.browserName.toLowerCase().match('firefox') !== null;
        }
    }
})
