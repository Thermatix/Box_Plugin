
var background = chrome.extension.getBackgroundPage()
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


function boxLogin () {
	var loginArea = document.getElementById("login")
	loginArea.innerHTML = html.processing
	background.authFlowStart()
	
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
		console.log(tokens)
		var loginArea = document.getElementById("login")
		if(!tokens){
			loginArea.innerHTML = html.login
			addListener()
		}else{
			if(new Date(tokens.timeset) < timeNow() ) {
				loginArea.innerHTML = html.login
				addListener()
			}else{
				loginArea.innerHTML = html.loggedIn
			}
		}
	},100)
}
