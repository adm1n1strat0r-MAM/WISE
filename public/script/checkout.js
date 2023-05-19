/* 

This is a JavaScript code that creates a Stripe payment form using the Stripe API. It listens for the DOMContentLoaded event 
and then retrieves the seller's account ID and the payment amount from the URL parameters. It then sends a POST request to the 
server to create a payment intent and retrieve the client secret. Once the client secret is received, it initializes the Stripe 
Elements card and sets up an event listener for the payment form submission. When the form is submitted, it calls the payWithCard 
function, which uses the client secret to confirm the payment using Stripe's API. If the payment is successful, it shows a success 
message and redirects the user to the home page. If there is an error, it shows the error message to the user. Finally, it also 
includes some helper functions to show loading spinners and handle UI changes.

*/
document.addEventListener("DOMContentLoaded", () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const db = firebase.firestore();
  const users = db.collection("users");
  const jobDetails = document.getElementById("card");
  const sellerEmail = urlSearchParams.get("email");
  const jobTitle = urlSearchParams.get("jobTitle");
  users
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let email = doc.data()["email"];

        let data = doc.data();

        if (email == sellerEmail) {
          for (let i in data["department"]) {
            if(jobTitle == data["gigTitle"][i]){
              let jobListItem = `

              <nav style="background-color: #550e1f " class="navbar navbar-expand-lg navbar-light">
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                <a class="navbar-link" href="index" style="font-size: 2rem;color:white;">Wise Work</a>
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" href="explore">Explore</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" id="inbox-button" href="chat">Inbox</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" href="quiz">Become a seller</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" id="mygigs-button" href="mygigs">My Gigs</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" id="signup-button" href="signup_card">Sign Up</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" id="signin-button" href="login">Sign In</a>
                  </li>
                  <li class="nav-item">
                    <a style="color:white; margin-left:20px" class="navbar-link" id="signout-button">Sign Out</a>
                  </li>
                </li>
                <li class="nav-item">
                  <a style="color:white; margin-left:20px" id="signedin-button" href="#"<i style="font-size:24px; margin-left: 2600%;" class='fas'>&#xf2bd;</i></a>
                </li>
                  
                </ul>
                
              </div>
            </nav> 
                       
                          <img class="card-img-top" src=${data["image"][i]["url"]} alt="Card image cap" style="width:30%; height:10%; margin-top:4%; margin-left:3%; box-shadow: 5px 5px 5px lightgrey; float:left;">
                          <div class="card-body">
                            <h5 style="width:30%" class="card-title">${jobTitle}</h5>
                            <p style="width:30%; height:10%; margin-top:4%; margin-left:3%;" class="card-text">${data["about"][i]}</p>
                            <p style="width:30%; height:10%; margin-top:4%; margin-left:3%;" class="card-text"><small class="text-muted">Price: ${data["price"][i]}$ </br> <b>Quiz Percentage: ${data["lastAttempt"][i]['percentage']}%</b> </small></p>
                            
                          </div>
                        
                        
                    `;
                    jobDetails.innerHTML += jobListItem;
            }
            
            
          }
        } 
        
      });
    })
  })













document.addEventListener("DOMContentLoaded", () => {
  // This is your test publishable API key.
  var stripe = Stripe(
    "pk_test_51MviyWLyNWm6SqnzwehOoQnEGazzGElJPhB0WBQhA0OTi87OrYhDrBssUgaQtzRTfEZrt68fndvNaVEORKRwxjic00VFx93FxP"
  );
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sellerEmail = urlSearchParams.get("email");
  const amount = urlSearchParams.get("amount");
  var sellerAccountID;
  var purchase;
  var elements;
  var style;
  document.querySelector("button").disabled = true;
  firebase
    .firestore()
    .collection("users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (sellerEmail == doc.data()["email"]) {
          sellerAccountID = doc.data()["sellerAccountID"];
        }
      });
    })
    .then(() => {
      purchase = {
        sellerAccountID: sellerAccountID,
        amount: amount,
      };
      console.log("purchase: ", purchase);
    })
    .then(() => {
      fetch("http://localhost:4000/Checkout/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          sellerAccountID: sellerAccountID,
        }),
      })
        .then(function (result) {
          return result.json();
        })
        .then(function (data) {
          elements = stripe.elements();
          style = {
            base: {
              color: "#32325d",
              fontFamily: "Arial, sans-serif",
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#32325d",
              },
            },
            invalid: {
              fontFamily: "Arial, sans-serif",
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          };
          document.querySelector("button").disabled = false;
          var card = elements.create("card", { style: style });
          // Stripe injects an iframe into the DOM
          card.mount("#card-element");

          card.on("change", function (event) {
            // Disable the Pay button if there are no card details in the Element
            document.querySelector("button").disabled = event.empty;
            document.querySelector("#card-error").textContent = event.error
              ? event.error.message
              : "";
          });

          var form = document.getElementById("payment-form");
          form.addEventListener("submit", function (event) {
            event.preventDefault();
            // Complete payment when the submit button is clicked
            payWithCard(stripe, card, data.clientSecret);
          });
        });
    });

  // Calls stripe.confirmCardPayment
  // If the card requires authentication Stripe shows a pop-up modal to
  // prompt the user to enter authentication details without leaving your page.
  var payWithCard = function (stripe, card, clientSecret) {
    loading(true);
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        },
      })
      .then(function (result) {
        if (result.error) {
          // Show error to your customer
          showError(result.error.message);
        } else {
          // The payment succeeded!
          orderComplete(result.paymentIntent.id);
        }
      });
  };

  /* ------- UI helpers ------- */

  // Shows a success message when the payment is complete
  var orderComplete = function (paymentIntentId) {
    loading(false);

    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;
    setTimeout(() => {
      window.location = "http://localhost:4000/";
    }, 2000);
  };

  // Show the customer the error from Stripe if their card fails to charge
  var showError = function (errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function () {
      errorMsg.textContent = "";
    }, 4000);
  };

  // Show a spinner on payment submission
  var loading = function (isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };
});
