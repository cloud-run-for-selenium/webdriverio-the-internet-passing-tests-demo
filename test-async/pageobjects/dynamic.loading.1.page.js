//const logger = require('#utils/logger');
const DynamicLoading = require('./dynamic.loading.pages');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DynamicLoading1 extends DynamicLoading {
    /**
     * overwrite specifc options to adapt it to page object
     */
    async open() {
        return await super.open('dynamic_loading/1');
    }
}

module.exports = new DynamicLoading1();