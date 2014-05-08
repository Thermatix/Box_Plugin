var storage = chrome.storage.local

var oauth = {
  "extAppId"      : "lq22uc0fc3egk14v8cama07b4jnov6bg",
  "extAppSecret"  : "AQPzrv8lmb1Kw2SlkStNZuWlyCjfihrX",
  "appID"         : chrome.runtime.id,
  "redirect"      : 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb',
  "access_token"  : '',
  "refresh_token" : ''
}
//-----------------------------------------------

function getBoxAuthURL () {
	var host = 'https://www.box.com/api/oauth2/authorize?'
	var responseType = 'response_type=code'
	var clientID = '&client_id='+ oauth.extAppId
	var redirect = '&redirect_uri=' + oauth.redirect
	return host + responseType + clientID + redirect
}

function deleteTokens () {
	var obj = {'boxTokens' : null}
	storage.set(obj)
}

function timeNow (addingH,addingM) {
	this.time = new Date()
	this.time.setHours(time.getHours() + (addingH || 0))
	this.time.setMinutes(time.getMinutes() + (addingM || 0))
	return this.time
}
  inMills = function (time) {
	var hour = 1000 * 60 
	return time.getTime() / hour
}

function timeCompareMilliseconds (against) {
	var minutes = 1000 * 60 
	var now = timeNow()
	var against = new Date(against)
	return Math.ceil((against.getTime() - now.getTime()) * minutes)
}

function tokensSet (callback) {
	storage.get('boxTokens',function (result) {
		var returning = result['boxTokens']
		if(returning == 'null'){
			callback(false)
		}else{
			callback(returning)
		}
	})
}


function Notifier() {}

// Returns "true" if this browser supports notifications.
Notifier.prototype.HasSupport = function() {
  if (window.webkitNotifications) {
    return true;
  } else {
    return false;
  }
}

// Request permission for this page to send notifications. If allowed,
// calls function "cb" with "true" as the first argument.
Notifier.prototype.RequestPermission = function(cb) {
  window.webkitNotifications.requestPermission(function() {
    if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
  });
}

// Popup a notification with icon, title, and body. Returns false if
// permission was not granted.
Notifier.prototype.Notify = function(icon, title, body) {
  if (window.webkitNotifications.checkPermission() == 0) {
    var popup = window.webkitNotifications.createNotification(
      icon, title, body);
    popup.show();
    return true;
  }

  return false;
}


Request = function (){}
Request.prototype.client = new XMLHttpRequest()
Request.prototype.constructor = function () {
}
	

Request.prototype.get = function (url,callback) {
	var client = this.client
	client.onreadystatechange = function() {
	   if(client.readyState == 4 && client.status == 200) {
	     callback(client.responseText)
	   }
	}
  client.open('GET',url)
}

Request.prototype.post = function (url,data,callback) {
	var client = this.client
		client.onreadystatechange = function() {
		   if(client.readyState == 4 && client.status == 200) {
		      callback(client.responseText)
		   }
	  }
		   client.open('POST',url)
		   client.setRequestHeader('content-Type', 'application/x-www-form-urlencoded')
		   client.send(data)
}