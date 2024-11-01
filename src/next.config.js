const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public', // Dove verrà generato il service worker
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
});
