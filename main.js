var config = {
  apiKey: 'AIzaSyARilJJF81OY8-dHcXifEupRIMGxOP6QTA',
    authDomain: 'trucker-elements-demo.firebaseio.com',
    databaseURL: 'https://trucker-elements-demo.firebaseio.com',
    projectId: 'trucker-elements-demo'
};

firebase.initializeApp(config);

var db = firebase.firestore();
var items = db.collection('items');
var timer = [];


function startSpeed() {
  failSafe();
  items.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        variableSpeed(doc);
    });
  });
}

function stopSpeed() {
  timer.forEach( t => window.clearInterval(t))
}

function increaseSpeed() {
  timer.forEach( t => window.clearInterval(t))
  items.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      variableSpeedIncrease(doc);
    });
  });
}

function immediateHiSpeed() {
  var hiSpeedValue;
  timer.forEach( t => window.clearInterval(t))
  items.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log('doc.data():', doc.data());
      if (doc.data().name === 'kph') {
        console.log('doc.data().name kph:', doc.data().name);
        hiSpeedValue = 75;
      } else {
        console.log('doc.data().name mph:', doc.data().name);
        hiSpeedValue = 150;
      }
      console.log('doc :', doc);
      const obj = {
        value: hiSpeedValue,
        name: doc.data().name
      }
      items.doc(doc.id).set(obj);
    });
  });
}

function reset() {
  var speedValue;
  timer.forEach( t => window.clearInterval(t))
  items.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log('doc.data() :', doc.data());
      if (doc.data().name === 'kph') {
        speedValue = 26;
      } else {
        speedValue = 78;
      }
      const obj = {
        value: speedValue,
        name: doc.data().name
      }
      items.doc(doc.id).set(obj);
    });
    startSpeed();
  });
}


function variableSpeed(doc) {
  var _timer = window.setInterval(() => {
    if (doc.data().name === 'kph') {
      const min = doc.data().value - 3;
      const max = doc.data().value + 3;
      _speed = Math.floor(Math.random() * (max - min) + min);
    } else {
      const min = doc.data().value - 5;
      const max = doc.data().value + 5;
      _speed = Math.floor(Math.random() * (max - min) + min);
      console.log('_speed :', _speed);
    }
    const obj = {
      value: _speed,
      name: doc.data().name
    }
    items.doc(doc.id).set(obj);
  }, 1000)
  timer.push(_timer);
}

function variableSpeedIncrease(doc) {
  var _timer = window.setInterval(() => {
    items.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var startingSpeed = doc.data().value;
        var _speed = startingSpeed + 3;
        const obj = {
          value: _speed,
          name: doc.data().name
        }
        items.doc(doc.id).set(obj);
      });
    });
  }, 1000)
  timer.push(_timer);
}

function failSafe() {
  // stop writting to firebase after 1 hour
  window.setTimeout(() => {
    timer.forEach( t => window.clearInterval(t))
  }, 3600000);
}
