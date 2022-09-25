const ws = require('ws');
const { 
  login, 
  registration, 
  getCards,
  addCard,
  removeCard,
  getServices,
  statisticsPayment,
  statisticsReplenishment,
  getStatistics,
  getStatisticsInfo
} = require('./database.js');


const port = process.env.PORT || 3000;
const wss = new ws.Server({
  port,
}, () => console.log(`Server started on ${port}\n`));

let users = {};

wss.on('connection', (ws) => {
  ws.onmessage = async req => {
    let resp = '';
    const data = JSON.parse(req.data);

    if(data.func === 'login') {
      resp = await login(data.login, data.password, users, ws);
    }
    if(data.func === 'registration') {
      resp = await registration(data.login, data.password);
    }
    if(data.func === 'getCards') {
      resp = await getCards(data.login);
    }
    if(data.func === 'addCard') {
      resp = await addCard(data.login, data.number, data.period, data.cvv);
    }
    if(data.func === 'removeCard') {
      resp = await removeCard(data.login, data.number);
    }
    if(data.func === 'getServices') {
      resp = await getServices(data.service);
    }
    if(data.func === 'statisticsPayment') {
      resp = await statisticsPayment(data.login, data.service, data.provider, data.score, data.sum, data.card);
    }
    if(data.func === 'statisticsReplenishment') {
      resp = await statisticsReplenishment(data.login, data.service, data.phone, data.sum, data.card);
    }
    if(data.func === 'getStatistics') {
      resp = await getStatistics(data.login);
    }
    if(data.func === 'getStatisticsInfo') {
      resp = await getStatisticsInfo(data.login, data.index);
    }

    console.log(output(data)); 
    console.log(`Respond:\n${resp}\n`);
    ws.send(resp);
  };

  ws.onclose = () => {
    const login = getLogin(users, ws);
    if(login) {
      delete users[login];
      console.log(`${login} is disconnected.\n`);
    }
  }
});

function output(data) {
  console.log('New request:');
  for(let key in data) {
    if(!data[key]) delete data[key]
  }
  return data;
}

function getLogin(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}