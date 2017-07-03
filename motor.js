const gpio = require('./gpio');

module.exports = (a, b, c) => ({
  forward: async () => {
    await gpio(c).to(0.2);
    await gpio(a).on();
    await gpio(b).off();
  },
  backward: async () => {
    await gpio(a).off();
    await gpio(b).on();
  },
  stop: async () => {
    await gpio(a).off();
    await gpio(b).off();
  }
});
