
describe("CRUD Operations", function() {
  
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
  
  var store = new Ext.data.Store({
    model: 'Person'
  });
  
  var operates = function(func) {
    runs(func);
    waits(500);
  };
  
  afterEach(function () {
    operates(function() {
      store.load(function() {
        Ext.each(store.getRange(), function(person) {
          person.destroy();
        });
      });
    });
  });
  
  it('can create and load a new Model object', function() {
    var id;
    var rev;
    
    var person = new Person({ name: 'Ralph', age: 30 });
    id = person.getId();
    expect(id).toBeFalsy();

    operates(function() {
      person.save();
    });
      
    runs(function() {
      id = person.getId();
      rev = person.get('_rev');
      expect(id).toBeDefined();
      expect(person.get('_id')).toBe(id);
      expect(rev).toBeDefined();
      expect(person.get('name')).toBe('Ralph');
      expect(person.get('age')).toBe(30);
    });
    
    operates(function() {
      person = null;
      Person.load(id, {
        success: function(record, operation) {
          person = record;
        }
      });
    });
  
    runs(function() {
      expect(person).toBeDefined();
      expect(person.getId()).toBe(id);
      expect(person.get('_id')).toBe(id);
      expect(person.get('_rev')).toBe(rev);
      expect(person.get('name')).toBe('Ralph');
      expect(person.get('age')).toBe(30);
    });
  });
  
  it('can update an existing Model object', function() {
    var id;
    var rev;
    var person = new Person({ name: 'Ralph', age: 31 });
    
    operates(function() {
      person.save();
    });
    
    operates(function() {
      id = person.getId();
      rev = person.get('_rev');
      person = null;
      Person.load(id, {
        success: function(record, operation) {
          person = record;
        }
      });
    });

    operates(function() {
      person.set('name', 'Fred');
      person.set('age', 21);
      person.save();
    });    
    
    operates(function() {
      person = null;
      Person.load(id, {
        success: function(record, operation) {
          person = record;
        }
      });
    });
    
    runs(function() {
      expect(person).toBeDefined();
      expect(person.getId()).toBe(id);
      expect(person.get('_rev')).toBeDefined();
      expect(person.get('_rev')).toNotBe(rev);
      expect(person.get('name')).toBe('Fred');
      expect(person.get('age')).toBe(21);
    });
        
  });

  it('can delete a Model object', function() {
    var found;
    var id;
    var person = new Person({ name: 'Ralph', age: 32 });
    
    operates(function() {
      person.save();
    });

    operates(function() {
      id = person.getId();
      person = null;
      Person.load(id, {
        success: function(record, operation) {
          person = record;
        }
      });
    });
    
    operates(function() {
      person.destroy();
    });
    
    operates(function() {
      person = null;
      Person.load(id, {
        success: function(record, operation) {
          found = true;
        },
        failure: function() {
          found = false;
        }
      });
    });
    
    runs(function() {
      expect(found).toBe(false);
    });
  });
  
  it('can load all Model objects using a Store', function() {
    var person1 = new Person({ name: 'Ralph', age: 33 });
    var person2 = new Person({ name: 'Jane', age: 43 });
    var person3 = new Person({ name: 'David', age: 53 });
    var allPeople = null;
    
    operates(function() {
      person1.save();
      person2.save();
      person3.save();
    });
    
    operates(function() {
      store.load(function() {
        allPeople = store.getRange();
      });
    });
    
    runs(function() {
      expect(allPeople.length).toBe(3);
    });
  });
});