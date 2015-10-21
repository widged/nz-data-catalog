var ElectronApp = require('../src/lib/electron/electron_boilerplate/electron_app');

ElectronApp.load(
  'file://' + __dirname + '/index.html',
  '../src/lib/electron/react-devtools'
);
