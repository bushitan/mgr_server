window.ensureCss = function(css){
	if(!css)
		return;
	if(!$.isArray(css))
		css = [css];
	var head = document.getElementsByTagName("head")[0] || document.documentElement;
	$.each(css, function(i, c){
		var tag = $("link[href='" + c + "']");
		if(tag.length <= 0)
		{
			var link = document.createElement('link');
			link.setAttribute("href", c);
			link.setAttribute("rel", "Stylesheet");
			link.setAttribute("type", "text/css");
			head.appendChild(link);
		}
	});
};

/*
* 确保批定的媒体文件的加载，并在加载完成后执行指定的回调。
* 	media : 要加载的媒体
* 	callback : 加载完成后执行的回调函数
*/
window.ensureMedia = function(media, callback)
{
	if(!media)
		return;
	
	if(media._css && (media._css.all || media._css.screen))
	{
		if(media._css.all)
			ensureCss(media._css.all);
		if(media._css.screen)
			ensureCss(media._css.screen);
	}
	
	if(media._js)
	{
		var jsList = [];
		for(var i = 0; i < media._js.length; i++)
		{
			// 排除已经通过 <script> 标签加载过的脚本文件，避免造成再次加载相同脚本造成不可预知的问题。
			// 通过观查 LABjs 加载的脚本在head中生成的是全路径的脚本引用，也许正是因为这个原因，不能够与
			// 默认 <script> 方式加载的脚本进行匹配，造成相同的脚本多次加载，但通过 $LAB 多次加载相同的
			// 脚本时，最终浏览器只加载一次，目前没发现更好的办法，加载前手动过滤页面上通过 <script> 标签
			// 正常加载的脚本。
			var jsItem = media._js[i];
			if($("script[src='" + jsItem + "']").length <= 0)
				jsList[jsList.length] = jsItem;
		}
		if(jsList.length > 0)
			$LAB.setOptions({AlwaysPreserveOrder:true}).script(jsList).wait(callback);
		else
			callback();
	}
	else
		callback();
};