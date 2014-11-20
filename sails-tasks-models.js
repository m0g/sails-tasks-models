(function() {
'use strict';

var path = require('path');
var Waterline = require('waterline');
var fs = require('fs');

module.exports.init = function(callback) {
  var CWD = process.cwd();
  var modelsPath = path.join(__dirname, '../../api/models/');
  var orm = new Waterline();

  fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.match(/\.js$/i)) {
      global[file] = Waterline.Collection.extend(
        require(path.join(__dirname, '../../api/models/' + file))
      );

      try { orm.loadCollection(global[file]); }
      catch(e) { console.log(e); }
    }
  });

  // initialize ORM
  orm.initialize({
    adapters: {
      'sails-mysql': require('sails-mysql')
    },
    connections: require(path.join(CWD, 'config/connections')).connections,
    defaults: require(path.join(CWD, 'config/models')).models

  }, function (err, ontology) {
    callback(ontology);
  });
};

})();
