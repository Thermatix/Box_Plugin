var storage = chrome.storage.local
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

function tokensSet (callback) {
	storage.get('boxTokens',function (result) {
		if(typeof result['boxTokens'].access_token == 'undefined'){
			callback(false)
		}else{
			callback(result['boxTokens'])
		}
	})
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