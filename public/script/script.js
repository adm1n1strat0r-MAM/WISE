/*
This is a JavaScript code block that adds event listeners to buttons with specific IDs, checks if the user is authenticated with Firebase authentication, and hides or shows the appropriate buttons depending on the user's authentication state.

When the DOM is fully loaded, the code gets references to three buttons with IDs "signout-button", "signup-button", and "signin-button". It then adds an event listener to the Firebase authentication state change, which fires whenever the user logs in or logs out.

If there is no user, meaning the user is not logged in, the "signout-button" is hidden. Otherwise, if the user is logged in, the "signup-button" and "signin-button" are hidden and an event listener is added to the "signout-button". When the "signout-button" is clicked, it signs the user out of Firebase authentication and reloads the page.

Overall, this code is likely part of a larger application that uses Firebase authentication to manage user login and logout functionality.
*/

document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.getElementById("signup-button");
  const signinButton = document.getElementById("signin-button");
  const signoutButton = document.getElementById("signout-button");
  const mygigButton = document.getElementById("mygigs-button");
  const inboxButton = document.getElementById("inbox-button");
  const signedinButton = document.getElementById("signedin-button");
  


  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // User is not logged in
      signoutButton.style.display = "none";
      mygigButton.style.display = "none";
      inboxButton.style.display = "none";
      signedinButton.style.display = "none";
      
      

    } else {
      signupButton.style.display = "none";
      signinButton.style.display = "none";
      
      signoutButton.addEventListener("click", (e) => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            // Sign-out successful.
            window.location = "http://localhost:4000/"
          })
          .catch((error) => {
            // An error happened.
            console.error(error);
          });
      });
    }
  });


  const db = firebase.firestore();
  element = document.getElementById("customerSuppport");
element.addEventListener("click", (e) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // User is already logged in, redirect to the home page
      alert("Not Logged In");
      window.location = "login";
    }
  });
  const email = 'admin@wisework.com';
  const message = window.prompt("Please enter your message:");

  if (message != "") {
    const currentUserID = firebase.auth().currentUser.uid;
    const users = db.collection("users");
    const chats = db.collection("chats");
    var userID;
    let found = false;

    users
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();

          if (email == data["email"] && found == false) {
            userID = doc.id;
            console.log(userID);
            found = true;
            return;
          }
        });
      })
      .then(() => {
        chats
          .doc()
          .set({
            message: message,
            senderID: currentUserID,
            receiverID: userID,
            timestamp:
              firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            window.location = "http://localhost:4000/chat";
          });
      });
  }
});

});
