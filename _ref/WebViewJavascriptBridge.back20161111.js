//NOTES: the comments will be removed when eval()
//and this file share with iOS/Android JSB
//and this function is called by the "app" to inject a WebViewJavascriptBridge
(function(win,doc,PROTOCOL_SCHEME){
	if (win.WebViewJavascriptBridge) {
		return;
	}
	//o2s/s2o
	//function o2s(o){
	//	if(null==o)return "null";
	//	var f=arguments.callee;
	//	var t=typeof o;
	//	if('object'==t){if(Array==o.constructor)t='array';else if(RegExp==o.constructor)t='regexp';}
	//	switch(t){
	//		case 'undefined':case 'unknown':return;
	//		case 'function':return !('prototype' in o)?"function(){}":(""+o);break;
	//		case 'boolean':case 'regexp':return o.toString(); break;
	//		case 'number':return isFinite(o)?o.toString():'null';break;
	//		case 'string':return '"'+o.replace(/(\\|\")/g,"\\$1").replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"';break;
	//		case 'object':
	//		case 'array':
	//			if(o.length===0) return '[]';
	//			var r=[];
	//			if(o.length>0){
	//				for(var i=0;i<o.length;i++){var v=f(o[i]);if (v!==undefined)r.push(v);};return '['+r.join(',')+']';
	//			}
	//			var r=[];try{for(var p in o){v=f(o[p]);if(v!==undefined)r.push('"'+p+'":'+v);}}catch(e){};
	//			return '{'+r.join(',')+'}';break;
	//	}
	//};
	//o2s/s2o//20161109
	function o2s(o,l){
		if(null==o)return "null";
		var f=arguments.callee;
		var t=typeof o;
		if (!l>0) l=10;
		if (l<=0) return;
		if('object'==t){ if(RegExp==o.constructor)t='regexp'; }
		switch(t){
			case 'undefined':case 'unknown':return;
			//case 'function':return !('prototype' in o)?"function(){}":(""+o);break;
			case 'object':
			case 'array':
				var r=[];
				if(o.constructor==Array && o.length>=0){
					for(var i=0;i<o.length;i++){var v=f(o[i],l-1);if(v!==undefined)r.push(v);};return '['+r.join(',')+']';
				}
				try{for(var p in o){v=f(o[p],l-1);if(v!==undefined)r.push('"'+p+'":'+v);}}catch(ex){return ""+ex;};
				return '{'+r.join(',')+'}';
				break;
			case 'boolean':case 'regexp':return o.toString(); break;
			case 'number':return isFinite(o)?o.toString():'null';break;
			default:
				var s= o.toString?o.toString():(""+o);
				return '"'+s.replace(/(\\|\")/g,"\\$1").replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"';break;
		}
	};
	function s2o(s){ try{ return (new Function('return '+s))(); }catch(ex){} };

	var msgIfrm;
	var send_Q = [];
	var msgHandlerSet = {};

	var responseCallbacks = {};
	var msgId = 1;

	//NOTES: can't remove yet, old bridge codes might use it... will remove in further future...
	function init() {
		console.log('deprecated WebViewJavascriptBridge.init() is called.');
	}

	function _js2app(msg, cb){
		if (cb) {
			msgId=(msgId + 1) % 1000000;
			var callTime=new Date().getTime();
			var callbackId = 'cb_' + msgId + '_' + callTime;
			responseCallbacks[callbackId] = cb;
			msg.callbackId = callbackId;

			//TODO clean up by own gc
			msg.time=callTime;
		}
        //alert(typeof nativejsb);
		if("undefined"!=typeof nativejsb){
			//try new way
			nativejsb.js2app(msg.callbackId,msg.handlerName,o2s(msg.data));
		}else{
			//prev ok way
			send_Q.push(msg);

			//notify app a msg is Q-ed
			msgIfrm.src = PROTOCOL_SCHEME + '://__QUEUE_MESSAGE__/';
			//the __QUEUE_MESSAGE__ is just a what-ever word, @ref to shouldOverrideUrlLoading
		}
	}

	function _fetchQueue(directreturn) {
		var messageQueueString = o2s(send_Q);
		send_Q = [];

		if(directreturn){
			return messageQueueString;
		}else{
			//for android...
			//TODO to improve the mechanism, try using hacking prompt() as phonegap/cordova
			msgIfrm.src = PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
		}
	}

	function _app2js(msg) {
		//console.log("msg.responseId="+msg.responseId);
		setTimeout(function(){
			var callback=null;
			//java call finished, now need to call js callback function
			if (msg.responseId) {
				callback = responseCallbacks[msg.responseId];
		        //console.log("callback="+o2s(callback));
				if (!callback) {
					return;
				}
				callback(msg.responseData);
				delete responseCallbacks[msg.responseId];
			} else {
				var handler = null;
				if (msg.handlerName) {
					//find the handler
					handler = msgHandlerSet[msg.handlerName];
					if(handler==null){
						console.log("WebViewJavascriptBridge: not found handler name="+msg.handlerName);
					}
				}
				try {
					if(handler!=null){
						if (msg.callbackId) {
							var callbackResponseId = msg.callbackId;
							callback = function(responseData) {
								_js2app({
									responseId: callbackResponseId,
									responseData: responseData
								});
							};
						}
						handler(msg.data, callback);
					}
				} catch (exception) {
					console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
				}
			}
		},1);
	}

	function registerHandler(handlerName, handler) {
		msgHandlerSet[handlerName] = handler;
	}

	function callHandler(handlerName, data, cb) {
		_js2app({
			handlerName: handlerName,
			data: data
		}, cb);
	}

	win.WebViewJavascriptBridge = {
		_fetchQueue: _fetchQueue,
		_js2app: _js2app,

		//for app call js:
		_app2js: _app2js,

		init: init,

		registerHandler: registerHandler,
		callHandler: callHandler
	};
	//init msg iframe:
	msgIfrm = doc.createElement('iframe');
	msgIfrm.style.display = 'none';
	doc.documentElement.appendChild(msgIfrm);

})(window,document,'jsb1');
