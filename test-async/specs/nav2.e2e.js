//const logger = require('#utils/logger');
const loginPage = require("../pageobjects/login.page");
const securePage = require("../pageobjects/secure.page");


describe('Navigation tests', () => {

    it('should login, land on secure page, then go to floating_menus pages', async () => {
        await loginPage.open();
        await loginPage.login('tomsmith', 'SuperSecretPassword!');
        await securePage.flashAlert.waitForDisplayed();

        await browser.url('/');
        const jQueryUILink = await $('a[href="/jqueryui/menu"]');
        await jQueryUILink.waitForClickable();
        await jQueryUILink.click();

        await browser.url('/floating_menu');
        await $('#menu > ul > li:nth-child(1) > a').click();
        await expect(browser).toHaveUrlContaining('/floating_menu#home');
        await $('#menu > ul > li:nth-child(2) > a').click();
        await expect(browser).toHaveUrlContaining('/floating_menu#news');
        await $('#menu > ul > li:nth-child(3) > a').click();
        await expect(browser).toHaveUrlContaining('/floating_menu#contact');
        await $('#menu > ul > li:nth-child(4) > a').click();
        await expect(browser).toHaveUrlContaining('/floating_menu#about');
    });
})