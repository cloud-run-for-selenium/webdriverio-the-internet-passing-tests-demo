//const logger = require('#utils/logger');



describe('Test inputs page', () => {

    var inputElem;

    beforeEach(async () => {
        await browser.url('/inputs');
        inputElem = await $('#content > div > div > div > input');
        await inputElem.click();
    })

    it('should show 34 when we enter 34', async () => {
        await browser.keys(['3', '4']);
        expect(await inputElem).toHaveValue('34');
    });

    it('should show 56 when we enter 5ty6', async () => {
        await browser.keys(['3', 't', 'y', '4']);
        expect(await inputElem).toHaveValue('34');
    });

    it('should allow decimals', async () => {
        await browser.keys(['3', '.', '4']);
        expect(await inputElem).toHaveValue('3.4');
    });

    it('should not allow any other special characters', async () => {
        await browser.keys(['~', '!', '@', '#', '$', '%', '^', '&', '-', '*', '*', '(', ')', '+', '=']);
        expect(await inputElem).toHaveValue('');
        logger.log(await inputElem.getValue())
    })
})