let isLogin = false, user = {}, data = {};

let Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

$(document).ready(function () {
  $.ajax({
    type: 'get',
    url: "data.json",
    data: {
      sign: '{$Request.token.sign}'
    },
    dataType: 'json',
    success: function (res) {
      if (res.error === 1) {
        Toast.fire({
          icon: 'error',
          title: res.msg
        });
        window.location.reload();
      } else {
        data = res;
        load_page();
      }
    },
    error: function () {
      Toast.fire({
        icon: 'error',
        title: '网络错误，请刷新重试'
      });

    }
  });

});

function load_page() {

  let d = data.announcement.other[0];
  $('.breadcrumb').find('.announcement').find('a').attr('onclick', 'SeeAnnouncement(\'' + d.announcement_id + '\')').text(d.title);

  mlogin.set_config({
    appid: 'JkEv6v0Tj69S7P1HklLUXjDJzhNksTW6',
    callback: 'https://mclinks.site/auth',
    scope: 'get_user_info register_info group_info user_money idcard_verify auto_login'
  });

  mlogin.set_error(function (error) {
    Toast.fire({
      icon: 'error',
      title: '请重新登录'
    });
  });
  mlogin.check_login();

  Router.refresh();


  if (data.user.is_login) {
    $.ajax({
      type: 'post',
      url: "https://mclinks.site/ajax/user",
      dataType: 'json',
      success: function (res) {
        if (res.error == 1) {
          Toast.fire({
            icon: 'error',
            title: res.msg
          });
        } else {
          user = res.data;
          let html = '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img src="" class="avatar">' + user.username + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#/user">用户中心</a></li><li><a href="https://mlogin.cc/user?client_id={$Think.config.api.mlogin.client_id}&sign=' + res.sign + '" target="_blank">管理用户信息</a></li><li role="separator" class="divider"></li><li><a href="#/user/logout">退出登录</a></li></ul></li>';
          $('#u-menu').html(html);

          $('.avatar').attr('src', user.user_info.headimg);

          $('#support_user').val(user.username);

        }
      },
      error: function () {
        Toast.fire({
          icon: 'error',
          title: '网络错误，请刷新重试'
        });

      }
    });


  }

  isLogin = data.user.is_login;
}

function open_window(url, name) {
  let width = window.screen.width / 1.5;
  let height = window.screen.height / 1.5;
  let top = (window.screen.height - 30 - height) / 2;
  let left = (window.screen.width - 10 - width) / 2;

  window.open(url, name, 'height=' + height + ',,innerHeight=' + height + ',width=' + width + ',innerWidth=' + width + ',top=' + top + ',left=' + left + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}

function setting() {
  $('[data-toggle="tooltip"]').tooltip();
  $('.sidebar').theiaStickySidebar({
    additionalMarginTop: 80
  });
  $('.nicescroll-rails').remove();
  $('.niceScroll').niceScroll({
    cursorcolor: "#ccc",
    cursoropacitymax: 1,
    touchbehavior: false,
    cursorwidth: "5px",
    cursorborder: "0",
    cursorborderradius: "0",
    autohidemode: false
  });
  $('.LeftNav a').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('.LeftNav a').removeClass('active');
        $(this).addClass('active');
        $('html, body').animate({
          scrollTop: target.offset().top - 70
        }, 800);
        return false;
      }
    }
  });
  judgeWidth();
  $('body').scrollspy({target: '#LeftNav_Nav'});
  $('.LeftArrow').click(function () {
    if ($(this).attr('data-state') == 'expanded') {
      $(this).attr('data-state', 'collapsed');
      $(this).parent().animate({left: -$(this).offset().left}, 100);
      $(this).animate({left: 0}, 100);
      $(this).find('i').removeClass('fa-arrow-left');
      $(this).find('i').addClass('fa-arrow-right');
    } else {
      $(this).attr('data-state', 'expanded');
      $(this).parent().animate({left: 0}, 100);
      $(this).animate({left: $(this).parent().css('width')}, 100);
      $(this).find('i').removeClass('fa-arrow-right');
      $(this).find('i').addClass('fa-arrow-left');
    }
  });
  $(window).scroll(function () {
    judgeTop();
  });

  window.onresize = function () {
    judgeTop();
    judgeWidth();
  };

  function judgeTop() {
    if ($(window).scrollTop() >= 200) {
      $('#fixedBar').fadeIn(300);
    } else {
      $('#fixedBar').fadeOut(300);
    }
  }

  function judgeWidth() {
    if ($('.LeftArrow').attr('data-judged') == '0') {
      if (document.documentElement.clientWidth > 1678) {
        if ($(this).attr('data-state') == 'collapsed') {
          $('.LeftArrow').attr('data-state', 'expanded');
          $('.LeftArrow').parent().animate({left: 0}, 100);
          $('.LeftArrow').animate({left: $('.LeftArrow').parent().css('width')}, 100);
          $('.LeftArrow').find('i').removeClass('fa-arrow-right');
          $('.LeftArrow').find('i').addClass('fa-arrow-left');
        }
      } else {
        $('.LeftArrow').attr('data-state', 'collapsed');
        $('.LeftArrow').parent().animate({left: -$('.LeftArrow').offset().left}, 100);
        $('.LeftArrow').animate({left: 0}, 100);
        $('.LeftArrow').find('i').removeClass('fa-arrow-left');
        $('.LeftArrow').find('i').addClass('fa-arrow-right');
      }
      $('.LeftArrow').attr('data-judged', '1');
    }
  }
}

