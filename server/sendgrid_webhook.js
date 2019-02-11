var localtunnel = require('localtunnel');
localtunnel(5000, { subdomain: 'afsfnaoawfna' }, function(err, tunnel) {
  console.log('LT running');
});