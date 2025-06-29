// Firebase initialization and authentication logic
// Replace with your config if needed
const firebaseConfig = {
    apiKey: "AIzaSyAgU8NWRT6K1gK-ZS0FbpA6ranhIgWdp4Y",
    authDomain: "ilimi-lexica.firebaseapp.com",
    projectId: "ilimi-lexica",
    storageBucket: "ilimi-lexica.firebasestorage.app",
    messagingSenderId: "1067490113847",
    appId: "1:1067490113847:web:40f52eb6d145c0ed7102b2"
};

let signInForm;
let signOutBtn;
let userInfo;
let userEmail;
let authMsg;

document.addEventListener('DOMContentLoaded', firebaseInit);

function firebaseInit() {
    signInForm = document.getElementById('sign-in-form');
    signOutBtn = document.getElementById('sign-out-btn');
    userInfo = document.getElementById('user-info');
    userEmail = document.getElementById('user-email');
    authMsg = document.getElementById('auth-msg');

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    auth.onAuthStateChanged(user => {
        if (user) {
            showUser(user.email);
            authMsg.textContent = '';
        } else {
            hideUser();
        }
    });

    if (signInForm) {
        signInForm.onsubmit = function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            auth.signInWithEmailAndPassword(email, password)
                .then(() => { authMsg.textContent = ''; })
                .catch(err => { authMsg.textContent = err.message; });
        };
    }
    if (signOutBtn) {
        signOutBtn.onclick = function () {
            auth.signOut();
        };
    }
}

function showUser(email) {
    userInfo.style.display = 'inline-block';
    userEmail.textContent = email;
    signInForm.style.display = 'none';
}
function hideUser() {
    userInfo.style.display = 'none';
    userEmail.textContent = '';
    signInForm.style.display = 'flex';
}
