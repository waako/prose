var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var NavView = require('../nav');
var templates = require('../../../dist/templates');
var utils = require('../../util');

module.exports = Backbone.View.extend({
  // template: _.template(templates.sidebar.history),

  subviews: [],

  initialize: function(options) {
    _.bindAll(this);

    this.user = options.user;
    this.repo = options.repo;
    this.branch = options.branch;
    this.commits = options.commits;

    this.commits.setBranch(this.branch, {
      success: (function(model, res, options) {
        console.log(model);
        this.render();
      }).bind(this)
    });
  },

  render: function(options) {
    // Filter on commit.get('committer').id === user.get('id')
    this.commits.filter(function(commit) {
      console.log(commit.get('committer').id);
      return true;
    });

    // this.$el.html(this.template());

    /*
    var frag = document.createDocumentFragment();

    this.model.each((function(branch, index) {
      var view = new BranchView({
        model: branch,
        repo: this.repo,
        branch: this.branch
      });

      frag.appendChild(view.render().el);
      this.subviews.push(view);
    }).bind(this));

    this.$el.find('select').html(frag);
    */

    /*
    var view = this;
    var isJekyll = false;
    var errorPage = false;
    var hideInterface = false; // Flag for unauthenticated landing
    this.noMenu = false; // Prevents a mobile toggle from appearing when nto required.

    if (options) {
      if (options.hideInterface) hideInterface = options.hideInterface;
      if (options.jekyll) isJekyll = options.jekyll;
      if (options.noMenu) this.noMenu = options.noMenu;
      if (options.error) errorPage = options.error;
    }

    if (hideInterface) {
      $(this.el).toggleClass('disable-interface', true);
    } else {
      $(this.el).toggleClass('disable-interface', false);
    }

    $(this.el).empty().append(this.template(_.extend(this.model, app.state, {
      jekyll: isJekyll,
      error: errorPage,
      noMenu: view.noMenu,
      lang: (app.state.file) ? utils.mode(app.state.file) : undefined
    })));

    // When the sidebar should be open.
    // Fix this in re-factor, could be much tighter
    if (app.state.mode === 'tree' ||
        app.state.mode === '' && window.authenticated && app.state.user) {
      $('#prose').toggleClass('open', true);
      $('#prose').toggleClass('mobile', false);
    } else {
      $('#prose').toggleClass('open mobile', false);
    }

    this.nav = new NavView({
      app: this,
      user: this.user
    });

    this.nav.setElement(this.$el.find('nav')).render();
    this.subviews.push(this.nav);
    */

    return this;
  },

  recentFiles: function(data) {
    var sidebarTmpl = _.template(window.app.templates.recentFiles);
    $('#drawer', this.el).empty().append(sidebarTmpl(data));
  },

  restoreFile: function(e) {
    var $target = $(e.currentTarget);
    var $overlay = $(e.currentTarget).find('.overlay');
    var path = $target.data('path');

    // Spinning icon
    var message = '<span class="ico small inline saving"></span> Restoring ' + path;
    $overlay.html(message);

    app.models.restoreFile(app.state.user, app.state.repo, app.state.branch, path, app.state.history.commits[path][0].url, function(err) {
      if (err) {
        message = '<span class="ico small inline error"></span> Error Try again in 30 Seconds';
        $overlay.html(message);
      } else {
        message = '<span class="ico small inline checkmark"></span> Restored ' + path;
        $overlay.html(message);
        $overlay.removeClass('removed').addClass('restored');

        // Update the listing anchor link
        $target
          .removeClass('removed')
          .attr('title', 'Restored ' + path)
          .addClass('added');

        // Update the anchor listing icon
        $target.find('.removed')
          .removeClass('removed')
          .addClass('added');
      }
    });

    return false;
  },

  remove: function() {
    _.invoke(this.subviews, 'remove');
    this.subviews = [];

    Backbone.View.prototype.remove.apply(this, arguments);
  }
});