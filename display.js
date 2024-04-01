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
  

const blogForm = document.getElementById("blogForm")
  blogForm.addEventListener("submit", async (evt) => {

    evt.preventDefault();

    // Get form data
    const blogTitle = document.getElementById("blogTitle").value;
    const blogCategory = document.getElementById("blogCategory").value;
    const blogContent = document.getElementById("blogContent").value;
    const blogImage = document.getElementById("blogImage").files[0];

     
    try {
        // Upload the image to Firebase Storage (if needed) and get the download URL
         let imageUrl = "";
         if (blogImage) {
            // Upload the image and get the download URL (implementation omitted)
            // For example:
            // const storageRef = ref(storage, `blog_images/${blogImage.name}`);
            // const snapshot = await uploadBytes(storageRef, blogImage);
            // imageUrl = await getDownloadURL(snapshot.ref);
            try {
                // Initialize Firebase Storage
                const storage = getStorage();
            
                // Upload the selected picture to Firebase Storage
                const storageRef = ref(storage, `blogImages/${auth.currentUser.uid}/${blogImage.name}`);
                const snapshot = await uploadBytes(storageRef, blogImage);
            
                // Get the download URL of the uploaded picture
                 imageUrl = await getDownloadURL(snapshot.ref);
            
                // Update the user's profile with the new photoURL

                // Profile updated successfully
                console.log('Profile updated with new photoURL');
            
                // Reload the page to reflect the changes
            } catch (error) {
                // Handle errors
                console.error('Error updating profile photo:', error.message);
                // Display error message to the user if needed
            }

            };
         

        // Add the blog data to Firestore
        const docRef = await addDoc(collection(db, "blogPosts"), {
            Title: blogTitle,
            Category: blogCategory,
            Content: blogContent,
            imageUrl: imageUrl
           
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("blogForm").reset();
        console.log("Blog data added to Firestore successfully!");
        
        // Optionally, redirect to another page or show a success message
    } catch (error) {
        console.error("Error adding blog data to Firestore:", error);
        // Handle errors, show error message, etc.
    }

});









