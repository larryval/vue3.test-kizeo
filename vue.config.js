const path = require('path');

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    @import "@/styles/_app-variables.scss";
                    @import "@/styles/_app-tools.scss";
                `
            }
        }
    }
};