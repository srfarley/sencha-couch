SenchaCouch v0.1
================

SenchaCouch is a small JavaScript library containing the classes necessary for serving [Ext
JS](http://www.sencha.com/products/extjs/) and [Sencha Touch](http://www.sencha.com/products/touch/)
web applications and data from a common [CouchDB](http://couchdb.apache.org/) server. This is ideal
for browser-based applications that need storage for JSON objects. CouchDB, along with the use of
[CouchApp](couchapp.org), also acts as the server for the application's static assets (JavaScript,
CSS, HTML, images, etc.).

**NOTE**: SenchaCouch has been tested with Ext JS 4.0.7. Testing with Sencha Touch is forthcoming.
Sencha Touch's base classes are similar enough where it might work out of the box, or with minor
changes.

Running The Specs
-----------------

The specs are run using Jasmine, and hosted from a CouchDB server using CouchApp.  This is the  excepted deployment configuration of an application using SenchaCouch.

1. Install CouchDB, create a database called `sencha_couch_test`.  Install CouchApp.  If you did not install CouchDB to localhost, modify `test/.couchapprc` to point to the correct database.  These instructions assume localhost.

1. Due to license restrictions, Ext JS cannot be included as part of this project, so [download](http://www.sencha.com/products/extjs/download) your own distribution and copy the ext-all-dev.js file into the `test/_attachments/lib/extjs` directory.

1. Change to the `test` directory and run `couchapp push local` to copy the Jasmine specs to CouchDB.

1. Browse to `http://localhost:5984/sencha_couch_test/_design/test/run.html`, and the specs will launch immediately.

Acknowledgements
----------------
- Shaun Avery
- Guy on Sencha Forum

License
-------

Copyright 2012 Steven R. Farley

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
