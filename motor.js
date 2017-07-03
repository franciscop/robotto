const gpio = require('./gpio');

module.exports = (a, b, c) => ({
  forward: async () => {
    await gpio(a).on();
    await gpio(b).off();
    await gpio(c).to(0.2);
  },
  backward: async () => {
    await gpio(a).off();
    await gpio(b).on();
    await gpio(c).to(0.2);
  },
  stop: async () => {
    await gpio(a).off();
    await gpio(b).off();
  }
});