function SwitchNav() {
  let nav = location.hash;
  let current = $(".navbar-nav li a[href='" + nav + "']").eq(0);
  $(".navbar-nav li").removeClass('active');
  current.parent().addClass('active');
  if (current.parents('li').length > 1) current.parents('li').eq(1).addClass('active');
}

$('#fixedBar').click(function () {
  $('html,body').animate({scrollTop: '0px'}, 800);
});

/* $.get(); */

let announcement_id;
let announcement_content;

function SeeAnnouncement(id) {
  if (announcement_id == id) layer.open({
    title: '公告',
    type: 1,
    area: ['420px', 'auto'],
    content: announcement_content
  });
  else {
    let d;
    for (let announcement of data.announcement.other) {
      if (announcement.announcement_id == id) {
        d = announcement;
        break;
      }
    }
    if (!d) d = data.announcement.roof;
    announcement_id = id;
    announcement_content =
      '<table class="table table-condensed table-hover"><tbody><tr><td colspan="6" style="text-align:center;word-break:keep-all;"><b>'
      + d.title
      + '</b></td></tr>'
      + '<tr><td style="word-break:keep-all;background-color: #edf6fd;text-align:center;">发布时间</td><td colspan="5">'
      + d.create_time
      + '</td></tr>'
      + '<tr><td style="word-break:keep-all;background-color: #edf6fd;text-align:center;">公告内容</td><td colspan="5">'
      + d.content
      + '</td></tr>'
      + '</tbody></table>';
    layer.open({
      title: '公告',
      type: 1,
      area: ['420px', 'auto'],
      content: announcement_content
    });
  }
}


let page = {
  site: {
    info: {}
  },
  func: {
    friend_link: '',
    ads: {}
  }
};

