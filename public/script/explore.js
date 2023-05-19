/* 

This is a JavaScript code snippet that retrieves data from a Firebase Firestore database and dynamically generates HTML elements to display the data on a web page. The code starts with an event listener that triggers when the DOM content is loaded. Then, it initializes a connection to the Firebase Firestore database and gets a reference to the "users" collection. It also gets references to some HTML elements on the page, including a container element for the generated job listings and an element that contains a filter option for exploring projects.

Next, the code executes a query to retrieve all the documents from the "users" collection, and then it iterates over each document to retrieve and process the data. For each document, the code checks if the value of "exploreType" matches "all-projects" or a specific department. If it matches "all-projects", it generates HTML elements for all the jobs listed in that document. If it matches a specific department, it generates HTML elements only for the jobs listed in that department.

Finally, the code adds event listeners to the dynamically generated HTML elements to handle user interactions. Specifically, it adds a click event listener to the "email" element, which prompts the user to enter a message and then saves the message to a new document in the "chats" collection of the Firestore database. The new document contains the message, the ID of the sender, the ID of the receiver, and a timestamp. Once the document is saved, the code redirects the user to a chat page.

*/

document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();
  const users = db.collection("users");
  const jobsGrid = document.getElementById("jobs-grid");
  const exploreType = document.getElementById("exploreType").innerHTML;
  console.log(exploreType);

  users
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let email = doc.data()["email"];

        let data = doc.data();

//         if (exploreType == "all-projects") {
//           for (let i in data["department"]) {
//             let jobListItem = `
//                         <div class="job-preview">
//                             <div class="job-thumbnail" >
//                             <a href="Checkout?email=${email}&amount=${data["price"][i]}&jobTitle=${data["gigTitle"][i]}" style="text-decoration: none; color: black;">
//                                 <span class="job-checkout">
//                                 <img class="thumbnail-img" src=${data["image"][i]["url"]} /> 
                                
//                                 <div class="job-description">
//                                 <b>${data["gigTitle"][i]}</b>
//                                 </br>
//                                 <b>Price: ${data["price"][i]}$</b>
//                                 </span>
//                             </a>
//                                 <div class="job-author email" style="cursor: pointer;">${email}</div>
//                             </div>
//                         </div>
//                     `;
//             jobsGrid.innerHTML += jobListItem;
//           }
//         } else {
//           for (let i in data["department"]) {
//             if (data["department"][i] == exploreType) {
//               let jobListItem = `
//                         <div class="job-preview">
//                             <div class="job-thumbnail">
//                             <a href="../Checkout?email=${email}&amount=${data["price"][i]}&jobTitle=${data["gigTitle"][i]}" style="text-decoration: none; color: black;">
//                                 <span class="job-checkout">
//                                 <img class="thumbnail-img" src=${data["image"][i]["url"]} /> 
                                
//                                 <div class="job-description">
//                                 <b>${data["gigTitle"][i]}</b>
                
//                                 <b>${data["price"][i]}$</b>
//                                 </span>
//                             </a>
//                                 <div class="job-author email" style="cursor: pointer;">${email}</div>
//                             </div>
//                         </div>
//                     `;
//               jobsGrid.innerHTML += jobListItem;
//             }
//           }
//         }
//       });
//     })
//     .then(() => {
//       setTimeout(() => {
//         const allEmails = document.getElementsByClassName("email");
//         const jobCheckout = document.getElementsByClassName("job-checkout");

//         Array.from(allEmails).forEach((element) => {
//           element.addEventListener("click", (e) => {
//             const email = e.target.innerText;
//             const message = window.prompt("Please enter your message:");
//             if (message != "") {
//               const currentUserID = firebase.auth().currentUser.uid;
//               const users = db.collection("users");
//               const chats = db.collection("chats");
//               var userID;
//               let found = false;

//               users
//                 .get()
//                 .then((querySnapshot) => {
//                   querySnapshot.forEach((doc) => {
//                     let data = doc.data();

//                     if (email == data["email"] && found == false) {
//                       userID = doc.id;
//                       console.log(userID);
//                       found = true;
//                       return;
//                     }
//                   });
//                 })
//                 .then(() => {
//                   chats
//                     .doc()
//                     .set({
//                       message: message,
//                       senderID: currentUserID,
//                       receiverID: userID,
//                       timestamp:
//                         firebase.firestore.FieldValue.serverTimestamp(),
//                     })
//                     .then(() => {
//                       window.location = "http://localhost:4000/chat";
//                     });
//                 });
//             }
//           });
//         });
//       }, 700);
//     });
// });



if (exploreType == "all-projects") {
  for (let i in data["department"]) {
    let jobListItem = `
                <div class="job-preview">
                    <div class="job-thumbnail" >
                    <a href="Checkout?email=${email}&amount=${data["price"][i]}&jobTitle=${data["gigTitle"][i]}" style="text-decoration: none; color: black;">
                        <span class="job-checkout">
                        <img class="thumbnail-img" src=${data["image"][i]["url"]} /> 
                        
                        <div class="job-description">
                        <b>${data["gigTitle"][i]}</b>
                        </br>
                        <b>Price: ${data["price"][i]}$</b>
                        </span>
                    </a>
                         <button class="btn card_btn">Read More</button>
                        </div>
                </div>
            `;
    jobsGrid.innerHTML += jobListItem;
  }
} else {
  for (let i in data["department"]) {
    if (data["department"][i] == exploreType) {
      let jobListItem = `
                <div class="job-preview">
                    <div class="job-thumbnail">
                    <a href="../Checkout?email=${email}&amount=${data["price"][i]}&jobTitle=${data["gigTitle"][i]}" style="text-decoration: none; color: black;">
                        <span class="job-checkout">
                        <img class="thumbnail-img" src=${data["image"][i]["url"]} /> 
                        
                        <div class="job-description">
                        <b>${data["gigTitle"][i]}</b>
        
                        <b>${data["price"][i]}$</b>
                        </span>
                    </a>
                        <div class="job-author email" style="cursor: pointer;">${email}</div>
                    </div>
                </div>
            `;
      jobsGrid.innerHTML += jobListItem;
    }
  }
}
});
})
.then(() => {
setTimeout(() => {
const allEmails = document.getElementsByClassName("email");
const jobCheckout = document.getElementsByClassName("job-checkout");

Array.from(allEmails).forEach((element) => {
  element.addEventListener("click", (e) => {
    const email = e.target.innerText;
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
}, 700);
});
});
// used to fetch email
//<div class="job-author email" style="cursor: pointer;">${email}</div>
