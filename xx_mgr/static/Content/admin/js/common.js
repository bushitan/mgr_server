/** common.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['layer'], function(exports) {
	"use strict";

	var $ = layui.jquery,
		layer = layui.layer;

	var common = {
		/**
		 * 抛出一个异常错误信息
		 * @param {String} msg
		 */
		throwError: function(msg) {
			throw new Error(msg);
			return;
		},
		/**
		 * 弹出一个错误提示
		 * @param {String} msg
		 */
		msgError: function(msg) {
			layer.msg(msg, {
				icon: 5
			});
			return;
		},
		renderUrl: function (url, params) {


		    if (url === "")
		    {
		        return "";
		    }

		    var index = 0;
		    if (params == null) params = new Object();
		     params.Token = encodeURIComponent(this.GetParam("Token"));
		    params.T = new Date().getTime();
		    // if (!params.MenuID) params.MenuID = $.AMS.GetParam("MenuID");
		    if (!url) url = "";
		    for (var param in params) {
		        url += (index == 0 && url.indexOf("?") == -1) ? "?" : "&";
		        url += param + "=" + params[param];
		    }
		    return url;

		},
		GetRequest: function () {
		    var url = location.search; //获取url中"?"符后的字串
		    var theRequest = new Object();
		    if (url.indexOf("?") != -1) {
		        var str = url.substr(1);
		       var  strs = str.split("&");
		        for (var i = 0; i < strs.length; i++) {
		            theRequest[strs[i].split("=")[0].toLowerCase()] = unescape(strs[i].split("=")[1]);
		        }
		    }
		    this.Params = theRequest;
		},
		GetParam: function (name) {
		    if (this.Params == null) {
		        this.GetRequest();
		    }
		    return this.Params == null ? "" : this.Params[name.toLowerCase()];
		},
		HTMLDecode: function (text) {
		    var temp = document.createElement("div");
		    temp.innerHTML = text;
		    var output = temp.innerText || temp.textContent;
		    temp = null;
		    return output;
		},
		HTMLEncode: function (html) {
		    var temp = document.createElement("div");
		    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
		    var output = temp.innerHTML;
		    temp = null;
		    return output;
		},
		PadLeft: function (str, lenght) {
		    if (String(str).length >= lenght)
		        return str;
		    else
		        return this.PadLeft("0" + str, lenght);
		},
		PadRight: function (str, lenght) {
		    if (String(str).length >= lenght)
		        return str;
		    else
		        return this.PadRight(str + "0", lenght);
		},
		ToJSON: function (data) {

		    return JSON.parse(this.HTMLDecode(data.replace(/\n/g, "\\n") || {}));
		},
		RenderParams: function (params) {
		    if (!params) params = new Object();
		    params.Token = this.GetParam("Token");
		    params.T = new Date().getTime();
		    params.MenuID = this.GetParam("MenuID");
		    return params;
		},


		getCheckedData: function (css) {
		    var data = [];
		    $(css + ":checked").each(function () {
		        //'<input type="checkbox" class="checkboxSelector" ref="' + data + '" />'
		        data.push($(this).data("value"));
		    });
		    return data;
		},

		GetImgsUrlList: function (elemname) {

		    var imgs_str = "";
		    var imgs_node = document.getElementsByName(elemname);

		    if (imgs_node)
		    {
		        for (var i = 0; i < imgs_node.length; i++) {

		            imgs_str += imgs_node[i].getAttribute("data-url") + ",";

		        }
		    }

		

		    return imgs_str;

		},

	    //自制多图上传模板;获取图片的地址组;用","隔开；

		GetImgsFaceidList: function (elemname) {

                var imgs_str = "";
                var imgs_node = document.getElementsByName("upload_img");

                for (var i = 0; i < imgs_node.length; i++) {

                    imgs_str += imgs_node[i].getAttribute("data-faceid") + ",";

                }

                return imgs_str;
            }




	};

    //MultipleUploadTemplates:function(){
    
    
    //}

	//var common = function () {

	//    this.v = '1.0.1';

	//};


	//common.prototype.renderUrl = function (url,params) {

	//    var index = 0;
	//    if (params == null) params = new Object();
	//  //  params.Token = encodeURIComponent($.AMS.GetParam("Token"));
	//    params.T = new Date().getTime();
	//   // if (!params.MenuID) params.MenuID = $.AMS.GetParam("MenuID");
	//    if (!url) url = "";
	//    for (var param in params) {
	//        url += (index == 0 && url.indexOf("?") == -1) ? "?" : "&";
	//        url += param + "=" + params[param];
	//    }
	//    return url;

	//};

    //var common = new 


	exports('common', common);
});