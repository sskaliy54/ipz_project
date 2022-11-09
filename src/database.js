const { getData, setData, removeData } = require('./firebase');

async function login(login, password, users, ws) {
    if(Object.keys(users).includes(login)) return 'user_logined';
    let response = '';
    const data = await getData(`Users/${login}`);
    if(data) {
        if(data.password === password) {
            users[login] = ws;
            console.log(`User ${login} is connected.\n`);
            response = `true`;
        }
        else {
            response = 'wrong_password'
        }
    } 
    else {
      response = 'missing_login';
    }
    return response;
}
  
async function registration(login, password, users, ws) {
    let response = '';
    if(await getData(`Users/${login}`)) {
      response = 'user_exists';
    }
    else {
      let updates = {};
      updates[`Users/${login}/password`] = password;
      await setData(updates);
      users[login] = ws;
      console.log(`User ${login} is connected.\n`);
      response = 'true';
    }
    return response;
}

async function getCards(login) {
    let response = '';
    const cards = await getData(`Users/${login}/Cards`);
    Object.keys(cards).forEach(card => response += `${card}\n`);
    return response.trim();
}

async function addCard(login, number, period, cvv) {
    let response = '';
    const cards = await getData(`Users/${login}/Cards`);
    if(Object.keys(cards).includes(number)) {
        response = 'Дана карта вже добавлена!';
    }
    else {
        let updates = {};
        updates[`Users/${login}/Cards/${number}`] = { period, cvv };
        await setData(updates);
        response = 'true';
    }
    return response;
}

async function removeCard(login, number) {
    await removeData(`Users/${login}/Cards/${number}`);
    return 'Картку видалено!';
}

async function getServices(service) {
    let response = '';
    const services = await getData(`Services/${service}`);
    services.forEach(name => response += `${name}\n`);
    return response.trim();
}

async function statisticsPayment(login, service, provider, score, sum, card) {
    let statistics = await getData(`Users/${login}/Statistics`) || [];
    statistics.push({ 
        service,
        provider, 
        score, 
        sum, 
        card,
        date: formatDate(new Date()) 
    });
    let updates = {};
    updates[`Users/${login}/Statistics`] = statistics;
    await setData(updates);
    return 'true';
}

async function statisticsReplenishment(login, service, phone, sum, card) {
    let statistics = await getData(`Users/${login}/Statistics`) || [];
    statistics.push({ 
        service,
        phone,  
        sum, 
        card,
        date: formatDate(new Date()) 
    });
    let updates = {};
    updates[`Users/${login}/Statistics`] = statistics;
    await setData(updates);
    return 'true';
}

async function getPhone(login) {
    return await getData(`Users/${login}/phone`) || '';
}

async function addPhone(login, phone) {
    let updates = {};
    updates[`Users/${login}/phone`] = phone;
    await setData(updates);
    return 'true';
}

async function getStatistics(login) {
    let response = '';
    let statistics = await getData(`Users/${login}/Statistics`) || [];
    statistics.reverse().forEach(item => response += `${item.date} ${item.service}\n`);
    return response.trim();
}

async function getStatisticsInfo(login, index) {
    let response = '';
    let statistics = await getData(`Users/${login}/Statistics`);
    const { service, provider, phone, score, sum, card, date } =  statistics.reverse()[index];
    response += `Послуга: ${service}\n`;
    if(provider) response += service === 'Оплата комунальних послуг' ? `Компанія: ${provider}\n`: `Провайдер: ${provider}\n`;
    if(score) response += `Особовий рахунок: ${score}\n`;
    if(phone) response += `Номер телефону: ${phone}\n`;
    response += `Сума: ${sum}грн\n`;
    response += `Картка: ${card}\n`;
    response += `Дата: ${date}\n`;
    return response.trim();
}

function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    return dd + '.' + mm + '.' + yy;
}


module.exports = {
    login, 
    registration, 
    getCards,
    addCard,
    removeCard,
    getServices,
    statisticsPayment,
    statisticsReplenishment,
    getPhone,
    addPhone,
    getStatistics,
    getStatisticsInfo
};
