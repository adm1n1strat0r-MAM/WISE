/*
 
This code is adding an event listener to the "DOMContentLoaded" event, which fires when the initial HTML document has been completely loaded and parsed, and the browser has constructed the Document Object Model (DOM) tree.

Inside the event listener function, the code first initializes a connection to the Firestore database, and then retrieves a reference to the "users" collection in the database. It also retrieves a reference to two DOM elements with the IDs "homepage-top-gigs" and "Image-box2".

The code then defines a variable called "tempHTML" and sets its initial value to a string containing the HTML code for an opening "card-deck" div tag.

Next, the code retrieves all the documents in the "users" collection using the "get" method, and loops through the resulting "querySnapshot" object using the "forEach" method. For each document, the code retrieves the data associated with that document using the "data" method, and then loops through the "department" field in that data using a "for...in" loop.

Inside the "for...in" loop, the code builds a string called "temp" containing the HTML code for a Bootstrap "card" component, using data from the current document. The code then appends this "temp" string to the "tempHTML" string. The "break" statement ensures that only the first job in each user's department is added to the "tempHTML" string.

After the "forEach" loop completes, the code appends the closing "card-deck" div tag to the "tempHTML" string, and then adds the resulting HTML code to the "homepage-top-gigs" DOM element using its "innerHTML" property.

 */

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);



document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();
  const users = db.collection("users");
  const jobsGrid = document.getElementById("homepage-top-gigs");
  let container = document.getElementById("Image-box2");

  tempHTML = `<div class="card-deck"  style="margin:0px 50px;">`;

  users.get().then((querySnapshot) => {
    var j = 0;
    querySnapshot.forEach((doc) => {
      let data = doc.data();

      for (let i in data["department"]) {
        let temp = `
          <div id="slider-container">
            <div class="slider">
                <div class="card">
                  <img class="card-img-top" src="${data["image"][i]["url"]}" style="width:200px; height:200px;">
                  <div class="card-body">
                    <h5 class="card-title">${data["gigTitle"][i]}</h5>
                  </div>
                </div>
            </div>
          </div>
        `;
        tempHTML += temp;

        break;
      }
      j++;
    });
    tempHTML += `
        </div>`;
    jobsGrid.innerHTML += tempHTML;
  });
});

$(document).ready(function () {
  $('.slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev">Previous</button>',
    nextArrow: '<button type="button" class="slick-next">Next</button>',
  });
});

