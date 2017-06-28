const WebStreamerServer = require('./lib/raspivid');
require('server')(3000).then(ctx => {
  new WebStreamerServer(ctx.server);
});

process.on('uncaughtException', e => {
  console.log('MANAGED:', e);
});
