(function($){
	var dataKey = 'widgetSet';
	
	var methods = {
		init : function(options){
			var settings = {
				trigger: "mouseenter"
			};
			
			if (options) { 
				$.extend(settings, options);
			}
			
			return this.each(function(i){
				var obj = $(this),
					data = obj.data(dataKey);
				if(!data){
					data = { trigger : settings.trigger };
					
					var els = methods._ensureElements(obj);
					var header = els[0];
					var body = els[1];
					var fn = function(){
						var index = header.children().index(this);
						methods._active(obj, index);
					};
					
					header.children().bind(settings.trigger, fn);
					
					data.fn = fn;
					obj.data(dataKey, data);
					
					methods._active(obj, 0);
				}
			});
		},
		
		_ensureElements : function(obj){
			var header = obj.children(".setHeader");
			if(header.length <= 0)
			{
				header = $("<ul class=\"setHeader\"></ul>");
				obj.append(header);
			}
			var body = obj.children(".setBody");
			if(body.length <= 0)
			{
				body = $("<div class=\"setBody\"></div>");
				obj.append(body);
			}
			return [header, body];
		},
		
		_buildItemHeaderByItem : function(item){
			var text = item.attr("data-title");
			var href = item.attr("href");
			var target = item.attr("target");
			if(!text || !href || !target)
			{
				var header = item.children(".wHeader");
				if(!text)
				{
					var caption = header.children(".caption");
					text = caption.text();
					
					if(!text)
						text = header.text();
				}
				if(!href)
				{
					var more = header.children(".more");
					href = more.attr("href");
				}
				if(!target)
				{
					var more = header.children(".more");
					target = more.attr("target");
				}
			}
			
			if(!text)
				text = "未命名部件";
			var inner = text;
			if(href)
			{
				inner = $("<a></a>").attr("href", href).append(inner);
				if(target)
					inner.attr("target", target);
			}
			return $("<li></li>").append(inner);
		},
		
		index : function(item) {
			if(this.length < 0)
				return -1;
			var obj = $(this[0])
				data = obj.data(dataKey);
			
			if(!data)
				return -1;
			
			var els = methods._ensureElements(obj);
			var header = els[0];
			var body = els[1];
			return body.children().index(item);
		},
		
		_active : function(obj, index) {
			var els = methods._ensureElements(obj);
			var header = els[0];
			var body = els[1];
			var lis = header.children();
			var items = body.children();
			if(index < 0 || index >= lis.length || index >= items.length)
				return;
			
			for(var i = 0; i < lis.length; i++)
			{
				var li = $(lis[i]);
				var item = undefined;
				if(items.length > i)
					item = $(items[i]);
				
				if(li.hasClass("current"))
				{
					if(i != index)
						li.removeClass("current");
				}
				else
				{
					if(i == index)
						li.addClass("current");
				}
				
				if(item)
				{
					if(item.hasClass("current"))
					{
						if(i != index)
							item.removeClass("current");
					}
					else
					{
						if(i == index)
							item.addClass("current");
					}
				}
				
				if(i == index)
					obj.trigger('widgetSet.active', [li, item, index]);
			}
		},
		
		active : function(item){
			return this.each(function(){
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				var index = typeof item === "number" ? item : body.children().index(item);
				methods._active(obj, index);
			});
		},
		
		getActiveIndex : function(){
			if(this.length < 0)
				return -1;
			var obj = $(this[0])
				data = obj.data(dataKey);
			
			if(!data)
				return -1;
			
			var els = methods._ensureElements(obj);
			var header = els[0];
			var body = els[1];
			
			return header.children().index(header.children(".current"));
		},
		
		_insertElement : function(con, e, index){
			if(typeof index !== 'number')
			{
				con.append(e);
				return;
			}
			
			if(index == 0)
			{
				con.prepend(e);
				return;
			}
			
			var children = con.children();
			if(index > 0 && index < children.length)
				children[index - 1].after(e);
			else
				con.append(e);
		},
		
		add : function(item, itemHeader, index, notActive){
			return this.each(function(){
				if(!item)
					return;
				
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				var iHeader = itemHeader ? itemHeader : methods._buildItemHeaderByItem(item);
				methods._insertElement(header, iHeader, index);
				methods._insertElement(body, item, index);
				
				iHeader.bind(data.trigger, data.fn);
				if(!notActive)
					methods.active.call(obj, item);
			});
		},
		
		rebuildHeader : function(item){
			return this.each(function(){
				if(typeof item !== 'number' && !item)
					return;
				
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				var index = undefined;
				var children = body.children();
				if(typeof item === 'number')
				{
					index = item;
					if(index < 0 || index >= children.length)
						return;
					item = $(children[index]);
				}
				else
				{
					index = children.index(item);
					if(index == -1)
						return;
				}
				
				var hChildren = header.children();
				if(index < 0 || index >= hChildren.length)
					return;
				var siHeader = $(hChildren[index]);
				var sIndex = methods.getActiveIndex.call(obj);
				
				var iHeader = methods._buildItemHeaderByItem(item);
				siHeader.replaceWith(iHeader);
				iHeader.bind(data.trigger, data.fn);
				if(sIndex == index)
					methods.active.call(obj, item);
			});
		},
		
		unbind : function(iHeader){
			return this.each(function(){
				if(!iHeader)
					return;
				
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				iHeader.unbind(data.trigger, data.fn);
			});
		},
		
		setTrigger : function(event) {
			if(!event)
				event = "mouseenter";
			
			return this.each(function(){
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				header.children().unbind(data.trigger, data.fn);
				data.trigger = event;
				header.children().bind(data.trigger, data.fn);
			});
		},
		
		removeTabHeader : function(item){
			return this.each(function(){
				if(typeof item !== 'number' && !item)
					return;
				
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				var index = typeof item === "number" ? item : body.children().index(item);
				if(index > -1 && index < header.children().length)
					$(header.children()[index]).remove();
			});
		},
		
		remove : function(item){
			return this.each(function(){
				if(typeof item !== 'number' && !item)
					return;
				
				var obj = $(this)
					data = obj.data(dataKey);
				if(!data)
					return;
				
				var els = methods._ensureElements(obj);
				var header = els[0];
				var body = els[1];
				
				var index = typeof item === "number" ? item : body.children().index(item);
				if(index > -1 && index < body.children().length && index < header.children().length)
				{
					$(header.children()[index]).remove();
					$(body.children()[index]).remove();
					methods._active(obj, 0);
				}
			});
		},
		
		getCount : function() {
			if(this.length < 0)
				return -1;
			var obj = $(this[0])
				data = obj.data(dataKey);
			
			if(!data)
				return -1;
			
			var els = methods._ensureElements(obj);
			var header = els[0];
			var body = els[1];
			return body.children().length;
		},
		
		destroy : function(){
			return this.each(function(){
				var obj = $(this),
					data = obj.data(dataKey);
				if(data){
					var header = obj.children(".setHeader");
					header.children().unbind(data.trigger, data.fn);
				}
			});
		}
	};
	
	$.fn.widgetSet = function(method) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.widgetSet' );
		}
	};
})(jQuery);