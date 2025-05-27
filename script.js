// Check user login status
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("✅ User authenticated:", user.email);
    document.getElementById("relayContainer").style.display = "block";
  } else {
    console.warn("⚠️ No user is signed in.");
    document.getElementById("relayContainer").style.display = "none";
  }
});

// Login function
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("✅ Login successful", userCredential.user);
      // UI visibility handled by onAuthStateChanged
    })
    .catch((error) => {
      console.error("❌ Login failed:", error.message);
    });
}

// Logout function
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("🚪 Logged out successfully");
    document.getElementById("relayContainer").style.display = "none";
  }).catch((error) => {
    console.error("❌ Logout failed:", error.message);
  });
}

// Toggle individual relay
function toggleRelay(relayNumber) {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.warn("⚠️ User not authenticated");
    return;
  }

  const relayPath = `Relays/relay${relayNumber}`;
  const relayRef = firebase.database().ref(relayPath);

  relayRef.once("value")
    .then(snapshot => {
      const currentValue = snapshot.val();
      const newValue = !currentValue;

      relayRef.set(newValue)
        .then(() => {
          console.log(`✅ Relay ${relayNumber} toggled to ${newValue}`);
          document.getElementById(`status${relayNumber}`).textContent = `Status: ${newValue ? 'ON' : 'OFF'}`;
        })
        .catch(error => {
          console.error(`❌ Failed to write to Firebase for Relay ${relayNumber}:`, error);
        });

    })
    .catch(error => {
      console.error(`❌ Failed to read Firebase value for Relay ${relayNumber}:`, error);
    });
}

// Turn off all relays
function turnAllOff() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.warn("⚠️ User not authenticated");
    return;
  }

  const relaysRef = firebase.database().ref("Relays");
  const offState = {
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false
  };

  relaysRef.set(offState)
    .then(() => {
      console.log("🛑 All relays turned OFF");
      for (let i = 1; i <= 4; i++) {
        document.getElementById(`status${i}`).textContent = "Status: OFF";
      }
    })
    .catch((error) => {
      console.error("❌ Failed to turn all relays OFF:", error);
    });
}
