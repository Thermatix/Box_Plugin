var storage = chrome.storage.local
var oauth = {
  "extAppId"      : "lq22uc0fc3egk14v8cama07b4jnov6bg",
  "extAppSecret"  : "AQPzrv8lmb1Kw2SlkStNZuWlyCjfihrX",
  "appID"         : chrome.runtime.id,
  "redirect"      : 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb',
  "access_token"  : '',
  "refresh_token" : ''
}

var html = {
	login : '<h2 id="title" class="title">Please Login</h2>' +
		'<p id="text" class="infomation">' +
			"You need to log into box before you can use this extention." +
		"</p>" +
		'<button id="login_button" type="button" >Login into box</button>'
	,
	processing : '<section class="text"><h3 id="status"class="infomation">Logging in</h3></section>' + 
			'<section class="images" ><img id="image" class="processing" src="/images/processing.gif"></img></section>',
	loggedIn : '<section class="text"> <p class="infomation"> You are logged in!</p></section>'

}


function handleCallbackFromBox(redirectUri,callback) {
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

function getBoxAuthURL () {
	var host = 'https://www.box.com/api/oauth2/authorize?'
	var responseType = 'response_type=code'
	var clientID = '&client_id='+ oauth.extAppId
	var redirect = '&redirect_uri=' + oauth.redirect
	return host + responseType + clientID + redirect
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

function deleteTokens () {
	var obj = {'boxTokens' : null}
	storage.set(obj)
}
function boxLogin () {
	var loginArea = document.getElementById("login")
	loginArea.innerHTML = html.processing
	chrome.identity.launchWebAuthFlow({
		url: getBoxAuthURL(),
		interactive: true
	}, function(redirectUri) {
		var status = document.getElementById("status")
		status.innerHTML = "processing"
		handleCallbackFromBox(redirectUri,function (result) {
			var data = JSON.parse(result)
			
			var obj = {'boxTokens': {
				access_token : data.access_token,
				refresh_token : data.refresh_token,
				timeset : timeNow(null,59)
			}}
			var image = document.getElementById("image")
			var status = document.getElementById("status")
			image.style.display = 'none'
			status.innerHTML = "done"
			storage.set(obj)
		})
	})
}

function addListener () {
	var login_button = document.getElementById("login_button")
	login_button.addEventListener("click",boxLogin)

}

window.onload = function() {
	var tokens = {}
	tokensSet(function (result){
		tokens = result
	})
	
	setTimeout(function () {
		var loginArea = document.getElementById("login")
		if(!tokens){
			console.log('need to login')
			loginArea.innerHTML = html.login
			addListener()
		}else{
			if(Number(timeNow().join('.')) > Number(tokens.timeset.join('.')) ){
				loginArea.innerHTML = html.login
				addListener()
			}else{
				loginArea.innerHTML = html.loggedIn
			}
		}
	},100)
}
