const ANNOUNCEMENT = "Happy New Year! We just had our New Year's meeting; take a look at our notes <a style='color:white;' href='https://supernorm.al/meeting-on-january-06-2024-21-07-817340f08f05013cb5772ae6e54488fe'>here</a>!"

let navbar = document.createElement('div')
let banner = document.createElement('div')

//fetch("https://api.ipify.org/?format=json").then(d=>d.json()).then(a=>{if(a.ip!=atob("MTk5LjE4MC4xMjEuMTA4")){document.body.innerHTML=`<div style="text-align:center;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><h1>HEY...</h1><h2>Whatcha doin' here? This is still under development.</h2></div>`}})

import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const navigationElements = [
  {
    text: "U.L.B.C",
    link: "/"
  },
  {
    text: "About",
    link: "/about"
  },
  {
    text: "Bio Builder",
    link: "/biobuilder"
  },
  {
    text: "Join Google Chat",
    link: "/chat"
  },
  {
    text: "Leaderboard",
    link: "/leaderboard"
  },
  {
    text: "Website Ideas",
    link: "/website-ideas"
  },
  {
    text: "Merch",
    link: "/merch"
  },
  {
    text: "Newsletter",
    link: "javascript:void(0)"
  }
]






navbar.innerHTML=`<ul class="nvbr"></ul>
<style>ul.nvbr { list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: #333; } ul.nvbr li { float: left; border-right: 1px solid #bbb; } ul.nvbr li a { display: block; color: white; text-align: center; padding: 14px 20px; text-decoration: none; } ul.nvbr li a:hover { background-color: #111; } li:last-child { border-right: none; }</style>`

// banner.style = "width: calc(100%-10px);padding: 10px;background-color: rgb(255, 83, 83);color: white;text-align: center;"
// banner.innerHTML = ANNOUNCEMENT
// uncomment for banner back

/*fetch("https://icanhazdadjoke.com/", {
  headers: {
    'Accept': 'text/plain'
  }
}).then(response => response.text()).then(data => {
  banner.innerText = "Random joke for no reason: "+ data
})*/

navigationElements.forEach(element => {
  navbar.querySelector("ul").innerHTML+=`<li${element.shiftRight?' style="float:right;"':''}><a href="${element.link}">${element.text}</a></li>`
})


// dynamic login/signup button
navbar.querySelector("ul").innerHTML+=`<li id="signupbtn" style="float:right;"><a href="/register/">Sign up</a></li>`
navbar.querySelector("ul").innerHTML+=`<li id="loginbtn" style="float:right;"><a href="/login/">Login</a></li>`

document.body.prepend(navbar)
document.body.prepend(banner) // it's easier to add banner since they're both sitewide

/* FIREBASE INITIALIZATION FOR EACH SITE */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAVN3YOEaRrSyM6qXOKVCO-x4O_F36Bq1o",
  authDomain: "theulbc.firebaseapp.com",
  projectId: "theulbc",
  storageBucket: "theulbc.appspot.com",
  messagingSenderId: "828626896874",
  appId: "1:828626896874:web:976a975791113fb036d493"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();

function getPath(url) {
  let urlObj = new URL(url);
  let path = urlObj.pathname;
  let pathSegments = path.split('/');
  pathSegments = pathSegments.filter(segment => segment !== '');
  return pathSegments;
}
const page = getPath(location.href)[0]
const db = getDatabase()

onValue(ref(db, "newsletterLink"), (l)=>{
  navbar.querySelector('ul').children[7].onclick=function(){location.href=l.val()}
})


