/*
This code is a JavaScript code that uses the Stripe API and Firebase Authentication and Firestore to create a new user account with a Stripe account ID. The code listens for the DOMContentLoaded event, then initializes the Stripe object with a test API key. It then gets the HTML form elements and listens for form submission. When the form is submitted, it retrieves the form data (email, password, username, and full name) and creates a new user account using Firebase's createUserWithEmailAndPassword method.

After successfully creating the user account, it creates a new seller account with the Stripe API using the provided email address, and stores the Stripe account ID in the user's Firestore document. The user is then redirected to the account creation page on the Stripe dashboard using the accountLink URL provided in the response. If there's an error during the sign-up process, the error message is displayed in an alert box.

The commented-out code block is an alternate implementation of the signUp function that uses async/await instead of promises for more concise and readable code.
*/
document.addEventListener("DOMContentLoaded", () => {
  // stripe = fetch('https://js.stripe.com/v3/');
  // Get elements
  var stripe = Stripe(
    "pk_test_51MviyWLyNWm6SqnzwehOoQnEGazzGElJPhB0WBQhA0OTi87OrYhDrBssUgaQtzRTfEZrt68fndvNaVEORKRwxjic00VFx93FxP"
  );
  const signupForm = document.getElementById("signup");
  const FnameInput = document.getElementById("fname");
  const UnameInput = document.getElementById("uname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("pw");

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     // User is already logged in, redirect to the home page
  //     alert(`Already signed in as ${user.email}`);
  //     window.location = "index";
  //   }
  // });

  // Sign up function
  const signUp = (email, password, Uname, Fname) => {
    const seller = {
      email: email,
      type: "standard",
      country: "US",
    };

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up successfully
        const user = userCredential.user;

        fetch("http://localhost:4000/accountID", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seller),
        })
          .then(function (result) {
            return result.json();
          })
          .then(function (data) {
            const sellerAccountID = data.accountID;
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                name: Fname,
                username: Uname,
                email: email,
                sellerAccountID: sellerAccountID,
              })
              .then(() => {
                console.log(user);
                window.location.href = data.accountLink.url;
                // window.location = "index";
              })
              .catch((error) => {
                alert(error.message);
              });
          });
      })

      .catch((error) => {
        // Failed to sign up
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  // Handle form submission
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const Uname = UnameInput.value;
    const Fname = FnameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    signUp(email, password, Uname, Fname);
  });
});

// firebase
//     .firestore()
//     .collection("users")
//     .doc(firebase.auth().currentUser.uid)
//     .get()
//     .then(
//       doc => {
//           seller = {
//             email: doc.data()['email'],
//             type: 'standard',
//             country: 'US',
//           };

//           account = await stripe.accounts.create({
//             type: seller.type,
//             email: seller.email,
//             country: seller.country,
//           });
//           sellerAccountID = account.id;
//       }
//     )

//     // Get elements
// const signupForm = document.getElementById("signup");
// const FnameInput = document.getElementById('fname');
// const UnameInput = document.getElementById('uname');
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("pw");

// // Sign up function
// const signUp = async (email, password, Uname, Fname) => {
//   try {
//     // Create a new user
//     const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
//     const user = userCredential.user;

//     // Create a Stripe account for the user
//     const seller = {
//       email: email,
//       type: 'standard',
//       country: 'US',
//     };
//     const account = await stripe.accounts.create({
//       type: seller.type,
//       email: seller.email,
//       country: seller.country,
//     });
//     const sellerAccountID = account.id;

//     // Store the Stripe account ID in the user's Firestore document
//     await firebase.firestore().collection("users").doc(user.uid).set({
//       name: Fname,
//       username: Uname,
//       email: email,
//       sellerAccountID: sellerAccountID, // Add the Stripe account ID to the document
//     });

//     // Redirect to the home page
//     window.location = "index";
//   } catch (error) {
//     // Failed to sign up
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     alert(errorMessage);
//   }
// };

// // Handle form submission
// signupForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const Uname = UnameInput.value;
//   const Fname = FnameInput.value;
//   const email = emailInput.value;
//   const password = passwordInput.value;
//   signUp(email, password, Uname, Fname);
// });
