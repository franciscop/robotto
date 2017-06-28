const server = require('server');
const { file } = server.reply;
const nc = new (require('netcat/client'))();
const ffmpeg = require('fluent-ffmpeg');

const wait = time => new Promise(resolve => setTimeout(resolve, time));

// console.log(nc.addr('192.168.1.39').port(8888).connect().stream());

// ffmpeg(nc.addr('192.168.1.39').port(8888).connect().stream())
//   .videoCodec('libx264')
//   .on('data', function() {
//     console.log('DATA');
//   })
//   .output('./outputfile.mp4');

// Create a read stream thingy
const stream = (ip, port = 8888) => nc.addr(ip).port(port).connect();

const sendStream = async io => {
  stream('192.168.1.43').on('data', data => io.emit('stream', data));
};

server(ctx => {
  sendStream(ctx.io);
  return file('index.html');
});
