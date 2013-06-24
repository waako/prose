var Backbone = require('backbone');
var Branches = require('../collections/branches');
var config = require('../config');

module.exports = Backbone.Model.extend({
  constructor: function(attributes, options) {
    Backbone.Model.call(this, {
      id: attributes.id,
      description: attributes.description,
      fork: attributes.fork,
      homepage: attributes.homepage,
      master_branch: attributes.master_branch,
      name: attributes.name,
      owner: {
        id: attributes.owner.id,
        login: attributes.owner.login
      },
      permissions: attributes.permissions,
      private: attributes.private,
      updated_at: attributes.updated_at
    });
  },

  initialize: function(attributes, options) {
    this.branches = new Branches([], { repo: this });
  },

  url: function() {
    return config.api + '/repos/' + this.get('owner').login + '/' + this.get('name');
  }
});