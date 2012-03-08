/*
 * SenchaCouch is a small JavaScript library containing the classes necessary for hosting Sencha Ext
 * JS web applications from an Apache CouchDB server. CouchDB serves both static assets (JavaScript,
 * CSS, HTML, images, etc.) and handles all RESTful data operations, so no other server-side
 * resources are necessary. This is ideal for web applications that need reliable online storage for
 * JSON objects. CouchApp can be used to facilitate deployment of the application to CouchDB servers.
 *
 * Copyright 2012 Steven R. Farley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ext.define('SenchaCouch.Model', {
  extend: 'Ext.data.Model',

  fields: [{
    name: '_id',
    type: 'string'
  },{
    name: '_rev',
    type: 'string'
  }],
  
  idProperty: '_id'
});


Ext.define('SenchaCouch.Writer', {
  extend: 'Ext.data.writer.Json',
  alias: 'writer.couchdb',

  // TODO: these properties are all defaults - should they be defined just in case?
  allowSingle: true,
  encode: false,
  writeAllFields: true,
  root: undefined,
  
  getRecordData: function(record) {
    var data =  this.callParent(arguments);
    
    // Remove falsey _id and _rev properties before writing the object.  This is necessary
    // when POSTing a new object to CouchDB because Ext seems to insist on always writing
    // these two properties, even if they are not initially defined on the object.    
    if (!data._id) {
      delete data._id;
    }
    if (!data._rev) {
      delete data._rev;
    }
    
    // Assign the Ext class so view map functions can differentiate in a mixed-document database.
    // Example map function:
    //   function(doc) {
    //     if (doc.class === 'My.Ext.ClassName') {
    //       emit(null, null);
    //     }
    //   }
    data.class = Ext.getClassName(record);
    
    return data;
  }
});


Ext.define('SenchaCouch.Reader', {
  extend: 'Ext.data.reader.Json',
  alias: 'reader.couchdb',
  
  root: 'rows',
  record: 'doc',
  successProperty: 'ok',
  totalProperty: 'total_rows',
  
  readRecords: function(data) {
    if (!Ext.isDefined(data.rows)) {
      var wrappedData = {
        rows: [{ doc: data }]
      };
      return this.callParent([wrappedData]);
    } else {
      return this.callParent([data]);
    }
  }
});


Ext.define('SenchaCouch.Proxy', {
  extend: 'Ext.data.proxy.Rest',
  alias : 'proxy.couchdb',
  
  constructor: function(config) {
    var databaseUrl = config.databaseUrl || '/';
    var databaseName = config.databaseName || 'your_database';
    var designName = config.designName || 'your_design_name';
    var viewName = config.viewName || 'your_view_name';

    this.restUrl = '/' + databaseName;
    this.viewUrl = '/' + databaseName + '/_design/' + designName + '/_view/' + viewName;
    
    Ext.apply(config, {
      url: databaseUrl,
      api: {
        create: this.restUrl,
        read: this.restUrl,
        update: this.restUrl,
        destroy: this.restUrl
      },
      appendId: true,
      noCache: true,
      filterParam: undefined,
      groupParam: undefined,
      limitParam: undefined,
      pageParam: undefined,
      sortParam: undefined,
      startParam: undefined,
      reader: {
        type: 'couchdb'
      },
      writer: {
        type: 'couchdb'
      }
    });

    this.callParent(arguments);
  },
  
  // This method is overridden to switch between loading a single object or executing a query using a CouchDB view.
  read: function(operation, callback, scope) {
    if (!operation.id) {
      try {
        this.api.read = this.viewUrl;
        // CouchDB will include the entire document with the 'include_docs' parameter.
        Ext.apply(this.extraParams, { 'include_docs': true });
        
        console.log('*** read using view: ' + this.api.read);
        this.callParent(arguments);
      } finally {
        this.api.read = this.restUrl;
        // The proxy should not keep the 'include_docs' parameter around for subsequent requests.
        Ext.destroyMembers(this.extraParams, 'include_docs');
      }
    } else {
      console.log('*** read using load: ' + this.api.read + ' with id ' + operation.id);
      this.callParent(arguments);
    }
  },
  
  // This is a work-around.  Ext JS expects the PUT request to return the object, but Couchdb only returns
  // the id and the new revision.
  // Borrowed from http://www.sencha.com/forum/showthread.php?152106-Model.save%28%29-breaks-if-server-doesn-t-respond-with-updated-record-data
  update: function(operation, callback, scope) {
    var callbackWrapper = function(op) {
      op.resultSet = undefined;
      // The new rev must be applied to the object that was updated.
      if (op.response) {
        // errors will not have a response object
        op.records[0].data._id = Ext.JSON.decode(op.response.responseText).id; // just for the create case, but harmless for update
        op.records[0].data._rev = Ext.JSON.decode(op.response.responseText).rev;
      }
      callback(op);
    };

    return this.doRequest(operation, callbackWrapper, scope);
  },

  create: function(operation, callback, scope) {
    return this.update(operation, callback, scope);
  },

  // This method is overridden to support CouchDB's requirement to specify a revision of the object to delete.
  destroy: function(operation, callback, scope) {
    try {
      // CouchDB expects a specific revision to be defined as the 'rev' parameter.
      Ext.apply(this.extraParams, { 'rev': operation.getRecords()[0].get('_rev') });
      this.callParent(arguments);
    } finally {
      // The proxy should not keep the 'rev' parameter around for subsequent requests.
      Ext.destroyMembers(this.extraParams, 'rev');
    }
  }
});
