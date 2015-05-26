'use strict';

module.exports = function (opts) {
  // Consider initializing the module to be async. 
  opts = opts || {};

  var db = {},
    instances = {},
    events = {},
    metaInformation = {};


  db.init = function (initialized){ initialized(); };

  db.saveInstance = function (instanceId, conf, done) {
    events[instanceId] = [];

    instances[instanceId] = conf;

    done();
  };

  db.getInstance = function (instanceId, done) {
    var conf = instances[instanceId];

    if(typeof conf === 'undefined') return done({ statusCode: 404 });

    done(null, conf);
  };

  db.getInstances = function (done) {
    done(null, Object.keys(instances));
  };

  db.deleteInstance = function (instanceId, done) {
    var conf = instances[instanceId];

    if(typeof conf === 'undefined') return done({ statusCode: 404 });

    delete instances[instanceId];

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
