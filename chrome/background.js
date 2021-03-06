function authFlowStart  () { //start authentication flow for when a user clicks 'login to box' from popup menu
    chrome.identity.launchWebAuthFlow({
      url: getBoxAuthURL(),
      interactive: true
    }, function(redirectUri){
      handleCallbackFromBox(redirectUri,function (result) {
        var data = JSON.parse(result)

        var obj = {'boxTokens': {
          access_token : data.access_token,
          refresh_token : data.refresh_token,
          timeset : timeNow(null,59).toString()
        }}
        storage.set(obj)
        tokensSet(function (result){
          console.log(result)
        })
      })
    })
  }

function handleCallbackFromBox(redirectUri,callback) { // handles getting the auth_code from box after user has cliked 'authorise' on box login website and then makes request for access_token
  var code_match = /(?:&code=){1}(.*)$|\&/g
  var code = code_match.exec(redirectUri)[1]
  if(code == 'null'){
    callback(new Error('Invalid redirect URI, unable to get code'))
  }else{

    var data = 'grant_type=authorization_code' + '&code=' + code + '&client_id=' + oauth.extAppId + '&client_secret=' + oauth.extAppSecret
    var path = 'https://www.box.com/api/oauth2/token'

    req = new Request()
    req.post(path,data,callback)
  }
}


function setTokenRefreshTimer  (changes, areaName){ //sets refresh timer for token refresh
  console.log('fired')
  if(areaName == 'local'){
    if(changes['boxTokens'].newValue !== null){
      var tokens = changes['boxTokens'].newValue
      var tokenTime = tokens.timeset
      var refreshToken = tokens.refresh_token
      var timeTillRefresh =  timeCompareMilliseconds(timeNow(null,59))
      console.log((timeTillRefresh / 60) / 1000)
      setTimeout(function(){getNewToken(refreshToken)},timeTillRefresh)
      return false
   }
  }
}


chrome.runtime.onInstalled.addListener(function () { //Set up context menu at install time.
	var contexts = ["link","image"]
	var title = "Save %s to your box account"
	var id = chrome.contextMenus.create({
		"title" : title,
		"contexts" : contexts,
		 "id" : "boxupload" + contexts.join('_')
	})
})


function getNewToken (refreshToken) { // this is to get a new token
  var data = 'grant_type=refresh_token' + '&refresh_token=' + refreshToken + '&client_id=' + oauth.extAppId + '&client_secret=' + oauth.extAppSecret
  var path = 'https://www.box.com/api/oauth2/token'
  req = new Request()
  req.post(path,data,function(result){
    var data = JSON.parse(result)
    var obj = {'boxTokens': {
      access_token : data.access_token,
      refresh_token : data.refresh_token,
      timeset : timeNow(null,59).toString()
    }}
    storage.set(obj)
  })
}
// add click event

chrome.contextMenus.onClicked.addListener(onClickHandler) //adds context menu handler
chrome.storage.onChanged.addListener(setTokenRefreshTimer) // adds token refresh timer (broken)
chrome.runtime.onStartup.addListener(function(){ //adds listner to refresh token when chrome starts
  tokensSet(function (result){
    if (result !== false){
      getNewToken(result.refresh_token)
    }
  })
})

//click callback

function onClickHandler(info, tab) { // handler for when person selects save to box in context menu
	// var text = info.selectionText
	var image = info.srcUrl
	var link = info.linkUrl
	// var notify = new Notifier()
  tokensSet(function (result){
   var tokens = result
   if(!tokens){
     alert('You need to be logged in to upload anything to your box account')
   }else{
     alert('File is Uploading!')
   }
  })
	// var notify.notify('images/x16', 'File upload progress', 'upload.html')
}