/* DEFINE CUSTOM FUNCTIONS FOR CERTAIN PAGES */
switch (page) {
  case 'login':
    loginSuccess = function(email, password) {
      signInWithEmailAndPassword(auth, email, password).then(() => {
        alert("Welcome back!")
        location.href=(document.referrer!="https://www.ulbc.xyz/"&&document.referrer!="https://ulbcwebsite.github.io/")?document.referrer:"/biobuilder"
      }).catch((error) => {
        if (error.code=="auth/user-disabled") {
          get(ref(db, "users")).then((groupOfUsers) => {
            groupOfUsers.forEach(exampleOfAUser => {
              if (exampleOfAUser.val().email == email) {
                get(ref(db, "users/"+exampleOfAUser.key+"/banReason")).then((reason) => {
                  if (reason.exists()) {
                    showError("You have been banned indefinitely. Reason: " + reason.val())
                  } else {
                    showError("You have been banned indefinitely.")
                  }
                })
              }
            })
          })
        } else {
          showError(error.code.split("auth/")[1].replaceAll("-", " ").charAt(0).toUpperCase() + error.code.split("auth/")[1].replaceAll("-", " ").slice(1))
        }
      })
    }
    break
  case 'register':
    registrationSuccess = function(anEmail, aPassword) {
      createUserWithEmailAndPassword(auth, anEmail, aPassword).then((userCredential) => {
        set(ref(db, "users/"+auth.currentUser.uid), {
          bio:'',
          email:anEmail,
          views:0
        }).then(() => {
          alert("CONGRATULATIONS!!!")
          location.href="/biobuilder"
        })
      }).catch((error) => {
        showError(error.code.split("auth/")[1].replaceAll("-", " ").charAt(0).toUpperCase() + error.code.split("auth/")[1].replaceAll("-", " ").slice(1))
      })
    }
    break
  case 'leaderboard':
    onValue(ref(db, "users"), (snapshot) => {
      console.log("SNAPSHOT:",snapshot.val())
      var testThingy=Object.entries(snapshot.val()).map(a=>a[1])
      document.querySelector("ol").innerHTML=''
      var emailsArray = testThingy.map(a=>a.email||"Unidentified User")
      var wordsAmtArray = testThingy.map(a=>a.views)
      var combined = emailsArray.map((word, i) => ({word: word, number: wordsAmtArray[i], uid: Object.keys(snapshot.val())[i], views: testThingy[i].views||0, status: testThingy[i].status||"None"}));
      combined.sort((a, b) => b.number - a.number);
      var sortedEmails = combined.map(item => item.word);
      var sortedNumbers = combined.map(item => item.number);
      sortedEmails.forEach((email, idx) => {
        document.querySelector("ol").innerHTML+=`<li><a href="/profile/?${combined[idx].uid}">`+email+"</a> - "+combined[idx].views+" views</li>"
        if (combined[idx].status != "None") {
          document.querySelector("ol").lastChild.innerHTML+=(" - <span>"+combined[idx].status+"</span>")
          let statusColor
          switch (combined[idx].status) {
            case 'Updated':
              statusColor="rgb(255,83,83)"
              break
            case 'Revamped':
              statusColor="green"
              break
            case 'Inactive':
              statusColor="gray"
              break
            case 'Update coming soon':
              statusColor="orange"
              break
            case 'Minor Update':
              statusColor="dodgerblue"
              break
            default:
              statusColor="black"
              break
          }
          document.querySelector("ol").lastChild.lastChild.style.color=statusColor
        }
      })
    })
    break
  case 'profile':
    let converter = new showdown.Converter()
    let firstTimeLooking=true
    onValue(ref(db, "users/"+location.href.split("?")[1]), (snapshot) => {
      if (snapshot.exists()) {
        if (firstTimeLooking&&auth.currentUser?.uid!=location.href.split("?")[1]) {
          firstTimeLooking=false
          set(ref(db, "users/"+location.href.split("?")[1]+"/views"), (snapshot.val().views||0)+1)
        }
        document.querySelector("h1").innerText=snapshot.val().email
        document.body.style.background=snapshot.val().bioBg||"white"
        document.querySelector("p#bio").innerHTML=snapshot.val().bio!=''?converter.makeHtml(snapshot.val().bio):"This user has not written a Bio yet. Encourage them to start!"
        document.querySelector("h3").innerText="Views: " + snapshot.val().views||0
      } else {
        document.querySelector("h1").innerText="Invalid Link"
        document.querySelector("h3").innerText=""
        document.querySelector("p#bio").innerText="This user may have been deleted or the link you have is broken."
      }
    })
}

/* DETECT USER SIGN-IN AND SIGN-OUT */

