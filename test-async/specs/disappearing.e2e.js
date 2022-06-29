const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');
const DisappearingPage = require('../pageobjects/disappearing.page');


describe('Menu Button Tests', () => {
    beforeEach('should login with valid credentials', async () => {
        await LoginPage.open();
        logger.info('test test test');

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });

    it('should count 4 buttons', async () => {
        await DisappearingPage.open();
        await expect(await DisappearingPage.homeElem).toBeExisting();
        await expect(await DisappearingPage.aboutElem).toBeExisting();
        await expect(await DisappearingPage.contactUsElem).toBeExisting();
        await expect(await DisappearingPage.portfolioElem).toBeExisting();
    });

    xit('should count 5 buttons', async () => {
        await DisappearingPage.open();
        await expect(await DisappearingPage.homeElem).toBeExisting();
        await expect(await DisappearingPage.aboutElem).toBeExisting();
        await expect(await DisappearingPage.contactUsElem).toBeExisting();
        await expect(await DisappearingPage.portfolioElem).toBeExisting();

        // test may pass or fail -- element sometimes doesn't appear
        await expect(await DisappearingPage.galleryElem).toBeExisting();
    });
});


