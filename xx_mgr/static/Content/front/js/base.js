(function($){
	var lazyLoadSelector = "img[data-original]";	// 默认异步图片加载选择器
	/*
	* 初始化元素的异步图片加载。为方便起见，epage框架默认支持异步图片，如图片元素含有[data-original]属性时，自动配置成为默认的异步图片，
	* 	container : 要实现异步加载图片的容器，如果未指定，则整个文档的符合预定选择器的图片均初始为异步加载图片。
	* 	lazyLoadMedia : 异步图片所需的相头媒体文件。
	*/
	window.initLazyLoad = function(container, lazyLoadMedia)
	{
		if(!lazyLoadMedia)
			lazyLoadMedia = window.lazyLoadMedia;
		if(!lazyLoadMedia)
			return;
		
		var imgs;
		var imgs2;
		var imgs2sel = ".widgetSet " + lazyLoadSelector;	// 所有的部件集(widgetSet)默认忽略不可见元素
		if(container)
		{
			var inWidgetSet = container.closest(".widgetSet").length > 0;
			if(inWidgetSet)
				imgs2sel = lazyLoadSelector;		// 如果指定的容器在部件集中，则所有的图片都使用忽略不可见的异步加载形式
			imgs2 = container.find(imgs2sel);
			imgs = container.find(lazyLoadSelector).not(imgs2);
		}
		else
		{
			imgs2 = $(imgs2sel);
			imgs = $(lazyLoadSelector).not(imgs2);
		}
		if(imgs.length > 0 || imgs2.length > 0){
			ensureMedia(lazyLoadMedia, function(){
				imgs.lazyload({ failure_limit : 100, skip_invisible : false });	// 默认异步图片加载，当图片不可见时不忽略加载
				imgs2.lazyload({ failure_limit : 100 });	// 忽略不可见元素的异步图片加载
			});
		}
	}
	
	/*
	* 手动更新异步加载图片的更新操作。
	* 	imgs : 要调用更新操作的图片
	*/
	window.lazyLoadUpdate = function(imgs){
		$(window).resize();
	}
	
	
	
	
	/* 以下实现异步小部件代码 */
	window.preRenderWidget = function(data, callback){
		var content = null;
		if(data && data.content){
			content = data.content;
		}
		function parseContent(content){
			if(!content)
				return null;
			else
				return $(content);
		}
		
		if(data && data.media)
			ensureMedia(data.media, function(){ callback(parseContent(content)); });
		else
			callback(parseContent(content));
	}
	
	window.endRenderWidget = function(widget){
		if($.fn.widgetSet)
			widget.closest(".widgetSet").widgetSet("rebuildHeader", widget);
		initLazyLoad(widget);
	}
	
	var asyncWidgetSelector = ".async_widget";
	/*
	* 初始化异步小部件。
	* 	container : 要初始异步小部件所在的容器，如果未指定，则初始化整个文档的异步小部件。
	* 	url : 加载异步小部件的 url 模式，{widgetId}为需要替换的小部件标识。
	*/
	window.initAsyncWidgets = function(container, url){
		var widgets;
		if(container)
			widgets = container.find(asyncWidgetSelector);
		else
			widgets = $(asyncWidgetSelector);
		
		widgets.each(function(){
			initAsyncWidget(this, url);
		});
	}
	
	window.isAsyncWidget = function(widget){
		widget = $(widget);
		return widget.is(asyncWidgetSelector);
	}
	
	window.initAsyncWidget = function(widget, url, callback){
		widget = $(widget);
		if(isAsyncWidget(widget))
		{
			var widgetId = widget.attr("data-widgetId");
			var allowCache = !(widget.attr("data-allowCache") == 'false');
			var parms = allowCache ? {} : { r:new Date().getTime() };
			var u = getAsyncWidgetUrl(widgetId, url);
			$.getJSON(u, parms, function(data){
				replaceAsyncWidget(widget, data, function(widget){
					if(callback)
						callback(widget);
				});
			});
		}
	}
	
	window.getAsyncWidgetUrl = function(widgetId, urlPattern){
		if(!urlPattern)
			urlPattern = window.asyncWidgetRenderUrlPattern;
		urlPattern = unescape(urlPattern);
		return urlPattern.replace("{widgetId}", widgetId);
	}
	
	window.replaceAsyncWidget = function(widget, data, callback){
		if(data && data.content)
		{
			preRenderWidget(data, function(newWidget){
				widget.replaceWith(newWidget);
				endRenderWidget(newWidget);
				if(callback)
					callback(newWidget);
			});
		}
	}
	
	// 重新加载小部件
	window.reloadWidget = function(widget, widgetId, callback, url) {
		widget = $(widget);
		var parms = { r:new Date().getTime() };
		var u = getAsyncWidgetUrl(widgetId, url);
		$.getJSON(u, parms, function(data){
			replaceAsyncWidget(widget, data, function(widget){
				if(callback)
					callback(widget);
			});
		});
	}
	
	
	
	
	$(function(){ initLazyLoad(); });
	
	$(function(){
		if($.fn.widgetSet) {
			$(".widgetSet").each(function(){
				var obj = $(this);
				var tigger = obj.attr("data-triggerEvent");
				var options = undefined;
				if(tigger)
					options = { trigger: tigger };
				obj.widgetSet(options)
					.bind("widgetSet.active", function(e, tab, panel){
						if(panel)
							lazyLoadUpdate(panel.find(lazyLoadSelector));
					});	// 当部件集的选项卡切换时，更新切换的选项卡的异步加载图片状态
				
				var defaultItem = obj.attr("data-defaultItem");
				if(defaultItem)
					defaultItem = parseInt(defaultItem);
				if(defaultItem)
					obj.widgetSet("active", defaultItem);
			});
		}
	});
	
	$(function(){ initAsyncWidgets(); });
	
	
	
	
	// 简单 tab 面板插件
	$.fn.thinTab = function(options) {
		var settings = {
			header : null,
			body : null,
			trigger : "mouseenter",
			activated : 0
		};
		
		if (options) { 
			$.extend(settings, options);
		}
		
		return this.each(function(){
			var obj = $(this),
				header = settings.header ? obj.find(settings.header) : $(obj.children()[0]),
				body = settings.body ? obj.find(settings.body) : $(obj.children()[1]),
				tabs = header.children(),
				panels = body.children();
			function activeIndex(index) {
				for(var i = 0; i < panels.length; i++) {
					var activated = i == index;
					if(activated) {
						$(tabs[i]).addClass("current");
						$(panels[i]).addClass("current").css("display", "block");
						lazyLoadUpdate($(panels[i]).find(lazyLoadSelector));	// 当选项卡切换时，更新切换的选项卡的异步加载图片状态
					}
					else {
						$(tabs[i]).removeClass("current");
						$(panels[i]).removeClass("current").css("display", "none");
					}
				}
			}
			activeIndex(settings.activated);
			tabs.bind(settings.trigger, function(){
				activeIndex(tabs.index(this));
			});
		});
	}
	
	
	
	
	// 前台编辑工具栏
	$(function(){
		if(window.getWidgetContentManageUrl && window.parseWidgetUrl && $.cookie('is_staff'))
			initEditToolbar();
	});
	
	function initEditToolbar(){
		var editMedia = window.editMedia;
		
		var ctrEdit = $("<input type=\"button\" class=\"button editButton\" />");
		var editToolbar = $("<div class=\"editToolbar shadow\"></div>").append(ctrEdit);
		$(document.body).append(editToolbar);
		
		var editEnabled = false;
		function enableEdit(){
			if(editEnabled)
				return;
			
			ensureMedia(editMedia, function(){
				enableEditableWidget();
				
				$.cookie('enableEdit', '1', { path:'/' });
				ctrEdit.addClass("checked");
				editEnabled = true;
			});
		}
		function disableEdit(){
			if(!editEnabled)
				return;
			
			disableEditableWidget();
			
			$.removeCookie('enableEdit', { path:'/' });
			ctrEdit.removeClass("checked");
			editEnabled = false;
		}
		
		ctrEdit.click(function(){
			editEnabled ? disableEdit() : enableEdit();
		});
		
		if($.cookie('enableEdit'))
			enableEdit();
	}
	
	
	
	
	/* 以下各项适当时应考虑是否需要移到独立的文件中 */
	// 内容页搜索工具栏
	function initContentSearchBar(){
		$('.content_searchBar').each(function(){
			var searchBar = $(this);
			var searchFormBox = searchBar.find('.searchFormBox');
			var handle = searchBar.find('.handle');
			var handleText = handle.find('.handleText');
			var closedText = handleText.text();
			var expandedText = handle.attr('data-expandedText');
			if(!expandedText)
				expandedText = closedText;
			
			function setExpanded(expanded, animate){
				if(expanded)
				{
					animate ? searchFormBox.slideDown() : searchFormBox.show();
					handleText.text(expandedText);
					handle.addClass('expanded');
				}
				else
				{
					animate ? searchFormBox.slideUp() : searchFormBox.hide();
					handleText.text(closedText);
					handle.removeClass('expanded');
				}
			}
			
			handle.click(function(){
				setExpanded(searchFormBox.css('display') == 'none', true);
			});
			
			if(searchBar.attr('data-expanded') == 'true')	// 初始化状态
				setExpanded(true);
			
			// searchParams
			var li_params = searchBar.find('.searchParamList li');
			if(li_params.length > 0)
			{
				var queryParams = location.search;
				queryParams = queryParams.replace(/^\?*/, '');
				if(queryParams)
					queryParams = queryParams.split('&');
				else
					queryParams = [];
				
				li_params.each(function(){
					var li_param = $(this);
					var link = li_param.attr('data-link');
					var param = li_param.attr('data-param');
					var liQueryParams = [];
					for(var i = 0; i < queryParams.length; i++)
					{
						var queryParam = queryParams[i];
						var needAdd = true;
						if(param && queryParam.substr(0, param.length + 1) == param + '=')
							needAdd = false;
						if(needAdd)
							liQueryParams.push(queryParam);
					}
					
					var url = '?';
					if(liQueryParams.length > 0)
						url += liQueryParams.join('&');
					if(link)
						url = link + url;
					li_param.click((function(url){
						return function(){ location.href = url; };
					})(url));
				});
			}
		});
	}
	
	$(function(){
		initContentSearchBar();
	});
	
	// 初始加载通知
	$(function(){
		window.loadNotify();
	});
	
	// 单点登录
	$(function(){
		var url = window.sourceHost;
		if(url) {
			url = "http://" + url + window.getNotifyUrl;
			url = url + (url.indexOf("?") == -1 ? "?" : "&") + "callback=?";	// jsonp
			window.loadNotify(url);
		}
	});
	
	// 自动单点登录认证
	window.AsyncSSOAuth = Object();
	window.AsyncSSOAuth.bind_changed = function(fun){
		$(window).bind("sso_auth_changed", fun);
	}
	window.AsyncSSOAuth.auth = function(auth_url){
		var url = auth_url;
		if(!url)
			url = window.ssoAuthUrl;
		if(url) {
			url = url + (url.indexOf("?") == -1 ? "?" : "&") + "callback=?";	// jsonp
			$.getJSON(url, function(data){
				if(data && data.action){
					window.loadNotify();
					$(window).trigger("sso_auth_changed");
				}
			});
		}
	}
	
	$(function(){
		window.AsyncSSOAuth.auth();
	});
})(jQuery);