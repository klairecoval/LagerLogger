const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ errpr: 'An error occurred.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Name, age, and height are all required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();

  domoPromise.then(() => {
    res.json({ redirect: '/maker' });
  });

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'RAWR! Domo name required to delete' });
  }

  return Domo.DomoModel.deleteById(req.body.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error ocurred' });
    }

    return res.status(200).json({ msg: 'Domo deleted successfully' });
  });
};

module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.makerPage = makerPage;
module.exports.deleteDomo = deleteDomo;
