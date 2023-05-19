/* 
    The DOMContentLoaded event listener waits for the page to fully load before executing the code inside it.
    The code initializes the Firebase Firestore database, and sets variables for the HTML elements that will be used in the chat application.
    The onAuthStateChanged listener checks if the user is logged in. If the user is not logged in, they are redirected to the login page.
    If the user is logged in, the code retrieves the current user ID and creates a JS_OBJECT object to store the chat names and emails.
    The code then retrieves the chats collection from the Firestore database and iterates over the documents to retrieve the chat details.
    If the chat involves the current user, the code retrieves the other user's name and email and stores them in the JS_OBJECT object.
    The code then populates the allChats div with the chat names and emails stored in the JS_OBJECT object.
    The code adds an event listener to each chat name in the allChats div that retrieves the messages between the current user and the selected user.
    When the event listener is triggered, the code retrieves the messages collection from the Firestore database and iterates over the documents to retrieve the messages between the selected user and the current user.
    The code then populates the UserMessages div with the retrieved messages.
    Finally, the code adds an event listener to the chat form that sends the message typed in by the current user to the Firestore database.
*/

document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const admin = urlSearchParams.get("admin");
  if(admin == "true"){
    const navbar = document.getElementById("navbar");
    const footer = document.getElementById("footer");
    navbar.style.display = "none";
    footer.style.display = "none";

  }
  const allChats = document.getElementById("allChats");
  const chatName = document.getElementById("chatName");
  const UserMessages = document.getElementById("UserMessages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatButton = document.getElementById("chat-button");

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // User is already logged in, redirect to the home page
      alert("Not Logged In");
      window.location = "login";
    } else {
      const userID = firebase.auth().currentUser.uid;
      console.log(userID)
      const users = db.collection("users");
      const chats = db.collection("chats");
      const JS_OBJECT = new Object();

      chats
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((chatsDoc) => {
            let receiverID = chatsDoc.data()["receiverID"];
            let senderID = chatsDoc.data()["senderID"];
            if (senderID == receiverID) {
            } else if (receiverID == userID || senderID == userID) {
              let tempID =
                receiverID == userID
                  ? chatsDoc.data()["senderID"]
                  : chatsDoc.data()["receiverID"];
              users
                .doc(tempID)
                .get()
                .then((usersDoc) => {
        
                  let email = usersDoc.data().email;
                  let name = usersDoc.data().name;
                  JS_OBJECT[email] = name;
                });
            }
          });
        })
        .then(() => {
          setTimeout(() => {
            for (let email in JS_OBJECT) {
              const tempAllChats = `<div class="list-group-item list-group-item-action border-0" style="cursor: pointer;">
                                                                <div class="d-flex align-items-start">
                                                                    <img src="./graphic design img/homan.png" class="rounded-circle mr-1" width="40" height="40" />
                                                                    <div class="flex-grow-1 ml-3 allChatNames">
                                                                    ${JS_OBJECT[email]} <br>${email}
                                                                    </div>
                                                                </div>
                                                            </div>`;
              allChats.innerHTML += tempAllChats;
            }
          }, 700);
        })
        .then(() => {
          setTimeout(() => {
            const allChatNames =
              document.getElementsByClassName("allChatNames");
            var userID = "";
            var currentUserID = "";
            // Loop through each element and add event listener
            Array.from(allChatNames).forEach((element) => {
              element.addEventListener("click", (e) => {
                UserMessages.innerHTML = ``;

                const lines = e.target.innerText.split("\n");
                const name = lines[0];
                const email = lines[1];
                chatName.innerHTML = name;

                currentUserID = firebase.auth().currentUser.uid;
                const users = db.collection("users");
                const chats = db.collection("chats");

                let found = false;

                users
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      let data = doc.data();

                      if (email == data["email"] && found == false) {
                        userID = doc.id;
                        found = true;
                        return;
                      }
                    });
                  })
                  .then(() => {
                    chats
                      .orderBy("timestamp")
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          const data = doc.data();
                          const messageSender = data["senderID"];
                          const messageReceiver = data["receiverID"];
                          if (messageSender == messageReceiver) return;
                          if (
                            (currentUserID == messageSender &&
                              messageReceiver == userID) ||
                            (currentUserID == messageReceiver &&
                              messageSender == userID)
                          ) {
                            const messageTimestamp = data["timestamp"];
                            const message = data["message"];

                            const date = new Date(
                              messageTimestamp.seconds * 1000
                            );
                            const hours = date.getHours();
                            const minutes = date.getMinutes();

                            const amOrPm = hours >= 12 ? "pm" : "am";
                            const formattedTime = `${hours % 12}:${
                              minutes < 10 ? "0" : ""
                            }${minutes} ${amOrPm}`;

                            if (currentUserID == messageSender) {
                              UserMessages.innerHTML += `<div class="chat-message-right pb-4">
                                                    <div>
                                                    <img src="./graphic design img/homan.png" class="rounded-circle mr-1" alt="Chris Wood" width="40"
                                                        height="40" />
                                                    <div class="text-muted small text-nowrap mt-2">
                                                        ${formattedTime}
                                                    </div>
                                                    </div>
                                                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                    <div class="font-weight-bold mb-1">You</div>
                                                    ${message}
                                                    </div>
                                                    </div>`;
                            }
                            if (currentUserID == messageReceiver) {
                              UserMessages.innerHTML += `<div class="chat-message-left pb-4">
                                                <div>
                                                <img src="./graphic design img/homan.png" class="rounded-circle mr-1" alt="Sharon Lessman"
                                                    width="40" height="40" />
                                                <div class="text-muted small text-nowrap mt-2">
                                                    ${formattedTime}
                                                </div>
                                                </div>
                                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                                <div class="font-weight-bold mb-1">${name}</div>
                                                ${message}
                                                </div>
                                                </div>`;
                            }
                            return;
                          }
                        });
                      });
                  });
              });
            });

            chatForm.addEventListener("submit", (e) => {
              if (currentUserID == "" || userID == "") return;
              e.preventDefault();
              const message = chatInput.value;
              if (message != "") {
                chats
                  .doc()
                  .set({
                    message: message,
                    senderID: currentUserID,
                    receiverID: userID,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    chatInput.value = ``;
                    const now = new Date();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const amOrPm = hours >= 12 ? "PM" : "AM";
                    const twelveHourFormat = (((hours + 11) % 12) + 1)
                      .toString()
                      .padStart(2, "0");
                    const timeString = `${twelveHourFormat}:${minutes
                      .toString()
                      .padStart(2, "0")} ${amOrPm}`;

                    UserMessages.innerHTML += `<div class="chat-message-right pb-4">
                                <div>
                                <img src="./graphic design img/homan.png" class="rounded-circle mr-1" alt="Chris Wood" width="40"
                                    height="40" />
                                <div class="text-muted small text-nowrap mt-2">
                                    ${timeString}
                                </div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                <div class="font-weight-bold mb-1">You</div>
                                ${message}
                                </div>
                                </div>`;

                    return;
                  });
              }
            });
          }, 700);
        });
    }
  });
});
