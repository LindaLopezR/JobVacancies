import bodyParser from 'body-parser';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

const PostPicker = Picker.filter(function (req) {
  return req.method === 'POST';
});

const GetPicker = Picker.filter(function (req) {
  return req.method === 'GET';
});

PostPicker.route('/api/v1/login', function(params, req, res) {
  const json = req.body;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(Meteor.call('endpointLogin', json)));
});

GetPicker.route('/api/v1/getVacancies', function (params, req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointVacancies')));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});

PostPicker.route('/api/v1/completeVacancy', function(params, req, res) {
  const json = req.body;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(Meteor.call('newNomination', json)));
});

GetPicker.route('/api/v1/getNominationsByUser/:userId', function (params, req, res) {
  let userId = params.userId;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointGetNominations', userId)));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});
