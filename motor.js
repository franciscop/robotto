const gpio = require('./gpio');

let stable = false;

module.exports = (a, b, c) => ({
  forward: async () => {
    await gpio(a).on();
    await gpio(b).off();
    await gpio(c).to(450);
    stable = 'forward';
    setTimeout(() => {
      if (stable === 'forward') {
        gpio(c).to(350);
      }
    }, 500);
  },
  backward: async () => {
    await gpio(a).off();
    await gpio(b).on();
    await gpio(c).to(450);
    stable = 'backward';
    setTimeout(() => {
      if (stable === 'backward') {
        gpio(c).to(350);
      }
    }, 500);
  },
  stop: async () => {
    await gpio(a).off();
    await gpio(b).off();
    stable = false;
  }
});
