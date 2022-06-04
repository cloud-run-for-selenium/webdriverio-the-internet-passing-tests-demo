const logger = require('#utils/logger');
const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');
const DynamicLoading2 = require('../pageobjects/dynamic.loading.2.page');


describe('Tests on waiting for an element to appear - 2', () => {

    beforeEach('should login with valid credentials', async () => {
        await LoginPage.open();
        logger.info('test test test');

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });

    it('should wait for the element to appear', async () => {
        await DynamicLoading2.open();

        await DynamicLoading2.startButton.waitForClickable();
        await DynamicLoading2.startButton.click();

        await $('#loading').waitForExist({ timeoutMsg: 'Loader did not appear' });
        await $('#loading').waitForDisplayed({ reverse: true, timeoutMsg: 'Loader did not disappear' });

        await DynamicLoading2.helloWorldElem.waitForDisplayed();

        const helloText = await (await DynamicLoading2.helloWorldElem.getText());
        expectChai(helloText).to.equal('Hello World!');
        //expect(DynamicLoading2.helloWorldElem).toBeDisplayed();

    })
});