let route = {
  func: {
    friend_link: function () {
      let html = '<div class="box box-info"><div class="box-header with-border"><h3 class="box-title">友情链接</h3><small style="padding-left:5px">友链顺序按添加时间先后</small><a href="#/link" class="pull-right" style="display:none">申请友链</a></div><div class="box-body" style="">';
      $.each(data.friend_link, function (i, d) {
        html += '<a href="#/link/click/' + d.link_id + '" style="padding-right: 12px" title="' + d.link_info.description + '" data-toggle="tooltip">' + d.link_info.name + '</a>';
      });
      html += '</div></div>';
      page.func.friend_link = html;
      return html;
    },
    ads: function (type = 'index_top') {
      if (page.func.ads[type]) return page.func.ads[type];
      let html = '';
      $.each(data.ads[type], function (i, d) {
        html += '<a data-toggle="tooltip" data-placement="left" title="' + d.title + '" href="' + d.link + '" target="_blank"><img src="' + d.image + '" class="img-responsive"></a>'
      });
      page.func.ads['type'] = html;
      return html + '<ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-fb+5w+4e-db+86" data-ad-client="ca-pub-7230640422779914" data-ad-slot="5881444779"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
    }
  },
  index: function () {
    if (page.index) {
      $('#app').html(page.index);
      return;
    }
    let count = {};
    let html = '';
    html = '<div class="jumbotron" id="Top"><h1>欢迎来到MC导航网</h1><p>在这里，你可以找到许多关于我的世界的网站。</p><p><form class="input-group search" action="#/search" onsubmit="location.href=\'#/search/\' + $(this).find(\'input\').val();return false;"><input type="text" class="form-control input-lg" placeholder="输入要搜索的内容" name="q"><span class="input-group-btn"><button class="btn btn-default btn-lg" type="button">搜索</button></span></form></p></div>';
    html += '<div class="row wrapper"><div class="LeftNav"><div class="LeftArrow" data-state="expanded" data-judged="0"><i class="fa fa-arrow-left"></i></div><div class="panel panel-default"><div class="panel-heading">导航</div><div class="panel-body niceScroll" style="max-height:600px;overflow-y:hidden"><div class="list-group Nav">'
    html += '<a href="#Top" class="list-group-item active">首页</a>';
    $.each(data.categories, function (i, d) {
      html += '<a href="#Category' + d.category_id + '" class="list-group-item">' + d.category_info.name.cn + '</a>';
    });
    html += '</div></div></div></div><div class="col-md-9 content">';
    $.each(data.categories, function (i, d) {
      html += '<div class="panel panel-default" id="Category' + d.category_id + '">';
      html += '<div class="panel-heading">';
      html += '<h3 class="panel-title">' + d.category_info.name.cn + '<small class="pull-right text-muted"></small></h3>';
      html += '</div>';
      html += '<div class="panel-body">';
      html += '</div>';
      html += '</div>';
      count[d.category_id] = 0;
    });
    html += '<div class="hidden-xs hidden-sm">' + route.func.friend_link() + '</div></div>';
    html += '<div class="col-md-3 sidebar"><div class="box box-danger"><div class="box-header with-border"><h3 class="box-title">宣传</h3><a href="#/support" class="pull-right">赞助</a></div><div class="box-body">';
    html += route.func.ads();
    html += '</div></div><div class="box box-warning"><div class="box-header with-border"><h3 class="box-title">网站公告</h3><a href="#/announcement" class="pull-right">更多</a></div><div class="box-body">';
    html += data.announcement.roof.content;
    html += '</div><div class="box-footer"><a target="_blank" href="' + data.qun + '">加入交流反馈群</a><a target="_blank" href="https://wpa.qq.com/msgrd?v=3&uin=3193472696&site=MC导航网&menu=yes&from=mclinks" class="pull-right">联系站长</a></div></div>';

    $('#app').html(html);

    $.each(data.sites, function (i, d) {
      count[d.category_id]++;
      let site_html = '<div class="col-md-4 col-sm-6 col-xs-12 webinfo">';
      site_html += '<div class="site_card" data-toggle="tooltip" data-placement="bottom" data-original-title="' + d.site_info.description + '">';
      if (d.status == 1) site_html += '<a href="#/site/info/' + d.Id + '">';
      site_html += '<div class="media"><div class="media-left">';
      site_html += '<img class="media-object" src="' + d.site_info.icon + '" onerror="$(this).attr(\'src\', \'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABlBMVEXMzMyWlpYU2uzLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAACklEQVQImWNgAAAAAgAB9HFkpgAAAABJRU5ErkJggg==\');" alt="Website Icon" style="width: 64px;">';
      site_html += '</div>';
      site_html += '<div class="media-body">';
      if (d.status == -1) site_html += '<small class="site_status site_status_error">无法访问</small>';
      if (d.status == 1) site_html += '<small class="site_status site_status_verify">可信</small>';
      site_html += '<h4 class="media-heading">';
      site_html += '<span class="site_title">' + d.site_info.name + '</span></h4>';
      site_html += '<p class="site_description">' + d.site_info.description + '</p>';
      site_html += '</div></div>';
      if (d.status == 1) site_html += '</a>';
      site_html += '</div></div>';
      if (count[d.category_id] % 3 == 0) site_html += '<div class="col-md-12 hidden-sm col-xs-12 web_br" style=""></div>';
      $('#Category' + d.category_id).find('.panel-body').append(site_html);
      $('#Category' + d.category_id).find('.panel-heading').find('.panel-title').find('small').html('当前分类共 ' + count[d.category_id] + ' 个网站');
    });
    page.index = $('#app').html();
  },
  agreement: function () {
    if (page.agreement) {
      $('#app').html(page.agreement);
      return;
    }
    let html = '<div class="row"><div class="col-md-12"><div class="box box-info"><div class="box-header with-border"><h3 class="box-title">《MC导航网使用协议与条款》</h3></div><div class="box-body"><div class="col-md-12">';
    html += data.agreement;
    html += '</div></div></div></div></div>';
    $('#app').html(html);
    page.agreement = $('#app').html();
  },
  announcement: function () {
    if (page.announcement) {
      $('#app').html(page.announcement);
      return;
    }
    let html = '<div class="row"><div class="col-md-12">';
    html += '<div class="table-responsive"><table class="table table-hover table-bordered table-striped"><thead><th style="min-width:90px">发布时间</th><th>标题</th><th>内容</th><th>操作</th></thead><tbody>';
    html += '<tr><td>' + data.announcement.roof.create_time + '</td>';
    html += '<td style="word-break:keep-all">' + data.announcement.roof.title + '</td>';
    html += '<td>' + data.announcement.roof.preview + '</td>';
    html += '<td><button class="btn btn-sm btn-primary" onclick="SeeAnnouncement(\'' + data.announcement.roof.announcement_id + '\')">查看</button></td>';
    html += '</tr>';
    $.each(data.announcement.other, function (i, d) {
      html += '<tr><td>' + d.create_time + '</td>';
      html += '<td style="word-break:keep-all">' + d.title + '</td>';
      html += '<td>' + d.preview + '</td>';
      html += '<td><button class="btn btn-sm btn-primary" onclick="SeeAnnouncement(\'' + d.announcement_id + '\')">查看</button></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    html += '</div>';
    html += '</div><div class="col-md-12">';
    html += route.func.friend_link();
    html += '</div></div>';
    $('#app').html(html);
    page.announcement = $('#app').html();
  },
  update: function () {
    if (page.update) {
      $('#app').html(page.update);
      return;
    }
    let html = '<div class="row"><div class="col-md-12"><div class="box box-info"><div class="box-header with-border"><h3 class="box-title">更新日志</h3></div><div class="box-body"><div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    $.each(data.update_logs, function (i, d) {
      html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
      html += d.update_time + '<span>(<code>' + d.count + '</code>条更新)</span>';
      html += '</h4></div><div class="panel-body"><ul>';
      $.each(d.update_info, function (j, k) {
        html += '<li>' + k.content + '<span>(' + k.time + ')</span></li>';
      });
      html += '</ul></div></div>';

    });
    html += '</div></div></div></div></div>';
    $('#app').html(html);
    page.update = $('#app').html();
  },
  search: function (q) {
    let results = [];
    let count = 0;
    q = decodeURIComponent(q);
    $.each(data.sites, function (i, d) {
      let name = d.site_info.name;
      let description = d.site_info.description;
      let reg = new RegExp(q, "gi");
      let searched = false;

      if (d.site_info.name.match(reg) || d.site_info.description.match(reg) || d.site_info.name.search(q) !== -1 || d.site_info.description.search(q) !== -1) {
        name = d.site_info.name.replace(reg, function (txt) {
          return '<strong class="text-danger">' + txt + '</strong>';
        });
        description = d.site_info.description.replace(reg, function (txt) {
          return '<strong class="text-danger">' + txt + '</strong>';
        });
        searched = true;
      }

      if (searched) {
        count++;
        let result = `
          <div class="col-md-4 col-sm-6 col-xs-12 webinfo">
            <div class="media">
              ${d.site_info.icon ? `<div class="media-left"><img class="media-object" style="width: 64px;" src="${d.site_info.icon}" alt="Site Icon" style="width:64px" onerror="$(this).attr('src', 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABlBMVEXMzMyWlpYU2uzLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAACklEQVQImWNgAAAAAgAB9HFkpgAAAABJRU5ErkJggg==');"></div>` : ''}
              <div class="media-body">
                ${d.status == 2 ? '<small class="site_status site_status_error">无法访问</small>' : ''}
                ${d.status == 1 ? '<small class="site_status site_status_verify">认证</small>' : ''}
                <h4 class="media-heading">${name}</h4>
                ${description}
                ${d.status != -1 ? `<br><div style=""><div style="width:50%;float:left;"><a href="#/site/info/${d.Id}">网站信息</a></div><div style="width:50%;float:left;"><a href="#/site/link/${d.Id}">访问网站</a></div></div>` : ''}
              </div>
            </div>
          </div>
          ${count % 3 == 0 ? '<div class="col-md-12 col-sm-12 col-xs-12 web_br" style=""></div>' : ''}
        `;
        results.push(result);
      }
    });

    let content = '<div class="row" style="padding:20px">' + results.join('') + '</div>';

    if (q == 'undefined') q = '';

    let html = `
      <div class="row">
        <div class="col-md-12">
          <div class="box box-info">
            <div class="box-header with-border">
              <div class="search">
                <form action="#/search" method="GET" onsubmit="location.href='#/search/' + $(this).find('input').val();return false;">
                  <div class="input-group">
                    <input type="text" name="q" class="form-control input-search" placeholder="搜索..." value="${q}">
                    <span class="input-group-btn">
                      <button class="btn btn-default"type="submit"><i class="fa fa-search"></i></button>
                    </span>
                  </div>
                </form>
              </div>
              <span>共有 <strong>${count}</strong> 个结果</span>
            </div>
            <div class="box-body">
              ${content}
            </div>
          </div>
        </div>
      </div>
    `;
    $('#app').html(html);
    page.search = $('#app').html();
  },
  note: function () {
    let html = '<div class="row"><div class="col-md-12"><div class="box box-info"><div class="box-header with-border"><h3 class="box-title">使用须知</h3></div><div class="box-body">';
    html += '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';

    html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
    html += '关于';
    html += '</h4></div><div class="panel-body"><ul>';
    html += '<li>出生于 2018-12-14 ，灵感突发的成果</li>';
    html += '<li>收录了一系列与MC相关的网站，帮助大家更好的找到自己想要的网站，方便大家。做最好的我的世界导航网！</li>';
    html += '<li>于 2020-7-24 实现前后端分离 抛弃后端路由 采用前端路由（虽然这样会掉收录量 但我们不是为了流量 我们为的是给用户带来更好的体验）</li>';
    html += '<li>前端路由为耗子所开发的简易路由（对导航网来说足够用了） 前端样式为bootstrap3（懒人必备）以及耗子自己编写的一些样式</li>';
    html += '<li>将提供以下有限的服务：收录有关MC的网站</li>';
    html += '<li>他希望能在茫茫互联网留下一些存在的痕迹，翘首以盼大家能通过各大搜索引擎访问他（将有助于提升其搜索排名），搜索关键词：MC导航网、我的世界导航网</li>';
    html += '</ul></div></div>';

    html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
    html += '浏览器的使用';
    html += '</h4></div><div class="panel-body"><ul>';
    html += '<li>诸如chrome(谷歌浏览器)，uc浏览器，qq浏览器等的主流浏览器。</li>';
    html += '<li>请勿使用百度App与任何应用的内置的浏览器访问本站点。</li>';
    html += '</ul></div></div>';

    html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
    html += '商务合作、广告投放';
    html += '</h4></div><div class="panel-body"><ul>';
    html += '<li>联系QQ：3193472696。</li>';
    html += '</ul></div></div>';

    html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
    html += '开发人员';
    html += '</h4></div><div class="panel-body"><ul>';
    html += '<a href="https://i-coder.top" target="_blank" title="耗子（项目发起、前后端分离、前端优化）" data-toggle="tooltip">';
    html += '<img src="https://i.loli.net/2020/05/02/vQpGYCgZEqJ4RVT.jpg" style="width:36px">';
    html += '</a>';
    html += '<a href="javascript:void(0)" target="_blank" title="慕熙（后端优化）" data-toggle="tooltip" style="padding-left:10px">';
    html += '<img src="https://q1.qlogo.cn/g?b=qq&nk=1414761422&s=100" style="width:36px">';
    html += '</a>';
    html += '</ul></div></div>';

    html += '</div></div></div></div><div class="col-md-12">';
    html += route.func.friend_link();
    html += '</div></div>';
    $('#app').html(html);

  },
  user_index: function () {

    if (!isLogin) {
      Toast.fire({
        icon: 'error',
        title: '未登录！'
      });
      Router.redirect('/');
    }
    let html = '<div class="jumbotron"><h1>未完成</h1><p><s>什么未完成 明明就是不想写了</s><br>';
    html += '<b>有</b>时间再写(<s>快打死耗子</s>)<br>';
    html += '目前提交网站请<a href="https://wpa.qq.com/msgrd?v=3&uin=3193472696&site=MC导航网&menu=yes&from=mclinks" target="_blank">联系站长</a>';
    html += '</p></div>';

    html = '<div class="row wrapper"><div class="col-md-12">';
    html+= '<div class="box box-info"><div class="box-header with-border"><h3 class="box-title">网站列表</h3></div>';
    html+= '<div class="box-body">';
    html+= '<div class="table-responsive"><table class="table" id="site_list"><thead><tr><th scope="col">#</th><th scope="col">网站名</th><th scope="col">网站描述</th><th scope="col">网站状态</th><th scope="col">操作</th></tr></thead><tfoot><tr><th scope="col">#</th><th scope="col">网站名</th><th scope="col">网站描述</th><th scope="col">网站状态</th><th scope="col">操作</th></tr></tfoot>';
    html+= '<tbody></tbody>';
    html+= '</table></div>';
    html+= '</div>';
    html+= '</div>';
    html+= '</div>';
    html+= '</div>';

    $('#app').html(html);

    $.ajax({
        type: 'post',
        url: '/ajax/user',
        data: {},
        dataType: 'json',
        success: function(res) {
            if (res.error == 1) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg
                });
            } else {

                user = res.data;

                $.each(res.sites, function(i, d) {
                    let html= '<tr><th scope="row">' + d.Id + '</th><td>' + d.end_time + '</td>';
                    html+= '<td>' + d.username + '</td>';
                    html+= '<td style="word-break:keep-all">' + d.content + '</td>';
                    html+= '<td>' + d.money + ' 元</td>';
                    html+= '</tr>';
                });
            }
        },
        error: function() {
            Toast.fire({
                icon: 'error',
                title: '网络错误'
            });
        }
    });
  },
  user_logout: function () {
    $.post('https://mclinks.site/ajax/logout', {}, function (res) {
      if (res.error == 0) {
        Toast.fire({
          icon: 'success',
          title: '退出登录成功！'
        });
        $('#u-menu').html('<li><a href="javascript:mlogin.popup();">登录 / 注册</a></li>');
        Router.redirect('/');
      } else {
        Toast.fire({
          icon: 'error',
          title: res.msg
        });
      }

    }, 'json');

  },

  support: function () {
    let html = '<div class="row"><div class="col-md-12">';
    html += '<div class="box box-info" style="text-align:center;">';
    html += '<div class="box-body">';
    html += '<div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-user"></span>赞助人</span>';
    html += '<input size="30" id="support_user" value="匿名用户" class="form-control" disabled>';
    html += '</div><br>';
    html += '<form id="support_payment" action="#/support/submit" method="post" target="_blank" class="form-horizontal">';
    html += '<div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-shopping-cart"></span>赞助留言</span>';
    html += '<input size="30" name="Content" value="赞助MC导航网" class="form-control" required>';
    html += '</div><br><div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-yen"></span>赞助金额</span>';
    html += '<input type="number" size="30" name="Money" value="1.00" class="form-control" required min="0.01" step="0.01">';
    html += '</div><br><div class="alert alert-info">前往收银台进行支付...</div>';
    html += '<button type="submit" class="btn btn-primary">支付</button>';
    html += '</form>';

    html += '</div></div>';

    html += '<div class="box box-info" style="text-align:center;">';
    html += '<div class="box-body">';
    html += '<div class="table-responsive">';
    html += '<table class="table table-hover table-bordered table-striped"><thead><th style="min-width:90px">赞助时间</th><th>用户</th><th>留言</th><th>金额</th></thead><tbody>';
    $.each(data.support, function (i, d) {
      html += '<tr><td>' + d.end_time + '</td>';
      html += '<td>' + d.username + '</td>';
      html += '<td style="word-break:keep-all">' + d.content + '</td>';
      html += '<td>' + d.money + ' 元</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    html += '</div></div>';

    html += '</div></div>';

    $('#app').html(html);


    function get_status(t) {
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'https://mclinks.site/ajax/status',
        timeout: 10000,
        data: {
          t: t
        },
        success: function (data, textStatus) {
          if (data.code == 1) {
            Toast.fire({
              icon: 'success',
              title: '支付成功。正在跳转...'
            });
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          } else {
            setTimeout(function () {
              get_status(t);
            }, 4000);
          }
        },

        error: function (XMLHttpRequest, textStatus) {
          if (textStatus == "timeout") {
            setTimeout(function () {
              get_status(t);
            }, 1000);
          } else {
            setTimeout(function () {
              get_status(t);
            }, 4000);
          }
        }
      });
    }

    $('#support_payment').submit(function () {
      let btn = $(this).find('button[type="submit"]');
      btn.html('<i class="fa fa-circle-notch fa-spin"></i>');
      btn.attr('disabled', true);
      $.ajax({
        type: 'post',
        url: 'https://mclinks.site/ajax/support',
        data: $('#support_payment').serialize(),
        dataType: 'json',
        success: function (res) {
          if (res.error == 1) {
            Toast.fire({
              icon: 'error',
              title: res.msg
            });
            btn.html('支付');
            btn.removeAttr('disabled');
          } else {
            Toast.fire({
              icon: 'success',
              title: '创建订单成功'
            });
            btn.html('等待支付...');
            open_window(res.url, 'mclinks_support');
            get_status(res.trade_T);
          }
        },
        error: function () {
          Toast.fire({
            icon: 'error',
            title: '创建订单失败，网络错误'
          });
          btn.html('支付');
          btn.removeAttr('disabled');
        }
      });
      return false;
    });

  },


  error: function (path) {
    if (path.search('access_token') >= 0) return false;
    let html = '<div class="jumbotron"><h1>404 NOT FOUND</h1><p>该页面(' + path + ')已丢失 或者正在建设中 <a href="#/">返回首页</a></p></div>';
    $('#app').html(html);
  },
  site: {
    info: function (id) {
      if (page.site.info[id]) {
        $('#app').html(page.site.info[id]);
        return;
      }
      let d;
      for (let i = 0; i < data.sites.length; i++) {
        if (data.sites[i].Id == id) {
          d = data.sites[i];
          break;
        }
      }
      if (!d) route.error('/site/info/' + id);
      else {
        let u;
        $.each(data.users, function (i, da) {
          if (da.user_id == d.user_id) {
            u = da;
          }
        });
        let domain = d.site_info.url.split('/');
        if (domain[2]) domain = domain[2];
        else domain = '';
        let html = '<div class="row wrapper"><div class="col-md-9 content">';
        html += '<div class="box box-success"><div class="box-header with-border"><h3 class="box-title">网站信息</h3></div>';
        html += '<div class="box-body"><div class="col-md-4"><img src="' + d.site_info.icon + '" style="width: 100%"></div>';
        html += '<div class="col-md-8" style="float: left;">';
        html += '<p><span class="label label-info">' + '</span><a href="https://baidurank.aizhan.com/baidu/' + domain + '" target="_blank" class="pull-right"><img src="https://baidurank.aizhan.com/api/br?domain=' + domain + '&style=images"></a></p>';
        html += '<h3>' + d.site_info.name + '</h3>';

        html += '<p>' + d.site_info.description + '</p>';
        html += '<p>';
        html += '<a href="#/site/link/' + d.Id + '" class="btn btn-primary">访问网站</a>';
        html += '<a href="javascript:" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="<img src=\'https://my.tv.sohu.com/user/a/wvideo/getQRCode.do?width=150&amp;height=150&amp;text=https://mclinks.site/#/site/link/' + d.Id + '\' width=\'150\'>"><span>手机查看<i class="fa fa-qrcode"></i></span></a>';
        html += '</p>';

        html += '<p>';
        if (d.status == -1) html += '<h4 class="site_status site_status_error" style="float:left">无法访问</h4>';
        if (d.status == 1) html += '<h4 class="site_status site_status_verify" style="float:left">可信</h4>';
        html += '</p>';

        html += '</div>';
        html += '</div><div class="box-footer">';
        html += '</div></div>';

        html += '<div class="box box-success"><div class="box-header with-border">';
        html += '<h3 class="box-title">关于网站</h3>';
        html += '</div>';
        html += '<div class="box-body" id="d-site-about">';
        html += d.site_info.about
        html += '</div>';
        html += '<div class="box-footer">';
        html += '更多数据统计正在制作中！'
        html += '</div>';
        html += '</div>';

        html += '<div class="box"><div class="box-header with-border"><h3 class="box-title">数据分析</h3></div><div class="box-body"><div class="col-md-12"><div id="" style="height: 300px; padding: 0px; position: relative;"><center><h3 style="padding-top:120px">不想写 先鸽了 过段时间填坑</h3></center></div></div></div></div>';

        html += '</div>';
        html += '<div class="col-md-3 sidebar"><div class="box box-info">';
        html += '<div class="box-header with-border"><h3 class="box-title">提交人信息</h3></div>';
        html += '<div class="box-body"><div class="media">';
        html += '<div class="media-left">';
        html += '<img class="media-object" style="width: 64px" src="' + u.user_info.headimg + '" alt="User Avatar">';
        html += '</div><div class="media-body">';
        html += '<h4 class="media-heading"><strong><small style="font-family:\'Minecraft\'">' + u.username + '</small></strong></h4>';
        html += '<p><span style="color:' + u.user_group[0].group_info.color + '">' + u.user_group[0].group_info.name + '</span><br>';
        html += '<span style="text-overflow:ellipsis;overflow:hidden;">' + u.description + '</span><br>';
        html += '</p></div></div></div>';
        /*html+= '<div class="box-footer">';
        html+= '</div>';*/
        html += '</div>';
        html += '<div class="box box-warning"><div class="box-header with-border">';
        html += '<h3 class="box-title">数据统计</h3>';
        html += '</div>';
        html += '<div class="box-body">';
        html += '暂无数据（其实是鸽了）';
        html += '</div>';
        html += '<div class="box-footer">';
        html += '更多数据统计正在制作中！'
        html += '</div>';
        html += '</div>';
        html += '<div class="box" style="border-top-color:#6f42c1">'
        html += '<div class="box-header with-border">';
        html += '<h3 class="box-title">评论</h3>';
        html += '</div>';
        html += '<div class="box-body">';
        html += '<span style="color:red">评论区已关闭！</span>';
        html += '</div>';
        html += '<div class="box-footer">';
        html += '评论区未完善，故未开放！';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-danger">'
        html += '<div class="box-header with-border">';
        html += '<h3 class="box-title">宣传</h3><a href="#/support" class="pull-right">赞助</a>';
        html += '</div>';
        html += '<div class="box-body">';
        html += route.func.ads();
        html += '</div>';

        html += '</div>';

        html += '</div>';

        html += '</div><div class="row"><div class="col-md-12">';
        html += route.func.friend_link();
        html += '</div></div></div>';
        $('#app').html(html);
        $('#d-site-about').html($('#d-site-about').text());
      }
    },
    link: function (id) {
      let d;
      for (let i = 0; i < data.sites.length; i++) {
        if (data.sites[i].Id == id) {
          d = data.sites[i];
          break;
        }
      }
      if (!d) route.error('/site/link/' + id);
      else {
        let html = '<div class="jumbotron"><h1>正在跳转</h1><p>你正在前往<br>';
        html += d.site_info.name + '（<a href="' + d.site_info.url + '" target="_blank">' + d.site_info.url + '</a>）</p></div>';

        $('#app').html(html);
        setTimeout(function () {
          window.open(d.site_info.url);
          window.history.back();
        }, 1500);
      }
    }
  },
  link_click: function (id) {
    let d;
    for (let i = 0; i < data.friend_link.length; i++) {
      if (data.friend_link[i].link_id == id) {
        d = data.friend_link[i];
        break;
      }
    }
    if (!d) route.error('/link/click/' + id);
    else {
      let html = '<div class="jumbotron"><h1>正在跳转</h1><p>你正在前往<br>';
      html += d.link_info.name + '（<a href="' + d.link_info.url + '" target="_blank">' + d.link_info.url + '</a>）</p></div>';

      $('#app').html(html);
      setTimeout(function () {
        window.open(d.link_info.url);
        window.history.back();
      }, 1500);
    }
  }
};