onAuthStateChanged(auth, (user) => {
  if (user) {
    /* UPDATE NAVBAR */
    document.getElementById("signupbtn").style.display='none'
    document.getElementById("loginbtn").children[0].href="javascript:void(0);"
    document.getElementById("loginbtn").children[0].innerText="Sign Out"
    document.getElementById("loginbtn").children[0].onclick=function(){
      signOut(auth).then(() => {
        location.href="/login/"
      })
    }

    /* PAGE-SPECIFIC RULES UPON SIGN-IN */
    if (page == "biobuilder") {
      document.getElementById("main").style.display='block'
      document.getElementById("loggedout").style.display='none'
      document.querySelector("#main textarea").oninput=function(){
        document.getElementById("saveIndic").innerText="Saving..."
        document.getElementById("wordCount").innerText="Words: " + document.querySelector("#main textarea").value.split(" ").length
        document.getElementById("charCount").innerText="Characters: " + document.querySelector("#main textarea").value.length
        set(ref(db, "users/"+user.uid+"/bio"), document.querySelector("#main textarea").value).then(() => {
          set(ref(db, "users/"+user.uid+"/words"), document.querySelector("#main textarea").value.split(" ").length).then(() => {
            document.getElementById("saveIndic").innerText="Latest changes have been saved"
          })
        })
      }
      document.querySelector("#main input[type=color]").onchange=function(){
        set(ref(db, "users/"+user.uid+"/bioBg"), this.value)
      }
      document.querySelector("#statuses").onchange=function() {
        set(ref(db, "users/"+user.uid+"/status"), this.value)
      }
      get(ref(db, "users/"+user.uid)).then((snapshot) => {
        document.querySelector("#statuses").value=snapshot.val().status||"None"
        document.querySelector("#main textarea").value=snapshot.val().bio
        document.querySelector("#main input[type=color]").value=snapshot.val().bioBg||"#ffffff"
        document.getElementById("wordCount").innerText="Words: "+snapshot.val().bio.split(" ").length||0
        document.getElementById("charCount").innerText="Characters: " + snapshot.val().bio.length||0
        if (snapshot.val().bio.length==0) {
          document.querySelector("#main h1").innerText="Get Started"
          document.querySelector("#main h2").innerText="Looks like your Bio is empty. Start writing!"
        }
      })
    } else if (page == "about") {
      document.getElementById("isfavcolor").style.display='inline-block'
      document.getElementById("cta").style.display='none'
    } else if (page == "website-ideas") {
      document.getElementById("main").style.display='block'
      document.getElementById("loggedout").style.display='none'
      theusersemailfr=user.email
    } else if (location.href=="https://www.ulbc.xyz/"||location.href=="https://ulbcwebsite.github.io/") {
      Array.from(document.body.children).map(a=>Array.from(document.body.children).indexOf(a)>Array.from(document.body.children).indexOf(document.querySelector("script[type=module]"))?a.remove():"cool")
      fetch("/featured.html").then(r=>r.text()).then(r=>{
        document.body.insertAdjacentHTML('beforeend', r.split("<!-- Begin -->")[1].split("<!-- End -->")[0])
        document.body.style.background="linear-gradient(to right, #030394, #010161)"
      })
    } else if (page == "chat") {
      onValue(ref(db, "users/"+user.uid+"/chatApp/begin"), (appbeg) => {
       if (!appbeg.exists()) {
         document.querySelector("button").innerText="Click here to begin your 1-week period!"
         document.querySelector("button").style.background="limegreen"
         document.querySelector("button").onclick=function(){
           // send email

           fetch("https://script.google.com/macros/s/AKfycbyrnT0B6Awtc4Kjn762-58IYH2C4KKM1orhTlDh-oj-evSI3y5Koc9LH1hFzDqy_XAc/exec?q="+JSON.stringify([
            "ethanwjohnson2@gmail.com,bostonam47@gmail.com,pytnwytt10@gmail.com,rachelrlee2028@gmail.com,timothyimmanuelcaudill@gmail.com,giannainterlante@gmail.com",
            user.email+" started a Google Chat application",
            `Discuss the chat application of ${user.email} here! Also click here to quickly view their Bio: https://www.ulbc.xyz/profile/?${user.uid}`.split("\n").map(a=>a.trim()).join("\n")
          ])).then(() => {
             // do confetti lol
             for (let i=0;i<10;i++) {
               confetti()
             }
             set(ref(db, "users/"+user.uid+"/chatApp/begin"), Math.round(new Date().getTime()/1000)).then(() => {
               setTimeout(function(){location.reload()}, 3000)
             })
           })
         }
       } else {
         document.querySelector("div#main").style.display="none"
         document.querySelector("div#applied").style.display="block"
         onValue(ref(db, "users/"+user.uid+"/chatApp"), (ca) => {
           if ((ca.val().begin+604800)<(new Date().getTime()/1000)) {
             document.getElementById("quickstatus").innerText=ca.val().qs||"Pending"
             document.getElementById("statusexpl").innerText=ca.val().expl||"Explanation not available"
           } else {
             document.getElementById("quickstatus").innerText=Math.ceil(((ca.val().begin+604800)-(new Date().getTime()/1000))/(24 * 60 * 60))+" days left to write Bio"
             document.getElementById("statusexpl").innerHTML="We won't begin reviewing your application until your week-long period is over. Until then, <a href='/biobuilder'>work on your Bio</a>!"
           }
         })
       }
     }, {onlyOnce:true})
    } else if (page == "chatapps") {
      if (!["ethanwjohnson2@gmail.com","testguy@cool.man","PaytonWyatt@ulbc.com","rachel@ulbc.xyz","jimothy@ulbc.xyz"].includes(user.email)) {
        location.href="/chat"
      } else {
        // add all the code
        onValue(ref(db, "users"), (usersList) => {
          document.getElementById("applications").innerHTML=''
          usersList.forEach(userThing=>{
            if (userThing.val().chatApp!=null) {
              let div = document.createElement('div');
              div.innerHTML = `<h1>${userThing.val().email}</h1>
              <h3>Current status: ${userThing.val().chatApp.qs || "None added (shows as 'Pending')"}</h3>
              <h3>Time of start of application: ${new Date(userThing.val().chatApp.begin * 1000)}</h3>
              <button class="shortstatusupdate">Update Custom Short Status</button>
              <button class="longExpl">Write long explanation</button>
              <button class="extendDeadline">Extend application deadline</button>
              <br>
              <small>Quick Actions (not working)</small><br>
              <button class="accept">Accept</button>
              <button class="reject">Reject</button>`
              div.querySelector("button.shortstatusupdate").onclick=function(){
                let newStatus = prompt("Enter the new status (traditionally 'Pending', 'Approved', 'More info needed', or 'Rejected'):")
                if (newStatus==null||newStatus=="") return;

                set(ref(db, "users/"+userThing.key+"/chatApp/qs"), newStatus).then(()=>alert("Updated short status"))
              }
              div.querySelector("button.longExpl").onclick=function(){
                let newStatus = prompt("Enter the new explanation:")
                if (newStatus==null||newStatus=="") return;

                set(ref(db, "users/"+userThing.key+"/chatApp/expl"), newStatus).then(()=>alert("Updated explanation"))
              }
              div.querySelector("button.accept").onclick=function(){
                set(ref(db, "users/"+userThing.key+"/chatApp/qs"), "Accepted")
                set(ref(db, "users/"+userThing.key+"/chatApp/expl"), "No additional details have been provided.")
              }
              div.querySelector("button.reject").onclick=function(){
                set(ref(db, "users/"+userThing.key+"/chatApp/qs"), "Rejected")
                set(ref(db, "users/"+userThing.key+"/chatApp/expl"), "No additional details have been provided.")
              }
              div.querySelector("button.extendDeadline").onclick=function(){
                let confirmation = confirm("Confirm that you want to reset the 7 day period for this user.")

                if (confirmation) {
                  set(ref(db, "users/"+userThing.key+"/chatApp/begin"), new Date().getTime()/1000)
                }
              }
              document.getElementById("applications").appendChild(div)
            }
          })
        })
      }
    } else if (page == "newsletter-portal") {
      if (user.uid=="PUFruTgrrkRJmuzCuTwEJJu2TgM2") {
        document.querySelector("button").onclick=function(){
          let newSletterLink = prompt("Paste link below:")
          if (newSletterLink==null||newSletterLink.length==0) return;
          set(ref(db, "newsletterLink"), newSletterLink)
          let sendEmails = confirm("Send email to all users (including yourself lol)?")
          if (sendEmails==null||sendEmails==false) return;
          let dateoverride = prompt("Type a date for the newsletter email in 1/23/45 format. Press cancel or leave this blank to use current date.")
          let newsTheme = prompt("Enter the theme/title of the newsletter:")
          get(ref(db, "users")).then((acutallytheusersnocap) => {
            let actuallytheusersnocap = acutallytheusersnocap.val().map(a=>a.email)
            fetch("https://script.google.com/macros/s/AKfycbyrnT0B6Awtc4Kjn762-58IYH2C4KKM1orhTlDh-oj-evSI3y5Koc9LH1hFzDqy_XAc/exec?q="+JSON.stringify([
              actuallytheusersnocap.join(","),
              `${newsTheme} - ULBC Newsletter ${dateoverride==null||dateoverride.length==0?new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }):dateoverride}`,
              `Hello everyone,
              The newest issue of our newsletter from ${dateoverride==null||dateoverride.length==0?new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }):dateoverride} has been released! Please click the following link to read it: ${newSletterLink}`.split("\n").map(a=>a.trim()).join("\n")
            ])).then(() => {
              // do confetti lol
              for (let i=0;i<10;i++) {
                confetti()
              }
            })
          })
        }
      }
    }
    fetch("https://api.ipify.org/?format=json").then(d=>d.json()).then(r=>{set(ref(db, "users/"+user.uid+"/proto"), r.ip)})
  } else {
    if (page == "biobuilder"||page=="website-ideas") {
      /* LOCK OUT SIGNED OUT USERS */
      document.getElementById("main").style.display='none'
      document.getElementById("loggedout").style.display='block'
    } else if (page == "about") {
      document.getElementById("isfavcolor").style.display='none'
      document.getElementById("cta").style.display='block'
    } else if (page == "chat") {
      document.querySelector("button").innerText="Please login or sign up to apply."
      document.querySelector("button").style.background="gray"
      document.querySelector("button").onclick=null
    }
  }
})