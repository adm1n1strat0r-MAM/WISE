/*
This is a block of JavaScript code that handles user sign-in authentication using Firebase. It first listens for the DOMContentLoaded event to ensure that the entire HTML document has been loaded before executing the code. It then gets the signin form element from the HTML document and adds an event listener to the form submission.

The firebase.auth().onAuthStateChanged method is used to check if the user is already logged in by listening to changes in the authentication state. If the user is already logged in, the code will redirect the user to the home page.

The signIn function is called when the user submits the form. It takes the user's email and password as arguments and uses the firebase.auth().signInWithEmailAndPassword method to sign in the user. If the sign-in is successful, the user will be redirected to the home page. If it fails, an error message will be displayed using the alert method.
*/

var adminEmail = "admin@wisework.com";
var adminPassword = "admin123";

document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signin");

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     // User is already logged in, redirect to the home page
  //     alert(`Already signed in as ${user.email}`);
  //     window.location = "index";
  //   }
  // });
  // Sign in function
  const signIn = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log(email);
        console.log(password);

        if(email == adminEmail){
          window.location = "admin";
        }
        else{
          window.location = "index"; // Redirect to the home page
        }
      })
      .catch((error) => {
        // Failed to sign in
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  // Handle form submission
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("pw");
    const email = emailInput.value;
    const password = passwordInput.value;
    signIn(email, password);
  });
});
