SenchaCouch v0.1
================

SenchaCouch is a small JavaScript library containing the classes necessary for hosting [Sencha Ext
JS](http://www.sencha.com/products/extjs/) web applications from an [Apache
CouchDB](http://couchdb.apache.org/) server. CouchDB serves both static assets (JavaScript, CSS,
HTML, images, etc.) and handles all RESTful data operations, so no other server-side resources are
necessary. This is ideal for web applications that need reliable online storage for JSON objects.
[CouchApp](http://couchapp.org) can be used to facilitate deployment of the application to CouchDB servers.

**NOTE**: SenchaCouch has been tested with Ext JS 4.0.7. Testing with [Sencha
Touch](http://www.sencha.com/products/touch/) is forthcoming. Sencha Touch's data classes are
similar enough where it might work with minor changes.

Running The Specs
-----------------
The specs are run using Jasmine. The spec runner is a web application hosted by a CouchDB server,
and deployed using CouchApp. This is the excepted deployment configuration of an application using
SenchaCouch, and serves as an example of how to develop and deploy your own application.

1. Install CouchDB. Create a database called `sencha_couch_test`.

1. Install CouchApp. If you did not install CouchDB to localhost, modify `test/.couchapprc` to point
to the correct database. These instructions assume localhost is being used.

1. Due to license restrictions, Ext JS cannot be included as part of this project. You should
[download](http://www.sencha.com/products/extjs/download) your own distribution and copy the
ext-all-dev.js file into the `test/_attachments/lib/extjs` directory.

1. Change to the `test` directory and run `couchapp push local` to copy the application to CouchDB.

1. Browse to `http://localhost:5984/sencha_couch_test/_design/test/run.html`. The specs will launch
immediately.

Acknowledgements
----------------

- I was inspired to develop this project after watching Shane Avery's [fantastic video
  tutorials](http://averydc.com/ee/index.php/blog/couchdb_extjs4_a_winning_combination) on combining
  Ext JS and CouchDB. Thanks, Shane!
  
- Thanks also to Clint Harris, who posted some [very helpful code](
  http://www.sencha.com/forum/showthread.php?152106-Model.save%28%29-breaks-if-server-doesn-t-respond-with-updated-record-data)
  on the Sencha Forum.

License
-------

Copyright 2012 Steven R. Farley

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions and limitations under the
License.
