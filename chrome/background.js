
var oauth = {
  "extAppId"      : "lq22uc0fc3egk14v8cama07b4jnov6bg",
  "extAppSecret"  : "AQPzrv8lmb1Kw2SlkStNZuWlyCjfihrX",
  "appID"         : chrome.runtime.id,
  "redirect"      : 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb',
  "access_token"  : '',
  "refresh_token" : ''
}
var tokenTime = 0.0

chrome.storage.onChanged.addListener(function (changes, areaName){
  if(areaName == 'local'){
   if(typeof changes['boxTokens'] !== 'undefined'){
    tokenTime = changes['boxTokens'].timeset
    var d = 
    checkKeyTime
   }
  }
})
//listner for tokens

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

function checkKeyTime () {


}
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
