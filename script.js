let user = null;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      user = userCredential.user;
      document.getElementById("relayContainer").style.display = "block";
      startReadingStatus();
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    user = null;
    location.reload();
  });
}

function toggleRelay(relayNum) {
  const db = firebase.database();
  const relayRef = db.ref('Relays/relay' + relayNum);
  relayRef.once('value').then(snapshot => {
    const currentState = snapshot.val();
    relayRef.set(!currentState);
  });
}

function turnAllOff() {
  const db = firebase.database();
  for (let i = 1; i <= 4; i++) {
    db.ref('Relays/relay' + i).set(false);
  }
}

function startReadingStatus() {
  const db = firebase.database();
  for (let i = 1; i <= 4; i++) {
    db.ref('Relays/relay' + i).on('value', snapshot => {
      document.getElementById('status' + i).innerText =
        'Status: ' + (snapshot.val() ? 'ON' : 'OFF');
    });
  }
}
