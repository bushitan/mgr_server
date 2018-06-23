// 获取URL中指定的参数值
function getQueryStringRegExp(name)
{
    var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " ")); return "";
}

// 指定的值是否在数组中 -1 代表不存在，否则返回所在的索引值，identity代表是否需要恒等比较，默认使用 == 比较
function inArray(val, arr, identity) {
	if(!arr)
		return -1;
	for(var i = 0; i < arr.length; i++) {
		if(identity ? arr[i] === val : arr[i] == val)
			return i;
	}
	return -1;
}

// 消息通知
function getNotifyType(type) {
	if($.inArray(type, ["info", "success", "error"]) != -1)
		return type;
	return "notice";
}

window.notify = function(msgs, timeout, opts){
	if(!msgs)
		return;
	if(!$.isArray(msgs))
		msgs = [msgs];
	if(msgs.length <= 0)
		return;
	
	function showNotify(msgs, timeout, opts){
		$.pnotify.defaults.styling = "jqueryui";
		
		for(var i = 0; i < msgs.length; i++)
		{
			var msg = msgs[i];
			if(typeof(msg) == 'string')
				msg = { text: msg };
			msg.type = getNotifyType(msg.type);
			
			var o = {
				animation: "show"
			};
			if(opts)
				o = $.extend(o, opts);
			if(timeout)
				o.delay = timeout;
			o = $.extend(o, msg);
			$.pnotify(o);
		}
	}
	
	if($.pnotify) {
		showNotify(msgs, timeout, opts);
	} else {
		var noty_media = window.notifyMedia;
		if(!noty_media)
			return;
		ensureMedia(noty_media, function(){
			showNotify(msgs, timeout, opts);
		});
	}
};
window.notify.INFO = "info";
window.notify.SUCCESS = "success";
window.notify.ERROR = "error";
window.notify.NOTICE = "notice";

window.loadNotify = function(url) {
	if(!url)
		url = window.getNotifyUrl;
	
	if(url) {
		url = url + (url.indexOf("?") == -1 ? "?" : "&") + "t=" + Math.random();	// 避免缓存
		$.getJSON(url, function(msg){
			if(msg && msg.length > 0)
				window.notify(msg);
		});
	}
};

(function(){
	$.loading = function(title, promptText){
		if(!promptText)
			promptText = "Processing, please wait ...";
		
		var obj = $("<div class=\"loadingBox\"><div class=\"loading\"></div><span>" + promptText + "</span></div>");
		obj.dialog({
			dialogClass: "no-close",
			draggable: false,
			resizable: false,
			title: title,
			modal: true,
			minHeight: 100
		});
		return obj;
	};
})(jQuery);