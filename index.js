const server = require('server');
const { get, socket } = server.router;
const motor = require('./motor');
const stream = require('./lib/raspivid');

const motorL = motor(0, 2);
const motorR = motor(4, 5);

server({ socket: { path: '/io'} }, [
  socket('left', async ctx => {
    console.log('LEFT');
    await Promise.all([
      motorR.forward(),
      motorL.backward()
    ]);
  }),
  socket('right', async ctx => {
    console.log('RIGHT');
    await Promise.all([
      motorL.forward(),
      motorR.backward()
    ]);
  }),
  socket('forward', async ctx => {
    console.log('FORWARD');
    await Promise.all([
      motorL.forward(),
      motorR.forward()
    ]);
    ctx.socket.emit('ahead')
  }),
  socket('backward', async ctx => {
    console.log('BACKWARD');
    await Promise.all([
      motorL.backward(),
      motorR.backward()
    ]);
  }),
  socket('stop', async ctx => {
    console.log('STOP');
    await Promise.all([
      motorL.stop(),
      motorR.stop()
    ]);
  })
]).then(ctx => { new stream(ctx.server); });

const { exec } = require('child_process');

process.on('uncaughtException', err => {
  if (err.code === 'ENOTCONN') {
    exec('pkill raspivid');
  }
});
