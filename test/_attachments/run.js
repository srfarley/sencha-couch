
var Application = null;

Ext.onReady(function() {
  Application = Ext.create('Ext.app.Application', {
    name: 'SenchaCouchSpecRunner',

    launch: function() {
      jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
      jasmine.getEnv().execute();
    }
  });
});
