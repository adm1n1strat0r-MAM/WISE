document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const users = db.collection("users");
    const mygigs = document.getElementById("mygigs");
    setTimeout(() => {
        var cards = ``;
        var jobListItem = `<div class="card-deck" style="margin-top: 3rem;">`;
        users
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        console.log(doc.exists);
        
          let email = doc.data()["email"];
  
          let data = doc.data();
        var j=0;
        
        for (let i in data["department"]) {
            if(j==4){
                console.log(cards)
                jobListItem += `${cards}</div>
                                <div class="card-deck" style="margin-top: 3rem;">
                                `;
                
                cards = ``;
                j=0;
            }
           
            
            cards += `
            
                <div class="card">
                    <img class="card-img-top" src=${data["image"][i]["url"]} style="width:360px; height:250px">
                    <div class="card-body">
                        <h5 class="card-title">${data["gigTitle"][i]}</h5>
                        <p class="card-text">${data["about"][i]}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">${data["price"][i]}$</small>
                    </div>
                </div>
           
                    `;
            
            j++;
            
        }
        console.log(cards)
        jobListItem += `${cards} </div>`;
        mygigs.innerHTML +=  jobListItem;
      })
    }, 1000);
    
      
  });
  
