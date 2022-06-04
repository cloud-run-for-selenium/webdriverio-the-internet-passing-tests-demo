const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        expect(await SecurePage.flashAlert).toBeExisting();
        expect(await SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });
});


