import {
  initializeApp,

} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";


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
  getDoc,
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

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();













// Function to fetch and display post content
async function displayPostContent() {
  const postId = getPostIdFromUrl();
  const mainContainer = document.getElementById('mainContainer');

  try {
    const docSnapshot = await getDoc(doc(db, 'blogPosts', postId));
    if (docSnapshot.exists()) {
      const postData = docSnapshot.data();

      // Render post content in the DOM
      // const fetchUserPic = document.getElementById("userPicture");
      // fetchUserPic.src = postData.blogUserImage.imageUrl;
      mainContainer.innerHTML = `
      <div class=" w-full h-28 flex items-center">
      <div class="flex flex-row items-center ">
          <div class="flex flex-row items-center">
              <button type="button"
                  class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 h-16 mx:12 md:mx-12 my-4">
                  <img class="w-full h-full rounded-full object-fill" src="${postData.blogUserImage}"
                      alt="user photo" id="userPicture">
              </button>
              <h1 class=" px:0 md:px-4 text-2xl text font-bold font-sans">${postData.blogUser}</h1>
          </div>
          <div class=" flex justify-end">
             
              <button type="button"
                  class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor" viewBox="0 0 18 18">
                      <path
                          d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                  </svg>
                  <span class="sr-only">Icon description</span>
              </button>
          </div>
      </div>
  </div>
  <div>
      <h2 class="px-6 pt-4 text-5xl font-mono font-bold">${postData.Title}</h2>
  </div>
  <div class="w-full h-96 bg-white my-9">
      <img src="${postData.imageUrl}" alt="" class=" border-8 border-black aspect-square object-fill h-96 w-full"> 
  </div>

  <div>
      <p class="text-black text-justify px-4 font-sans">${postData.Content}</p>
  </div>



  <div class="w-26 min-h-48 rounded-lg  mt-16 ">
     
          <form class="max-w-2xl bg-white rounded-lg border p-2 mx-auto mt-20 " id = "commentForm">
          <div class="px-3 mb-2 mt-2 ">
      <textarea placeholder="comment" class="w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" id="comment"></textarea>
       </div>
       <div class="flex justify-end px-4 ">
      <input type="submit" class="px-2.5 py-1.5 rounded-md text-white text-sm bg-blue-700 value="Comment">
        </div>
       </form>


  </div>
            
         
            `;

      const commentForm = document.getElementById("commentForm");

      // Attach event listener to the comment form
      commentForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Retrieve comment value from textarea
        const commentTextarea = document.getElementById("comment");
        const commentValue = commentTextarea.value;

        // Log the comment value
        console.log("Comment:", commentValue);

        const currentUser = auth.currentUser;
        const username = currentUser.displayName;
        const imageUrl = currentUser.photoURL;

        // Get the current timestamp


        // Construct the comment object
        const commentData = {
          comment: commentValue,
          username: username,
          image: imageUrl,

        };

        try {
          // Add the comment to Firestore
          const commentRef = await addDoc(collection(db, 'comments'), commentData);
          console.log("Comment added with ID: ", commentRef.id);

          // Optionally, clear the textarea after submitting the comment
          commentTextarea.value = '';
        } catch (error) {
          console.error("Error adding comment: ", error);
        }
      });
    } else {
      postContentDiv.innerHTML = '<p>Post not found</p>';
    }
  } catch (error) {
    console.error('Error fetching post content:', error);
  }
}

// Function to extract post ID from URL
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}


displayPostContent();


