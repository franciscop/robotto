const server = require('server');
const stream = require('./lib/raspivid');

server().then(ctx => {
  new stream(ctx.server);
});


const { exec } = require('child_process');

process.on('uncaughtException', err => {
  if (err.code === 'ENOTCONN') {
    exec('pkill raspivid');
  }
});
