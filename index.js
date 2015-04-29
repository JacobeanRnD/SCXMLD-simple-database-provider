'use strict';

module.exports = function (opts) {
  // Consider initializing the module to be async. 
  opts = opts || {};

  var db = {},
    definitions = {},
    definitionToInstances = {},
    events = {},
    metaInformation = {};


  db.init = function (initialized){ initialized(); };
    
  db.saveStatechart = function (user, name, scxmlString, done) {
    definitions[name] = scxmlString;
    definitionToInstances[name] = [];

    done();
  };

  db.getStatechart = function (name, done) {
    done(null, definitions[name]);
  };

  db.deleteStatechart = function (chartName, done) {
    delete definitions[chartName];

    done();
  };

  db.getStatechartList = function (user, done) {
    done(null, Object.keys(definitions));
  };

  db.saveInstance = function (chartName, instanceId, conf, done) {
    events[instanceId] = [];

    var map = definitionToInstances[chartName] = definitionToInstances[chartName] || [];
    map[instanceId] = conf;

    done();
  };

  db.getInstance = function (chartName, instanceId, done) {
    var stateChartinstances = definitionToInstances[chartName];

    if(!stateChartinstances) return done({ statusCode: 404 });

    var conf = stateChartinstances[instanceId];

    if(typeof conf === 'undefined') return done({ statusCode: 404 });

    done(null, conf);
  };

  db.getInstances = function (chartName, done) {
    done(null, Object.keys(definitionToInstances[chartName]));
  };

  db.deleteInstance = function (chartName, instanceId, done) {
    var arr = definitionToInstances[chartName];
    arr.splice(arr.indexOf(instanceId), 1);

    done();
  };

  db.saveEvent = function (instanceId, event, done) {
    event.instanceId = instanceId;
    events[instanceId].push(event);

    done();
  };

  db.getEvents = function (instanceId, done) {
    done(null, events[instanceId]);
  };

  db.set = function (key, value, done) {
    metaInformation[key] = value;

    done();
  };

  db.get = function (key, done) {
    done(null, metaInformation[key]);
  };

  db.del = function (key, done) {
    var success = delete metaInformation[key];
    
    done(null, success);
  };

  return db;
};
