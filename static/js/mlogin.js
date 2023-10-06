const server_base_uri = 'https://mlogin.cc/';

const authorize_route = server_base_uri + 'oauth/authorize';
const resource_route = server_base_uri + 'api/me';
const login_route = server_base_uri + 'user/login';

function mlogin() {
  this.config = {
    appid: '',
    callback: '',
    scope: ''
  };
  this.callback = function(){};
  this.error = function(){};
  this.element = {
    background: '',
    iframe: ''
  }
}
mlogin.prototype.set_config = function(config) {
  this.config = config;
};
mlogin.prototype.set_callback = function(callback) {
  this.callback = callback;
};
mlogin.prototype.set_error = function(error_callback) {
  this.error = error_callback;
};
mlogin.prototype._gen_login_uri = function(state, method='authorize', params=[]) {
  if (method == 'authorize') {
    var queryParams = [
      'response_type=code',
      'client_id=' + this.config.appid,
      'redirect_uri=' + this.config.callback,
      'scope=' + this.config.scope,
      'state=' + state
    ];
    var query = queryParams.join('&');
    var url = authorize_route + '?' + query;
    return url;
  } else if (method == 'token') {
    var queryParams = [
      'response_type=token',
      'client_id=' + this.config.appid,
      'redirect_uri=' + this.config.callback,
      'scope=' + this.config.scope,
      'state=' + state
    ];
    var query = queryParams.join('&');
    var url = authorize_route + '?' + query;
    return url;
  } else if (method == 'login') {
    var query = params.join('&');
    var url = login_route + '?' + query;
    return url;
  }

}
mlogin.prototype.login = function(state, method='authorize', params=[]) {
  window.location.replace(this._gen_login_uri(state, method, params));
};
mlogin.prototype.popup = function(state, method='authorize', params=[]) {
  if (window.location.protocol === 'http:') {
    this.login(state, method, params);
    return;
  }
  url = this._gen_login_uri(state, method, params) + '&display=popup';
  var style = document.createElement('style');
  style.innerHTML = ".mlogin_login_back{"
    +"background-color: rgb(0, 0, 0); "
    +"overflow: hidden; "
    +"position: fixed; "
    +"left: 0px; "
    +"top: 0px; "
    +"width: 100%; "
    +"height: 100%; "
    +"z-index: 9998; "
    +"opacity: 0.6;"
    +"}"
    +".mlogin_login_iframe{"
    +"left: 50%; "
    +"top: 50%; "
    +"position: fixed; "
    +"z-index: 9999; "
    +"background: none; "
    +"width: 500px; "
    +"height: 637px; "
    +"margin-left: -250px; "
    +"margin-top: -302.5px;"
    +"}"
    +"@media (max-width: 560px) {"
    +".mlogin_login_iframe{"
    +"left: 0%; "
    +"top: 0%; "
    +"position: fixed; "
    +"z-index: 9999; "
    +"background: none; "
    +"width: 100%; "
    +"height: 100%; "
    +"margin-left: 0px; "
    +"margin-top: 0px;"
    +"}"
    +"}"
  document.body.appendChild(style);
  var html='<div id="mlogin_login_back" class="mlogin_login_back"></div>'
    +'<div id="mlogin_login_iframe" class="mlogin_login_iframe">'
    +'<iframe allowtransparency="true" scrolling="no" frameborder="0" width="100%" height="100%" style="top:0; left:0;" src="'
    + url
    + '"></iframe></div>';

  document.getElementsByTagName('body')[0].innerHTML = document.getElementsByTagName('body')[0].innerHTML + html;
  mlogin.element.background = document.getElementById('mlogin_login_back');
  mlogin.element.iframe = document.getElementById('mlogin_login_iframe');
  this._popup_listner();
}

mlogin.prototype._popup_listner = function() {
  window.addEventListener('message', function(e){
    if (e.data == 'mlogin_close'){
      mlogin.element.background.parentNode.removeChild(mlogin.element.background);
      mlogin.element.iframe.parentNode.removeChild(mlogin.element.iframe);
    }
  },false);
}

mlogin.prototype.check_login = function() {
  window.onload = function() {
    if (window.location.hash.length > 3) {
      var hash = window.location.hash.substring(1);
      if (hash.split('=')[0] == 'access_token') {
        var queryParams = [hash, 'callback='];
        var query = queryParams.join('&');
        var url = resource_route + '?' + query;

        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
      }
    }
  }
};
mlogin.prototype.callback = function(user) {
  this.callback(user);
};
mlogin.prototype.error = function(error) {
  this.error(error);
};
window.mlogin = new mlogin();