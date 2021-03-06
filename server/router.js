const controllers = require('./controllers');
const mid = require('./middleware');

// setup routes from controllers folder
// handle security/login requirements to view content
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/maker', mid.requiresLogin, controllers.Beer.makerPage);
  app.get('/breweries', mid.requiresLogin, controllers.Brewery.breweryPage);
  app.get('/getBeers', mid.requiresLogin, controllers.Beer.getBeers);
  app.get('/getBreweries', mid.requiresLogin, controllers.Brewery.getBreweries);
  app.get('/getPairs', mid.requiresLogin, controllers.Beer.getPairs);
  app.get('/getRecipes', mid.requiresLogin, controllers.Beer.getRecipes);
  app.get('/searchBeer', mid.requiresLogin, controllers.Beer.searchBeer);
  app.get('/searchBrewery', mid.requiresLogin, controllers.Brewery.searchBrewery);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/maker', mid.requiresLogin, controllers.Beer.make);
  app.post('/breweries', mid.requiresLogin, controllers.Brewery.make);
  app.post('/changePassword',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.changePassword);

  app.delete('/deleteBeer', mid.requiresLogin, controllers.Beer.deleteBeer);
  app.delete('/deleteBrewery', mid.requiresLogin, controllers.Brewery.deleteBrewery);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogin, controllers.Account.notFoundPage);
};

module.exports = router;
