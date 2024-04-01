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
  

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

  // Function to fetch and display post content
  async function displayPostContent() {
    const postId = getPostIdFromUrl();
    const postContentDiv = document.getElementById('postContent');

    try {
        const docSnapshot = await getDoc(doc(db, 'blogPosts', postId));
        if (docSnapshot.exists()) {
            const postData = docSnapshot.data();
            // Render post content in the DOM
            postContentDiv.innerHTML = `
                <h1>${postData.Title}</h1>
                <p>${postData.Content}</p>
                <img src="${postData.imageUrl}" alt="Post Image">
            `;
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

// Call the function to display post content
displayPostContent();