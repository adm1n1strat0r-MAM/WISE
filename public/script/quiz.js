/*
This code is a JavaScript program that allows a user to take a quiz. The code listens for the "DOMContentLoaded" event, which means the page has finished loading, and then checks whether the user is logged in using Firebase Authentication. If the user is not logged in, they are redirected to the login page.

The code then loads a quiz from a JSON file using jQuery's getJSON method, which makes an HTTP GET request for the quiz data. The quiz is then rendered to the DOM using the HTML and CSS contained within the loopHtml variable.

The quiz consists of a series of multiple-choice questions. The user can navigate through the questions using the "Next" button, which is bound to a click event listener. When the user selects an answer for each question and clicks the final "Next" button, the selected options are collected and compared against the correct answers in the quiz. The user's score is calculated and displayed, and the user is given the option to retake the quiz if they score below a certain threshold.

The code uses Firebase Firestore to store information about the user's quiz attempts. When the user completes the quiz, their score is stored in the database along with a timestamp. If the user attempts the quiz again within a certain timeframe, they are notified that they cannot retake the quiz. If the user attempts the quiz again after the allotted time has passed, they are allowed to retake the quiz.
*/

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // User is already logged in, redirect to the home page
      alert("Not Logged In");
      window.location = "http://localhost:4000/login";
    }
  });
  var quiz;
  var selectedValue;
  const randomNumber = Math.floor(Math.random() * 3) + 1;

  // Use the random number to select a quiz
  if (randomNumber === 1) {
    quiz = "quiz1";
  } else if (randomNumber === 2) {
    quiz = "quiz";
  } else {
    quiz = "quiz3";
  }

  $.getJSON(`../${quiz}.json`, function (data) {
    quiz = data;
    console.log(quiz);
  })
    .done(function () {
      console.log("JSON data loaded successfully");
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error("Error fetching quiz data:", error);
    });
  const totalQuestions = 10;
  const wrapper = document.getElementById("quiz");
  const wrapperTemp = document.getElementById("wrapper");
  const container = document.getElementById("container")
  const next0 = document.getElementById("next0");

  next0.addEventListener("click", function () {
    const db = firebase.firestore();
    const users = db.collection("users");
    selectedValue = document.getElementById("fields").value;
    console.log("Selected value: " + selectedValue);

    users
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        for (var i in doc.data()["lastAttempt"]) {
          if (
            doc.data()["lastAttempt"][i]["name"] == selectedValue &&
            doc.data()["lastAttempt"][i]["percentage"] <= 50
          ) {
            var timestamp = doc.data()["lastAttempt"][i]["timestamp"];

            const currentTime = new Date();

            timestamp = new Date(
              timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
            );
            var timeDifference = currentTime - timestamp;
            var months = timeDifference / (1000 * 60 * 60 * 24 * 30.44);

            console.log(currentTime);
            console.log(timestamp);
            console.log(months);
            // Compare the timestamp in the database with the current time
            if (months > 2) {
              alert("You can attempt the quiz again.");
            } else {
              alert("You cannot attempt the quiz again.");
              window.location = "http://localhost:4000/index";
            }
          }
        }
      });

    for (var i = 0; i < totalQuestions; i++) {
      var loopHtml = ``;
      loopHtml += `
            <div class="wrap" id="q${i + 1}" style="margin-left:50px;">
            <div class="text-center pb-4">
              
            </div>
            <div class="h4 font-weight-bold">
              ${i + 1}. ${quiz[selectedValue]["questions"][i]["question"]}
            </div>
            <div class="pt-4">
              <form style="margin-bottom:50px;">
                `;

      for (
        var j = 0;
        j < quiz[selectedValue]["questions"][i]["options"].length;
        j++
      ) {
        if (j == 0) {
          loopHtml += `
                    <label class="options" style="margin-left:50px;"
                    >${quiz[selectedValue]["questions"][i]["options"][j]} <input type="radio" name="radio" value="${quiz[selectedValue]["questions"][i]["options"][j]}" checked/>
                    <span class="checkmark"></span>
                    </label></br>
                        `;
        } else {
          loopHtml += `
                    <label class="options" style="margin-left:50px;"
                        >${quiz[selectedValue]["questions"][i]["options"][j]} <input type="radio" name="radio" value="${quiz[selectedValue]["questions"][i]["options"][j]}"/>
                        <span class="checkmark"></span>
                    </label></br>
                        `;
        }
      }
      wrapperTemp.style.display = 'none';
      container.style.visibility = 'visible'
      if(i == totalQuestions-1){
        loopHtml += `
              </form>
              </div>
              <div class="d-flex justify-content-center pt-2" style="margin-top:50px;margin-bottom:50px;">
              <button class="btn btn-primary" id="next${i + 1}">
                  Submit 
              </button>
              </div>
            </div>
                `;
      }
      else{
      loopHtml += `
              </form>
                
            </div>
                `;
      }
      wrapper.innerHTML += loopHtml;
    }

    var questions = [];
    for (var i = 0; i <= totalQuestions; i++) {
      var question = document.getElementById("q" + i);
      questions.push(question);
    }

    // Generate an array of next buttons
    var nextButtons = [];
    for (var i = 0; i <= totalQuestions; i++) {
      var nextButton = document.getElementById("next" + i);
      nextButtons.push(nextButton);
    }


    nextButtons[totalQuestions].addEventListener("click", function () {
      collectSelectedOptions();
    });

    questions[0].style.left = "-650px";
    questions[1].style.left = "15px";
  });

  function collectSelectedOptions() {
    var correctAnswers = 0;
    var selectedOptions = []; // Array to store selected options
    var forms = document.getElementsByTagName("form"); // Get all form elements

    // Loop through each form
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      var options = form.getElementsByTagName("input"); // Get all input elements in the form

      // Loop through each input element
      for (var j = 0; j < options.length; j++) {
        var option = options[j];

        // Check if the input is a radio button and is checked
        if (option.type === "radio" && option.checked) {
          // Push the selected option value to the selectedOptions array
          selectedOptions.push(option.value);
        }
      }
    }

    for (var i = 0; i < totalQuestions; i++) {
      if (quiz[selectedValue]["questions"][i]["answer"] == selectedOptions[i]) {
        correctAnswers++;
      }
    }

    var percentage = (correctAnswers / totalQuestions) * 100;
    var currentTimestamp = new Date();
    const objectToAddOrUpdate = {
      name: selectedValue,
      timestamp: currentTimestamp,
      percentage: percentage,
    };
    var name;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid);
    docRef.get().then((doc) => {
      
        name = doc.data().name;
    })

    firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(docRef).then((doc) => {
          if (doc.exists) {
            // Get the current array
            const lastAttemptArray = doc.data().lastAttempt || [];

            // Find the index of the object with the same name in the array
            const index = lastAttemptArray.findIndex(
              (item) => item.name === selectedValue
            );

            if (index === -1) {
              // If name does not exist, add the object to the array
              lastAttemptArray.push(objectToAddOrUpdate);
            } else {
              // If name exists, update the object in the array
              lastAttemptArray[index] = objectToAddOrUpdate;
            }

            // Update the document with the modified array
            transaction.update(docRef, { lastAttempt: lastAttemptArray });
          } else {
            console.error("Document does not exist");
          }
        });
      })
      .then(() => {
        if (percentage <= 50) {
          alert(
            "Your test score was below 50%. You can try again after 2 months"
          );
          window.location = "http://localhost:4000/index";
        } else {
          var myObject = {
            percentage: percentage, 
            selectedValue: selectedValue,
            name: name,
            date: new Date().toISOString()
        };
        
          var jsonString = JSON.stringify(myObject);
         
          
          var url = "http://localhost:4000/result?data=" + encodeURIComponent(jsonString);
          window.location = url
          // alert("Congratulations! You have passed the test");
          // window.location = `http://localhost:4000/seller/${selectedValue}`;
        }
      })
      .catch((error) => {
        console.error(
          "Error updating document with new or modified object in the array:",
          error
        );
      });

    // firebase
    //     .firestore()
    //     .collection("users")
    //     .doc(firebase.auth().currentUser.uid)
    //     .update({
    //         lastAttempt: firebase.firestore.FieldValue.arrayUnion({
    //             name: selectedValue,
    //             timestamp: currentTimestamp,
    //             percentage: percentage
    //             })
    //         })
    //     .then(()=>{
    //         if(percentage <= 50){
    //             alert('Your test score was below 50%. You can try again after 2 months');
    //             window.location = "index";
    //         }
    //         else{
    //             alert('Congratulations! You have passed the test');
    //             window.location = `seller/${selectedValue}`;
    //         }

    //     }).catch((error)=>{
    //         alert(error.message);
    //     })
  }
});
