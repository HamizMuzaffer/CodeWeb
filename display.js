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

import {
  getFirestore,
  onSnapshot,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const db = getFirestore(app);


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
    if (user.photoURL == null) {
      user.photoURL = "./Assets/Images/LoginUser.png"
    }
    else {
      var userImageUrl = user.photoURL;

      userImage.src = userImageUrl;
      console.log(userImageUrl)
    }


    sessionStorage.setItem("userEmail", useremail);
    sessionStorage.setItem("username", displayName);
    sessionStorage.setItem("userPhoto", user.photoURL);

    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    // ...
  } else {
    // User is signed out.
    // ...
  }
});


//! Getting Blog Input and storing it in Firebase 

const blogForm = document.getElementById("blogForm")

blogForm && blogForm.addEventListener("submit", async (evt) => {

  evt.preventDefault();

  // Get form data
  const blogTitle = document.getElementById("blogTitle").value;
  const blogCategory = document.getElementById("blogCategory").value;
  const blogContent = document.getElementById("blogContent").value;
  const blogImage = document.getElementById("blogImage").files[0];


  try {


    //  let userImageUrl = user.photoURL;

    let userImageBlog = "";
    let imageUrl = "";
    let bloguserName = "";
    if (blogImage) {

      try {
        const storage = getStorage();
        const storageRef = ref(storage, `blogImages/${auth.currentUser.uid}/${blogImage.name}`);
        const snapshot = await uploadBytes(storageRef, blogImage);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Profile updated with new photoURL');
      } catch (error) {
        // Handle errors
        console.error('Error updating profile photo:', error.message);
        // Display error message to the user if needed
      }

    };

    const currentUser = auth.currentUser;
    if (currentUser && currentUser.photoURL) {
      userImageBlog = currentUser.photoURL;
    }

    if (currentUser && currentUser.email) {
      bloguserName = currentUser.displayName;
    }

    // Add the blog data to Firestore
    const docRef = await addDoc(collection(db, "blogPosts"), {
      Title: blogTitle,
      Category: blogCategory,
      Content: blogContent,
      imageUrl: imageUrl,
      blogUserImage: userImageBlog,
      blogUser: bloguserName


    });
    console.log("Document written with ID: ", docRef.id);
    document.getElementById("blogForm").reset();
    console.log("Blog data added to Firestore successfully!");

   
  } catch (error) {
    console.error("Error adding blog data to Firestore:", error);
     }

});




//! Now Retrieving the data from Firestore Database

async function displayBlogPosts() {
  const showBlogs = document.getElementById("showBlogs");
  

  try {
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      
      const blogContainer = document.createElement("div");
      blogContainer.setAttribute("class", "blogContainer");
  

      blogContainer.innerHTML= `
      
                <div class="blog-post " id="blog">
                      <div class="h-20 w-full ">
                     
                    <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ">
                     <button type="button"
                        class="flex text-sm bg-gray-800 mt-4 mb-10 mx-3 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                         id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                           data-dropdown-placement="bottom">

                  
                        <img class="w-10 h-10 rounded-full" src="${data.blogUserImage}" alt="user photo" id="">
                       </button>
                         <span class = "text-xl md:px-4 pb-6 text-center" >${data.blogUser}</span>
                  
                   
                   </div>
                
              
            
                    <h2 class = "text-2xl font-bold px-2" id = "getBlog">${data.Title}</h2>
                    
                    
                   
                    <div class = " w-full h-56 bg-blue-300 flex items-center justify-center mt-4 mb-5 rounded-2xl  border-black">
                    <img src="${data.imageUrl}" alt="Blog Image" class = "object-fill h-56 w-full rounded-2xl">
                    </div>

                    <div class = "flex justify-center items-center">
                    
                    <button type="button" class=" view-btn text-white mt-0 bg-blue-700 hover:bg-blue-800 focus:outline-none
                    focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center
                      me-2 mb-12 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" data-post-id="${doc.id}">Read More</button>
                      </div>
              </div>
            `;

      // blogContainer.innerHTML += blogPostHTML;
      showBlogs.appendChild(blogContainer);
    });
    
    // Add event listeners for view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.getAttribute('data-post-id');
        window.location.href = `view-post.html?id=${postId}`;
      });
    });
    
  } catch (error) {
    console.error("Error fetching documents:", error);
    if (error && error.message) {
      // Handle the error
    }
  }
}

//! Call the function to display blog posts
displayBlogPosts();





//! Searching Blogs from Display Page 

const searchInput = document.getElementById("default-search");



searchInput.addEventListener("input", () => {
  const inputValue = searchInput.value.toLowerCase();
  const blogs = document.querySelectorAll(".blogContainer");


  blogs.forEach(blog => {
      const title = blog.querySelector("#getBlog").textContent.toLowerCase();
      
      const displayContainer = document.getElementById("container");
      if (inputValue.trim() === '') {
          displayContainer.style.display = "flex";
      } else {
          displayContainer.style.display = "none";
      }



      if (title.includes(inputValue)) {
          blog.style.display = "block";
        
       
      } else {
          blog.style.display = "none";
         
      }
  });

});


