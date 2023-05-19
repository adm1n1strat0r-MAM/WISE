/*
This is a JavaScript code that adds event listeners to various elements and handles form submission. Here is a summary of what it does:

    It waits for the DOMContentLoaded event to be fired before executing the code.
    It gets references to various elements on the page using their IDs.
    It adds an event listener to the sign-out button to handle user sign-out.
    It defines a function named submitFORM that takes in various input values and uploads a file to Firebase Storage.
    It defines a function named priceCheck that checks whether the entered price is less than or equal to a maximum price, and disables the continue button if the price is too high.
    It adds an event listener to the price input element to handle price validation.
    It uses Firebase Authentication to check whether a user is logged in and redirects them to the login page if they are not.
    It adds an event listener to the form element to handle form submission.
    It retrieves the selected option from a dropdown list and gets the user's last attempt from Firestore database to determine the maximum price allowed for the gig.
    It submits the form data to Firestore database and redirects the user to the homepage after successful submission.

Overall, this code is responsible for handling user input, validating input, and submitting the form data to a database.

*/
document.addEventListener("DOMContentLoaded", () => {
  // Get elements

  const selectElement = document.getElementById("fields");
  const sellerForm = document.getElementById("sellerForm");
  const gigTitle = document.getElementById("gigTitle");
  const address = document.getElementById("address");
  const dob = document.getElementById("dob");
  const languages = document.getElementById("languages");
  const freeform = document.getElementById("freeform");
  const price = document.getElementById("price");
  var maxPrice = 0;
  var percentage = 0;

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      alert("Not Logged In");
      window.location = "http://localhost:4000/login";
    }
  });

  const submitFORM = (
    selectedValue,
    gigTitle,
    address,
    dob,
    languages,
    myFile,
    freeform,
    price
  ) => {
    // Generate a unique name for the file to prevent overwriting
    const fileName =
      firebase.auth().currentUser.uid + "_" + Date.now() + "_" + myFile.name;

    const fileRef = firebase.storage().ref().child(fileName);

    // Upload the file to the storage bucket
    fileRef
      .put(myFile)
      .then((snapshot) => {
        // Get the download URL of the file
        fileRef
          .getDownloadURL()
          .then((url) => {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                department:
                  firebase.firestore.FieldValue.arrayUnion(selectedValue),
                gigTitle: firebase.firestore.FieldValue.arrayUnion(gigTitle),
                address: address,
                dob: dob,
                languages: languages,
                price: firebase.firestore.FieldValue.arrayUnion(price),
                about: firebase.firestore.FieldValue.arrayUnion(freeform),
                image: firebase.firestore.FieldValue.arrayUnion({
                  name: fileName,
                  url: url,
                }),
              })
              .then(() => {
                console.log("File metadata stored in Firestore");
                window.location = "http://localhost:4000/index";
              })
              .catch((error) => {
                console.error(
                  "Error storing file metadata in Firestore: ",
                  error
                );
                alert(error);
              });
          })
          .catch((error) => {
            console.error("Error getting download URL: ", error);
            alert(error);
          });
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
        alert(error);
      });
  };

  function priceCheck(event) {
    const price = event.target.value;
    const continueButton = document.getElementById("continue-button");
    if (price > maxPrice) {
      const priceWarn = document.getElementById("priceWarn");
      priceWarn.innerHTML = `Price cannot be greater than ${maxPrice}`;
      continueButton.disabled = true;
      continueButton.style.backgroundColor = "black";
      continueButton.style.cursor = "wait";
    } else {
      continueButton.disabled = false;
      priceWarn.innerHTML = ``;
      continueButton.style.backgroundColor = "#550e1f";
      continueButton.style.cursor = "pointer";
    }
  }

  price.addEventListener("input", priceCheck);

  setTimeout(() => {
    const selectedValue =
      selectElement.options[selectElement.selectedIndex].value;
    const db = firebase.firestore();
    const users = db.collection("users");
    users
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        for (var i in doc.data()["lastAttempt"]) {
          if (
            doc.data()["lastAttempt"][i]["name"] == selectedValue &&
            doc.data()["lastAttempt"][i]["percentage"] > 50
          ) {
            percentage = doc.data()["lastAttempt"][i]["percentage"];

            if (percentage > 50 && percentage < 70) maxPrice = 50;
            else if (percentage < 80 && percentage >= 70) maxPrice = 200;
            else if (percentage < 90 && percentage >= 80) maxPrice = 500;
            else if (percentage >= 90) maxPrice = 1000;
          }
        }
      });
  }, 1000);

  // Handle form submission
  sellerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedValue_ =
      selectElement.options[selectElement.selectedIndex].value;
    const gigTitle_ = gigTitle.value;
    const address_ = address.value;
    const dob_ = dob.value;
    const languages_ = languages.value;
    const freeform_ = freeform.value;
    const myFile = document.getElementById("myFile").files[0];
    const price_ = price.value;
    submitFORM(
      selectedValue_,
      gigTitle_,
      address_,
      dob_,
      languages_,
      myFile,
      freeform_,
      price_
    );
  });
});
