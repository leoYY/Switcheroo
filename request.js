var rules = [];

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	/*if(isActive && isJqueryMinified(details)){
	 return {redirectUrl: "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"};
	 }*/
	return redirectToMatchingRule(details);
}, {
	urls : ["<all_urls>"]
}, ["blocking"]);

function redirectToMatchingRule(details) {
	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		if (rule.isActive && details.url.indexOf(rule.from) > -1) {
			if (rule.type == 'Switch') {
				return {
					redirectUrl : rule.to
				};
			}
			else{
				return{
					redirectUrl : details.url.replace(rule.from, rule.to)
				};
			}
		}
	}
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if ( typeof request.rule !== 'undefined') {
		rules.push(request.rule);
		sendResponse({
			rules : this.rules
		});
	} else if ( typeof request.removeAllRules !== 'undefined') {
		rules = [];
		sendResponse({
			rules : this.rules
		});
	} else if ( typeof request.getRules !== 'undefined') {
		sendResponse({
			rules : this.rules
		});
	} else if ( typeof request.toggleIndex !== 'undefined') {
		rules[request.toggleIndex].isActive = !rules[request.toggleIndex].isActive;
		sendResponse({
			rules : this.rules
		});
	} else if ( typeof request.editIndex !== 'undefined') {
		rules[request.editIndex] = request.updatedRule;
		sendResponse({
			rules : this.rules
		});
	} else if ( typeof request.removeIndex !== 'undefined') {
		rules.splice(request.removeIndex, 1);
		sendResponse({
			rules : this.rules
		});
	}
});
