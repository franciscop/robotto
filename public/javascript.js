const ms = new MediaSource();
const video = dom.video[0];
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

console.log(video);

// Make sure mp4 mime is supported
if (!MediaSource.isTypeSupported(mimeCodec)) {
  alert('Your browser does not support MP4');
}

const socket = io();

video.addEventListener('canplaythrough', e => console.log('PLAYIN'));

video.src = window.URL.createObjectURL(ms);
ms.addEventListener('sourceopen', sourceOpen);

function sourceOpen(e) {
  let mediaSource = this;
  let sourceBuffer = ms.addSourceBuffer(mimeCodec);
  let queue = [];
  let i = 0;
  socket.on('stream', data => {
    queue.push(data);
    if (i === 0) {
      frame();
    }
    i++;
    console.log(data);
    // sourceBuffer.appendBuffer(data);
  });

  const frame = function() {
    console.log('Called!');
    if (queue.length) {
      sourceBuffer.appendBuffer(queue.shift());
    }
  };

  sourceBuffer.addEventListener('updateend', frame, false);
};

ms.addEventListener('sourceclose', function(e) {console.log("SOURCE CLOSED");}, false);
