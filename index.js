const server = require('server');
const { get, socket } = server.router;
const motor = require('./motor');
const stream = require('./lib/raspivid');

// TODO: change the pins (speed, dir)
const motorL = motor(1, 0);
const motorR = motor(23, 2);

// const arm = {
//   vertical: motor(a, b),
//   pendular: motor(a, b),
//   claw: motor(a, b)
// };

server({ socket: { path: '/io'} }, [
  socket('left', async ctx => {
    console.log('LEFT');
    await Promise.all([
      motorR(50),
      motorL(-50)
    ]);
  }),
  socket('right', async ctx => {
    console.log('RIGHT');
    await Promise.all([
      motorL(50),
      motorR(-50)
    ]);
  }),
  socket('forward', async ctx => {
    console.log('FORWARD');
    await Promise.all([
      motorL(30),
      motorR(30)
    ]);
    ctx.socket.emit('ahead')
  }),
  socket('backward', async ctx => {
    console.log('BACKWARD');
    await Promise.all([
      motorL(-30),
      motorR(-30)
    ]);
  }),

  // // ROBOT ARM
  // socket('up', async ctx => {
  //   console.log('BACKWARD');
  //   await Promise.all([
  //     motorL(-30),
  //     motorR(-30)
  //   ]);
  // }),

  // EVERYTHING
  socket('stop', async ctx => {
    console.log('STOP');
    await Promise.all([
      motorL(0),
      motorR(0)
    ]);
  })
]).then(ctx => { new stream(ctx.server); });

const { exec } = require('child_process');

process.on('uncaughtException', err => {
  if (err.code === 'ENOTCONN') {
    exec('pkill raspivid');
  }
});
