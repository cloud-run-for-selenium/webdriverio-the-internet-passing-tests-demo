//const logger = require('#utils/logger');
const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');
const GalleryPage = require('../pageobjects/gallery.page');
const galleryPage = new GalleryPage();

xdescribe('Menu Button Tests', () => {
    before('should login with valid credentials and go to Gallery Page', async () => {
        await LoginPage.open();

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
        await galleryPage.open();
    });

    it('should verify image is present', async () => {
        await expect($('#content > div > img:nth-child(3)')).toBeExisting();
    });

});


