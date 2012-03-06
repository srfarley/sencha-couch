
describe("Prerequisites", function() {

  it("has loaded ExtJS 4.0.x", function() {
    expect(Ext).toBeDefined();
    expect(Ext.getVersion()).toBeTruthy();
    expect(Ext.getVersion().major).toEqual(4);
    expect(Ext.getVersion().minor).toEqual(0);
  });

  it("has loaded application code", function() {
    expect(Application).toBeDefined();
  });
  
});

describe("CouchDB Operations", function() {
  
  Ext.define('Person', {
    extend: 'SenchaCouch.Model',
  
    fields: [{
      name: 'name',
      type: 'string'
    },{
      name: 'age',
      type: 'int'
    }],
  
    proxy: {
      type: 'couchdb',
      databaseUrl: '/',
      databaseName: 'sencha_couch_test',
      designName: 'test',
      viewName: 'people'
    }
  });
  
  var PAUSE = 500;
  
  var store = new Ext.data.Store({
    model: 'Person'
  });
  
  afterEach(function () {
    store.load(function() {
      Ext.each(store.getRange(), function(person) {
        person.destroy();
      });
    });
  });
  
  it('can save and load a new Model object', function() {
    var id;
    
    var person = new Person({ name: 'Ralph', age: 30 });
    id = person.getId();
    expect(id).toBeFalsy();

    runs(function() {
      person.save();
    });
    
    waits(PAUSE);
  
    runs(function() {
      id = person.getId();
      expect(id).toBeDefined();
    });
    
    runs(function() {
      Person.load(id, {
        failure: function(record, operation) {
          person = null;
        },
        success: function(record, operation) {
          person = record;
        }
      });
    });
    
    waits(PAUSE);
  
    runs(function() {
      expect(person).toBeDefined();
      expect(person.getId()).toEqual(id);
    });
  });
  
  it('can delete a Model object', function() {
    var id;
    var person = new Person({ name: 'Ralph', age: 30 });
    
    runs(function() {
      person.save();
    });
    
    waits(PAUSE);
    
    id = person.getId();

    runs(function() {
      Person.load(id, {
        failure: function(record, operation) {
          person = null;
        },
        success: function(record, operation) {
          person = record;
        }
      });
    });
    
    waits(PAUSE);
    
    runs(function() {
      person.destroy();
    });
    
    waits(PAUSE);
    
    runs(function() {
      Person.load(id, {
        failure: function(record, operation) {
          person = null;
        },
        success: function(record, operation) {
          person = record; // this is the expected path; record should be undefined
        }
      });
    });
    
    waits(PAUSE);
    
    runs(function() {
      expect(person).toBeUndefined();
    });

  });
});