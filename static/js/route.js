function Router() {
	this.routes = {};
	this.currentUrl = '';
	this.callback = {
		error: function(){},
		change: function(){},
		before: function(){},
		after: function(){}
	};
	this.default_route = {
		url: '',
		redirect: false,
		callback: function(){}
	};
}
Router.prototype.default = function(url, redirect, callback) {
	this.default_route = {
		url: url,
		redirect: redirect,
		callback: callback
	};
};
Router.prototype.error = function(callback) {
	this.callback.error = callback || function(){};
};
Router.prototype.change = function(callback) {
	this.callback.change = callback || function(){};
};
Router.prototype.before = function(callback) {
	this.callback.before = callback || function(){};
};
Router.prototype.after = function(callback) {
	this.callback.after = callback || function(){};
};
Router.prototype.route = function(path, callback) {
	this.routes[path] = callback || function(){};
};
Router.prototype.redirect = function(path) {
	window.location.href = window.location.href.replace(location.hash, '') + '#' + path;
};
Router.prototype.refresh = function() {
	if (location.hash.slice(1)) {
		this.currentUrl = location.hash.slice(1);
	} else {
		if (this.default_route.url !== '') {
			if (this.default_route.redirect) window.location.href = window.location.href + '#' + this.default_route.url;
			else this.currentUrl = this.default_route.url;
		} else {
			
		}
	}
	
	if (this.routes[this.currentUrl]) {
		this.callback.before(this.currentUrl);
		this.callback.after(this.currentUrl, this.routes[this.currentUrl]());
		this.callback.change(this.currentUrl);
	} else {
		var val = this.currentUrl.substring(this.currentUrl.lastIndexOf('/') + 1, this.currentUrl.length);
		var url = this.currentUrl.replace(val, '*');
		if (this.routes[url]) {
			this.callback.before(url);
			this.callback.after(url, this.routes[url](val));
			this.callback.change(url);
		}
		else {
			this.callback.error(this.currentUrl);
			this.callback.change(this.currentUrl);
		}
	}
};
Router.prototype.init = function() {
	window.addEventListener('load', this.refresh.bind(this), false);
	window.addEventListener('hashchange', this.refresh.bind(this), false);
}
window.Router = new Router();
window.Router.init();