Router.error(route.error);
Router.change(function (path) {
  setting();
  SwitchNav();
  let title = '';
  switch (path) {
    case '/':
      title = '首页';
      break;
    case '/agreement':
      title = '使用协议与条款';
      break;
    case '/announcement':
      title = '公告';
      break;
    case '/update':
      title = '更新日志';
      break;
    case '/note':
      title = '使用须知';
      break;
    case '/site/info/*':
      title = '网站信息';
      break;
    case '/support':
      title = '支持我们';
      break;
    case '/search':
    case '/search/':
    case '/search/*':
      title = '搜索';
      break;
    case '/link/click/*':
    case '/site/link/*':
      title = '页面跳转';
      break;
    case '/user':
      title = '用户中心';
      break;
  }
  $('.breadcrumb').find('li').eq(1).find('a').attr('href', window.location.hash).text(title);
});
Router.default('/', true);
Router.route('/', route.index);
Router.route('/agreement', route.agreement);
Router.route('/announcement', route.announcement);
Router.route('/update', route.update);
Router.route('/note', route.note);
Router.route('/site/info/*', route.site.info);
Router.route('/search', route.search);
Router.route('/search/', route.search);
Router.route('/search/*', route.search);
Router.route('/link/click/*', route.link_click);
Router.route('/site/link/*', route.site.link);
Router.route('/user', route.user_index);
Router.route('/user/logout', route.user_logout);
Router.route('/support', route.support);