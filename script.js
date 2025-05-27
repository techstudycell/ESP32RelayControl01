let user = null;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("✅ Login successful", userCredential.user);
      document.getElementById("relayContainer").style.display = "block";
    })
    .catch((error) => {
      console.error("❌ Login failed", error.message);
    });
}


function logout() {
  firebase.auth().signOut().then(() => {
    user = null;
    location.reload();
  });
}

function toggleRelay(relayNumber) {
  const relayPath = "Relays/relay" + relayNumber;
  const relayRef = firebase.database().ref(relayPath);

  relayRef.once("value")
    .then(snapshot => {
      const currentValue = snapshot.val();
      const newValue = !currentValue;

      relayRef.set(newValue)
        .then(() => {
          console.log(`✅ Relay ${relayNumber} toggled to ${newValue}`);
        })
        .catch(error => {
          console.error(`❌ Failed to write to Firebase for Relay ${relayNumber}:`, error);
        });

    })
    .catch(error => {
      console.error(`❌ Failed to read Firebase value for Relay ${relayNumber}:`, error);
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

