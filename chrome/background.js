
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

//Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function () {
	var contexts = ["link","image"]
	var title = "Save %s to your box account"
	var id = chrome.contextMenus.create({
		"title" : title, 
		"contexts" : contexts,
		 "id" : "boxupload" + contexts.join('_')
	})
})

// add click event

chrome.contextMenus.onClicked.addListener(onClickHandler)

//click callback

function onClickHandler(info, tab) {
	// var text = info.selectionText
	var image = info.srcUrl 
	var link = info.linkUrl
	// var notify = new Notifier()
  tokensSet(function (result){
   var tokens = result
   console.log(tokens)
   if(!tokens){
     alert('You need to be logged in to upload anything to your box account')
   }else{
     alert('File is Uploading!')
   }
  })
	// var notify.notify('images/x16', 'File upload progress', 'upload.html')
}
