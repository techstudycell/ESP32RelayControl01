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
  const relayRef = db.ref('Relays/relay' + relayNum);  // make sure it's lowercase if your DB uses `relay1`

  relayRef.once('value')
    .then(snapshot => {
      const currentState = snapshot.val();
      relayRef.set(!currentState)
        .then(() => {
          console.log(`Relay ${relayNum} toggled to ${!currentState}`);
        })
        .catch(error => {
          console.error(`Failed to set relay${relayNum}:`, error);
          alert("Write error: " + error.message);
        });
    })
    .catch(error => {
      console.error(`Failed to read relay${relayNum}:`, error);
      alert("Read error: " + error.message);
    });
}


function turnAllOff() {
  const db = firebase.database();
  for (let i = 1; i <= 4; i++) {
    db.ref('Relays/relay' + i).set(false)
      .then(() => {
        console.log(`Relay ${i} turned OFF`);
      })
      .catch(error => {
        console.error(`Failed to turn OFF relay${i}:`, error);
        alert(`Error turning off relay${i}: ` + error.message);
      });
  }
}


function startReadingStatus() {
  const db = firebase.database();
  for (let i = 1; i <= 4; i++) {
    db.ref('Relays/relay' + i).on('value', snapshot => {
      const status = snapshot.val();
      document.getElementById('status' + i).innerText = 'Status: ' + (status ? 'ON' : 'OFF');
    }, error => {
      console.error(`Error reading relay${i} status:`, error);
      alert(`Realtime read error for relay${i}: ` + error.message);
    });
  }
}

