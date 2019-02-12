const passport = require ('passport');

module.exports = app => {
  //pretpostavljamo da cemo da je zovemo sa ovim objektom(arrow fju)
  app.get (
    '/auth/google',
    passport.authenticate ('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get (
    '/auth/google/callback',
    passport.authenticate ('google'),
    (req, res) => {
      res.redirect ('/surveys');
    }
  );

  app.get ('/api/logout', (req, res) => {
    req.logout ();
    res.redirect ('/');
  });

  app.get ('/api/currentUser', (req, res) => {
    res.send (req.user);
  });
};
