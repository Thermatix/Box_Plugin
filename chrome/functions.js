var storage = chrome.storage.local //reference to chromes local storage

var oauth = { //stores oauth infomation for th eclient
  "extAppId"      : "lq22uc0fc3egk14v8cama07b4jnov6bg",
  "extAppSecret"  : "AQPzrv8lmb1Kw2SlkStNZuWlyCjfihrX",
  "appID"         : chrome.runtime.id,
  "redirect"      : 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb',
  "access_token"  : '',
  "refresh_token" : ''
}
//-----------------------------------------------

function getBoxAuthURL () { //returns the url to send the user to for client authorisation for chrome.identity
	var host = 'https://www.box.com/api/oauth2/authorize?'
	var responseType = 'response_type=code'
	var clientID = '&client_id='+ oauth.extAppId
	var redirect = '&redirect_uri=' + oauth.redirect
	return host + responseType + clientID + redirect
}

function deleteTokens () { //delete tokens from chrome local storage
	var obj = {'boxTokens' : null}
	storage.set(obj)
}

function timeNow (addingH,addingM) { //gets the current time, addingH = add hours to current time, addingM = add minutes to current time
	this.time = new Date()
	this.time.setHours(time.getHours() + (addingH || 0))
	this.time.setMinutes(time.getMinutes() + (addingM || 0))
	return this.time
}
  inMills = function (time) {
	var hour = 1000 * 60
	return time.getTime() / hour
}

function timeCompareMilliseconds (against) { //compare time now against input in milliseconds
	var minutes = 1000 * 60
	var now = timeNow()
	var against = new Date(against)
	return Math.ceil((against.getTime() - now.getTime()) * minutes)
}

function tokensSet (callback) { //gets the token from chromes local storage
	storage.get('boxTokens',function (result) {
		var returning = result['boxTokens']
		if(returning == 'null'){
			callback(false)
		}else{
			callback(returning)
		}
	})
}


