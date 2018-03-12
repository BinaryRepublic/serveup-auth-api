"use_strict";

class RequestValidator {
	validRequestData(data, necessaryData) {
		var valid = true;
		for(var i = 0; i < necessaryData.length; i++) {
			var item = necessaryData[i];
			if (!data.hasOwnProperty(item)) {
				valid = false;
				console.error("MISSING: " + item);
				break;
    		}
		}
		return valid
	};
};
module.exports = RequestValidator;