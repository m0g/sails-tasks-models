(function() {
'use strict';

var path = require('path');
var Waterline = require('waterline');
var fs = require('fs');

var CWD = process.cwd();
var modelsPath = path.join(__dirname, '../../api/models/');
var filePath = path.join(__dirname, '../../scripts/sql/deleteLocations.sql');

var orm = new Waterline();

var SailsTasksModels = function() {
  fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.match(/\.js$/i)) {
      global[file] = Waterline.Collection.extend(
        require(path.join(__dirname, '../../api/models/' + file))
      );

      try { orm.loadCollection(global[file]); }
      catch(e) { console.log(e); }
    }
  });
};

SailsTasksModels.prototype.init = function(callback) {
  // initialize ORM
  orm.initialize({
    adapters: {
      'sails-mysql': require('sails-mysql')
    },
    connections: require(path.join(CWD, 'config/connections')).connections,
    defaults: require(path.join(CWD, 'config/models')).models

  }, function (err, ontology) {
    if (err) console.log(err);

    else {
      // Create global variables for each model (e.g User.findOne)
      fs.readdirSync(modelsPath).forEach(function(file) {
        var name = null;

        if (name = file.match(/^(\w+)\.js$/i)) {
          name = name[1];
          var collection = name.toLowerCase();
          global[name] = ontology.collections[collection];
        }
      });
    }

    callback(ontology);
  });
};

module.exports = SailsTasksModels;

})();
