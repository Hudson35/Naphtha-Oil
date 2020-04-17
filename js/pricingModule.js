const tools = require('../js/tools.js');

module.exports = {
    getSuggestedPrice: function(location, month, quoteHISTORY, gallon) {
        // Below are the different factor variables
        const companyProfitFactor = 0.10;
		let gallonsRequestedFactor = 0.0;
        let rateFluctuationFactor = 0.0;
		let locationFactor = 0.0;
        let rateHistoryFactor = 0.0;
        let marginGap = 0.0;

        // Below is a check regarding the location factor
        if(tools.inState(location)) {
            locationFactor = 0.02;
        } else {
            locationFactor = 0.04;
        }
        if(tools.hasHistory(quoteHISTORY)) {
            rateHistoryFactor = 0.01;
        } else {
            rateHistoryFactor = 0.0;
        }
        if(gallon > 1000) {
            gallonsRequestedFactor = 0.02;
        } else {
            gallonsRequestedFactor = 0.03;
        }
        if(tools.inSummer(month)) {
            rateFluctuationFactor = 0.04;
        } else {
            rateFluctuationFactor = 0.03;
        }

        marginGap = 1.50 * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor + rateFluctuationFactor);
        
        return (1.50 + marginGap).toFixed(2);
    },
    getTotal: function(gallons, suggestedPrice) {
        return (gallons * suggestedPrice).toFixed(2);
    }
};