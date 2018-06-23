layui.config({
    base: "/Content/admin/js/"
}).use(['form', 'vue', 'ztree', 'layer', 'jquery', 'table', 'droptree', 'openauth', 'utils', 'common'], function () {
    var form = layui.form,
        layer = layui.layer,
        common = layui.common,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    layui.droptree("/UserSession/QueryNavList", "#ParentName", "#ParentID", false);//BelongToID

    $("#menus").loadMenus("migratenav");

    //主列表加载，可反复调用进行刷新
    var config = {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/administrator/Menu/Load',
            where: config
        });
    }

    //菜单列表
    var menucon = {};  //table的参数，如搜索key，点击tree的id
    var menuList = function (options) {
        if (options != undefined) {
            $.extend(menucon, options);
        }
        table.reload('menuList', {
            url: '/administrator/Menu/Load',
            where: menucon
        });
    }

    //左边树状机构列表
    var ztree = function () {
        var url = '/administrator/UserSession/QueryNavList';
        var zTreeObj;
        var setting = {
            view: { selectedMulti: false },
            data: {
                key: {
                    name: 'Title',
                    title: 'Title'
                },
                simpleData: {
                    enable: true,
                    idKey: 'Id',
                    pIdKey: 'ParentId',
                    rootPId: 'null'
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    mainList({ pId: treeNode.Id });
                }
            }
        };
        var load = function () {
            $.getJSON(url, function (json) {
                zTreeObj = $.fn.zTree.init($("#tree"), setting);
                var newNode = { Title: "根节点", Id: null, ParentId: "" };
                json.push(newNode);
                zTreeObj.addNodes(null, json);
                mainList({ pId: "" });
                zTreeObj.expandAll(true);
            });
        };
        load();
        return {
            reload: load
        }
    }();
    $("#tree").height($("div.layui-table-view").height());
    //添加（编辑）模块对话框
    var editDlg = function () {
        var vm = new Vue({
            el: "#formEdit",
            data: {
                Id: "",
                Title: "",
                IsOnNav: 0,
                isOnPage: 0,
                Href: "",
                Styles: "",
                Flag: 1,
                Sort:-1
            }
        });
        var update = false;  //是否为更新
        var show = function (data) {
            var title = update ? "编辑信息" : "添加";

            layer.open({
                title: title,
                area: ["68%", "98%"],
                type: 1,
                content: $('#divEdit'),//update ? common.renderUrl('/administrator/Menu/Create', {
                //    id: data.Id
                //}) : common.renderUrl('/administrator/Menu/Create', {
                //    id: data.Id
                //}),
                success: function () {
                    vm.$set('$data', data);


                    if (update)
                    {
                        $('#ParentID').val(data.ParentId);

                        $('#ParentName').val(data.ParentName);


                        
                    }

                    if (data.IsOnNav == 1) {
                        $("input:checkbox[name=IsOnNav]").attr("checked", true);
                        $("input:checkbox[name=IsOnNav]").val(1)
                    }
                    else {
                        $("input:checkbox[name=IsOnNav]").attr("checked", false);
                        $("input:checkbox[name=IsOnNav]").val(0)
                    }

                    //console.log(JSON.stringify(data));

                },
                end: mainList
            });

            var url = "/administrator/Menu/Add";
            if (update) {
                url = "/administrator/Menu/Update"; //暂时和添加一个地址
            }

            //提交数据
            form.on('submit(formSubmit)',

                function (data) {
                   // console.log(JSON.stringify(data));
                    $.post(url,
                        data.field,
                        function (data) {
                            layer.msg(data.Message);
                        },
                        "json");
                    return false;
                });
        }
        return {
            add: function () { //弹出添加
                update = false;
                show({
                    Id: "",
                    Sort: 1
                });
            },
            update: function (data) { //弹出编辑框
                update = true;
                show(data);
            }
        };
    }();

    //添加菜单对话框
    var meditDlg = function () {
        var vm = new Vue({
            el: "#mfromEdit"
        });
        var update = false;  //是否为更新
        var show = function (data) {
            var title = update ? "编辑信息" : "添加";
        
            layer.open({
                title: title,
                area: ["68%", "98%"],
                type: 1,
                content: $('#divEdit'),//update ? common.renderUrl('/administrator/Menu/Create', {
                   // id: data.Id
               // }) : common.renderUrl('/administrator/Menu/Create', {
                  //  id: data.Id
               // }),
                success: function () {
                    vm.$set('$data', data);


           

                   // console.log(JSON.stringify(data));

                },
                end: mainList
            });

            var url = "/administrator/Menu/Add";
            if (update) {
                url = "/administrator/Menu/Update"; //暂时和添加一个地址
            }
            //提交数据
            form.on('submit(formSubmit)',

                function (data) {
                   
                    $.post(url,
                        data.field,
                        function (data) {
                            layer.msg(data.Message);
                        },
                        "json");
                    return false;
                });

   
        }
        return {
            add: function (moduleId) { //弹出添加
                update = false;
                show({
                    Id: "",
                    ModuleId: moduleId,
                    Sort: 1
                });
            },
            update: function (data) { //弹出编辑框
                update = true;
                show(data);
            }
        };
    }();

    //监听模块表格内部按钮
    table.on('tool(list)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {      //查看
            //layer.msg('ID：' + data.Id + ' 的查看操作');
            menuList({ moduleId: data.Id });
        }
    });

    //监听页面主按钮操作
    var active = {
        btnDel: function () {      //删除模块
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            openauth.del("/administrator/Menu/Delete",
                data.map(function (e) { return e.Id; }),
                mainList);
        }
        , btnDelMenu: function () {      //删除菜单
            var checkStatus = table.checkStatus('menuList')
                , data = checkStatus.data;
            openauth.del("/administrator/moduleManager/DelMenu",
                data.map(function (e) { return e.Id; }),
                menuList);
        }
        , btnAdd: function () {  //添加模块
            editDlg.add();
        }
        , btnAddMenu: function () {  //添加菜单
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择一个要添加菜单的模块");
                return;
            }
            meditDlg.add(data[0].Id);
        }
        , btnEdit: function () {  //编辑
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择编辑的行，且同时只能编辑一行");
                return;
            }
            editDlg.update(data[0]);
        }

        , btnEditMenu: function () {  //编辑菜单
            var checkStatus = table.checkStatus('menuList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择编辑的菜单");
                return;
            }
            meditDlg.update(data[0]);
        }

        , search: function () {   //搜索
            mainList({ key: $('#key').val() });
        }
        , btnRefresh: function () {
            mainList();
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听页面主按钮操作 end
})