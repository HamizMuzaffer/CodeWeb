import {
  initializeApp,
  
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile

} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
   getStorage,
   ref,
   uploadBytes,
   getDownloadURL
  
   } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN_VV_4Y_SgG6ZYMFVzBD3pYIOZax2R3g",
  authDomain: "codeweb-d59a3.firebaseapp.com",
  projectId: "codeweb-d59a3",
  storageBucket: "codeweb-d59a3.appspot.com",
  messagingSenderId: "824611275683",
  appId: "1:824611275683:web:6a1ccc6fc81ab6c7779016",
  measurementId: "G-9DHBPDKJYN"
};
/* 
! Firebase Initialization 
*/
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage();
const storageRef = ref(storage, 'users/')
const provider = new GoogleAuthProvider();
const newprovider = new GithubAuthProvider();
/* 
! SignUp Form References 
*/
const signupForm = document.getElementById("signupForm");
const signupEmail = document.getElementById("signupEmail");
const forgotPassword = document.getElementById("forgotPass");
const defaultPhotoURL = './Assets/Images/LoginUser.png';
// !Creating User by signing up through mail and password

const creatuserbySignUp = (e) => {
  e.preventDefault();

  const signedUpUserName = document.getElementById("signupUsername").value;
  const signupEmail = document.getElementById("signupEmail").value;
  const signupPassword = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
  .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      console.log('User signed up:', user);
      // Update user profile with username
      return updateProfile(auth.currentUser,{
          displayName: signedUpUserName
          

      });
  })
  .then(() => {
      // Profile updated successfully
      console.log('Username added to profile');
      // Redirect or perform any other actions
  })
  .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-up error:', errorMessage);
      // Display error message to the user
  });

}

signupForm && signupForm.addEventListener("submit", creatuserbySignUp);




// !Login using email and password
const signinuserwithemailPassword = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      window.location.href = "./display.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      forgotPassword.textContent = "Invalid Password or Email"
      forgotPassword.style.color = "red";
    });

}

const signInForm = document.getElementById("loginForm");
signInForm && signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  signinuserwithemailPassword(email, password);
});


// !Sign In With Goggle

const signinWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      window.location.href = "./display.html";

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

const signinbyGoogle = document.getElementById("signinGoogle");
signinbyGoogle && signinbyGoogle.addEventListener("click", signinWithGoogle)

// !Sign in with Github

const signinwithGithub = () => {
  signInWithPopup(auth, newprovider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user)
      window.location.href = "./display.html";
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });

}

const signinbyGithub = document.getElementById("signinGithub");
signinbyGithub && signinbyGithub.addEventListener("click", signinwithGithub)

// !Authstate function to retrieve users info
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.

    // For logged in Page
    var displayuserName = document.getElementById("loginuser-name");
    var displayuserEmail = document.getElementById("loginuser-mail");

    // ?Getting User Info
console.log(user)
    // *UserName

    var displayName = user.displayName;
    displayuserName.textContent = displayName;

    // *UserEmail

    var useremail = user.email;
    displayuserEmail.textContent = useremail;


    var emailVerified = user.emailVerified;

    // *UserPicture
    var userImage = document.getElementById('userPicture');
if(user.photoURL == null){
  user.photoURL = "./Assets/Images/LoginUser.png"
}
else{
  var userImageUrl = user.photoURL;

  userImage.src = userImageUrl;
  console.log(userImageUrl)
}
   

    sessionStorage.setItem("userEmail", useremail);
    sessionStorage.setItem("username", displayName);
    sessionStorage.setItem("userPhoto" , user.photoURL);

    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    // ...
  } else {
    // User is signed out.
    // ...
  }
});



// !signout of user

const signout = () => signOut(auth)
  .then(() => {
    window.location.href = "./login.html"
  }).catch((error) => {

  });

const signoutBtn = document.getElementById("signoutBtn");

signoutBtn && signoutBtn.addEventListener("click", signout)



//!Displaying Username on dashboard 

var storedemail = sessionStorage.getItem("userEmail");
var storedusername = sessionStorage.getItem("username");
var storedPhoto =  sessionStorage.getItem("userPhoto")

var dashboardemail = document.getElementById("userEmailDashboard");
var dashboardusername =  document.getElementById("userNameDashboard");
var dashboardProfilePic = document.getElementById("dashboardProfilePic");

dashboardemail.innerHTML = storedemail;
dashboardusername.innerHTML = storedusername;
dashboardProfilePic.src = storedPhoto;



//! Editing of Username using update profike
const getNewUserName = document.getElementById("getNewUserName");
const editUserName = document.getElementById("editUserName");

editUserName.addEventListener("click", (evt) => {
    evt.preventDefault();
    const updatedUsername = getNewUserName.value;
    console.log(updatedUsername); 

  updateProfile(auth.currentUser,{
   displayName:updatedUsername
  });
  location.reload();
});


const getNewPicture = document.getElementById("getNewPicture")
const editNewPicture = document.getElementById("editNewPicture")



//! Updating User's photo

editNewPicture.addEventListener("click", async (evt) => {
  evt.preventDefault();
  const updatedPicture = getNewPicture.files[0];

  try {
    // Initialize Firebase Storage
    const storage = getStorage();

    // Upload the selected picture to Firebase Storage
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/${updatedPicture.name}`);
    const snapshot = await uploadBytes(storageRef, updatedPicture);

    // Get the download URL of the uploaded picture
    const photoURL = await getDownloadURL(snapshot.ref);

    // Update the user's profile with the new photoURL
    await updateProfile(auth.currentUser,{
        photoURL: photoURL
    });

    // Profile updated successfully
    console.log('Profile updated with new photoURL');

    // Reload the page to reflect the changes
    location.reload();
} catch (error) {
    // Handle errors
    console.error('Error updating profile photo:', error.message);
    // Display error message to the user if needed
}
});



