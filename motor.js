const gpio = require('./gpio');

module.exports = (a, b) => ({
  forward: async () => {
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
