var extend = function(olds, news) {
    for(var index in news) {
        olds[index] = news[index];
    }
    return olds;
}
var throttle = function() {
    var isClear = arguments[0],
    fn;
    if(typeof isClear === "boolean") {
        fn = arguments[1];
        fn.__throttleID && clearTimeout(fn.__throttleID);
    } else {
        fn = isClear;
        param = arguments[1] || [];
        var p = extend({
            context: null,
            args: [],
            time: 300
        }, param);
        arguments.callee(true, fn);
        fn.__throttleID = setTimeout(function() {
            fn.apply(p.context, p.args)
        }, p.time)
    }
}
var Lazyload = function(id) {
    this.container = document.getElementById(id);
    this.imgs = this.getImgs();
    this.init();
}
Lazyload.prototype = {
                //初始化
                init: function() {
                    this.update(); //进行首次图片位置判断
                    this.bindEvent(); //添加事件
                },
                //获取图片数据
                getImgs: function() {
                    var arr = [];
                    var imgs = this.container.getElementsByTagName('img');
                    for(var i = 0, len = imgs.length; i < len; i++) {
                        arr.push(imgs[i]);
                    }
                    return arr;
                },
                //对图片进行处理操作
                update: function() {
                    if(!this.imgs.length) return;
                    var i = this.imgs.length;
                    for(i--; i >= 0; i--) {
                        if(this.shouldShow(i)) {
                            // 添加判断，避免非懒加载图片被强制替换成null
                            if(this.imgs[i].getAttribute("data-src") != null){
                                this.imgs[i].src = this.imgs[i].getAttribute("data-src");
                                this.imgs.splice(i, 1);
                            }
                        }
                    }
                },
                //判断图片位置
                shouldShow: function(i) {
                    var img = this.imgs[i];
                    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;


                    scrollBottom = scrollTop + document.documentElement.clientHeight;

                    //设置图片加载位置在滚动窗口的下方或上方
                    scrollBottom += 300000;

                    imgTop = this.pageY(img);
                    imgBottom = imgTop + img.offsetHeight;
                    if((imgTop > scrollTop && imgTop < scrollBottom) || (imgBottom > scrollTop && imgBottom < scrollBottom)) {

                        return true;
                    } else {
                        return false;
                    }
                },
                //获取图片距离页面顶部距离
                pageY: function(ele) {
                    if(ele.offsetParent) {
                        return ele.offsetTop + this.pageY(ele.offsetParent);
                    } else {
                        return ele.offsetTop;
                    }
                },
                //绑定事件
                bindEvent: function() {
                    var that = this;
                    that.on(window, "scroll", function() {
                        //that.update();
                        throttle(that.update, {
                            context: that
                        })
                    });
                    that.on(window, function() {
                        //that.update();
                        throttle(that.update, {
                            context: that
                        })
                    })
                },
                //监听
                on: function(ele, type, fn) {
                    if(ele.addEventListener) {
                        ele.addEventListener(type, fn, false)
                    } else {
                        ele.attachEvent("on" + type, fn)
                    }
                }
            }