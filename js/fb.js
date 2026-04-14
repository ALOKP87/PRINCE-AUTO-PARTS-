// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDmdJguF1NVk3FMygezU677ZyPrMcRnh_0",
  authDomain: "form-waranty.firebaseapp.com",
  databaseURL: "https://form-waranty-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "form-waranty",
  storageBucket: "form-waranty.firebasestorage.app",
  messagingSenderId: "158453270080",
  appId: "1:158453270080:web:6be998a97b468b6216c1a5"
};

// 🔥 INIT
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// 🧠 GLOBAL USER
let currentUser = null;

// 🔥 AUTH STATE LISTENER
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;

    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      phone: user.phoneNumber || null,
      name: user.displayName || null
    }));

    console.log("✅ Logged in:", user.uid);

  } else {
    currentUser = null;
    localStorage.removeItem("user");

    console.log("❌ Logged out");
  }
});

// 🔐 LOGOUT
function logoutUser() {
  return auth.signOut();
}

// 🔥 SAVE USER
function saveUser(user) {
  return db.ref(`users/${user.uid}`).set({
    uid: user.uid,
    phone: user.phoneNumber || "",
    name: user.displayName || "",
    lastLogin: Date.now()
  });
}

// ==========================
// 📁 PROJECT SYSTEM
// ==========================

// ➕ CREATE PROJECT
function createProject(name) {
  const id = Date.now();

  return db.ref(`projects/${currentUser.uid}/${id}`).set({
    id: id,
    name: name,
    createdAt: Date.now()
  });
}

// 📥 LOAD PROJECTS
function loadProjects(callback) {
  db.ref(`projects/${currentUser.uid}`).on("value", snap => {
    callback(snap.val() || {});
  });
}

// ❌ DELETE PROJECT
function deleteProject(projectId) {
  return db.ref(`projects/${currentUser.uid}/${projectId}`).remove();
}

// ==========================
// 💬 CHAT SYSTEM
// ==========================

// ➕ CREATE CHAT
function createChat(projectId) {
  const chatId = Date.now();

  return db.ref(`chats/${currentUser.uid}/${projectId}/${chatId}`).set({
    id: chatId,
    title: "New Chat",
    createdAt: Date.now()
  });
}

// 📥 LOAD CHATS
function loadChats(projectId, callback) {
  db.ref(`chats/${currentUser.uid}/${projectId}`).on("value", snap => {
    callback(snap.val() || {});
  });
}

// ❌ DELETE CHAT
function deleteChat(projectId, chatId) {
  return db.ref(`chats/${currentUser.uid}/${projectId}/${chatId}`).remove();
}

// ==========================
// 📩 MESSAGE SYSTEM
// ==========================

// ➕ SAVE MESSAGE
function saveMessage(projectId, chatId, role, text) {
  const msgId = Date.now();

  return db.ref(`messages/${currentUser.uid}/${projectId}/${chatId}/${msgId}`).set({
    id: msgId,
    role: role, // "user" or "assistant"
    text: text,
    timestamp: Date.now()
  });
}

// 📥 LOAD MESSAGES
function loadMessages(projectId, chatId, callback) {
  db.ref(`messages/${currentUser.uid}/${projectId}/${chatId}`).on("value", snap => {
    callback(snap.val() || {});
  });
}

// ==========================
// 🧠 EXTRA HELPERS
// ==========================

// 🔄 GENERATE CHAT TITLE
function generateTitle(text) {
  return text.substring(0, 30);
}

// 🔐 REQUIRE LOGIN CHECK
function requireLogin() {
  if (!currentUser) {
    alert("Login required");
    window.location.href = "opt.html";
  }
}

// 🔄 GET CURRENT USER
function getUser() {
  return currentUser;
}
