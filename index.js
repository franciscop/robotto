const server = require('server');
const { get, socket } = server.router;
const { motor, stream } = require('./raspberry');

// TODO: change the pins (speed, dir)
const motorL = motor(1, 0);
const motorR = motor(23, 2);

server({ socket: { path: '/io' } }, [
  socket('left', async ctx => {
    console.log('LEFT');
    await Promise.all([
      motorR.to(0.6),
      motorL.to(-0.6)
    ]);
  }),
  socket('right', async ctx => {
    console.log('RIGHT');
    await Promise.all([
      motorL.to(0.6),
      motorR.to(-0.6)
    ]);
  }),
  socket('forward', async ctx => {
    console.log('FORWARD');
    await Promise.all([
      motorL.to(0,5),
      motorR.to(0,5)
    ]);
    ctx.socket.emit('ahead')
  }),
  socket('backward', async ctx => {
    console.log('BACKWARD');
    await Promise.all([
      motorL.to(-0.5),
      motorR.to(-0.5)
    ]);
  }),
  socket('stop', async ctx => {
    console.log('STOP');
    await Promise.all([
      motorL.to(0),
      motorR.to(0)
    ]);
  })
]).then(ctx => { new stream(ctx.server); });

const { exec } = require('child_process');

process.on('uncaughtException', err => {
  if (err.code !== 'ENOTCONN') return;
  exec('pkill raspivid');
});
