function Notifier() {} //was to be used for notifiing the user of things

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


Request = function (){} //a simple post/get client to make XMLHttp requests for ajax stuff (or getting the access_token)
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