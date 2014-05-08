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
function timeNow (addingH,addingM) {
	var d = new Date()
	var h = d.getHours() + (addingH || 0)
	var m = d.getMinutes() + (addingM || 0)
	if(m > 60){ 
		m = m - 60
		h = h + 1
	}
	if(h > 24){
		h = 0
	}
	return [h,m]
}

function timeCompareMilliseconds (against) {
	var minute = 1000 * 60 // in milliseconds
	var timenow = timeNow()
												// minutes     hours
	var timenowMil = minute * timenow[1] * timenow[0]
	var timeAgainstMil = minute * against[1] * against[0]
	return (timeAgainstMil - timenowMil)
}

function tokensSet (callback) {
	storage.get('boxTokens',function (result) {
		if(typeof result['boxTokens'].access_token == 'undefined'){
			callback(false)
		}else{
			callback(result['boxTokens'])
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