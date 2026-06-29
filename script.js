//=============================================================
// Constants
//=============================================================

const FORM_MODAL = document.querySelector(".form-modal");
const REGISTER_FORM = document.querySelector("#registerForm");
const LOGIN_FORM = document.querySelector("#loginForm");
const LOGOUT_BTN = document.querySelector("#logoutBtn");
const PROFILE_NAME = document.querySelector("#profileName");
const CLOSE_MODAL = document.querySelector("#closeModal");
const TRANSACTION_MODAL = document.querySelector(".transaction-modal");
const ADD_TRANSACTION_BTN = document.querySelector("#add-transaction-btn");
const ADD_TRANSACTION_FORM = document.querySelector("#addTransactionForm");

const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];
const userFound = JSON.parse(localStorage.getItem("LoggedInUser"));
console.log(userFound, registeredUsers);

//=============================================================
// Page Swicth logic
//=============================================================

function checkAuthentication() {
  const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser"));

  if (loggedInUser) {
    FORM_MODAL.style.display = "none";

    showPage("main");
    PROFILE_NAME.textContent = loggedInUser.userId.toUpperCase();
    console.log(`Welcome Back ${loggedInUser.userId}`);
  } else {
    FORM_MODAL.style.display = "flex";

    showPage("login");
  }
}

function showPage(pageId) {
  const pages = ["main", "login", "register"];

  pages.forEach((page) => {
    document.getElementById(page).style.display = "none";
  });

  document.getElementById(pageId).style.display = "block";

  history.pushState({ page: pageId }, "", `/#${pageId}`);
}

checkAuthentication();

//=============================================================
// Register Form Logic
//=============================================================

REGISTER_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  let userId = e.target[0].value;
  let userPassword = e.target[1].value;
  const userExists = registeredUsers.some((user) => user.userId === userId);

  console.log(userExists);
  if (userExists) {
    alert("User already exists.");
    return;
  }
  if (
    userId.trim() === "" ||
    userPassword.trim() === "" ||
    userPassword.length < 8
  ) {
    alert("Password must be at least 8 characters.");
    return;
  }
  let newUser = {
    id: Date.now(),
    userId,
    userPassword,
  };

  registeredUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(registeredUsers));

  REGISTER_FORM.reset();
  showPage("login");
  console.log(newUser, registeredUsers);
});

//=============================================================
// Login Logic
//=============================================================

LOGIN_FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  let userId = e.target[0].value;
  let userPassword = e.target[1].value;

  const userFound = registeredUsers.find((user) => {
    return user.userId === userId;
  });

  if (!userFound) {
    alert("User not found");
    return;
  }
  if (userFound.userPassword !== userPassword) {
    alert("Incorrect password");
    return;
  }

  localStorage.setItem("LoggedInUser", JSON.stringify(userFound));
  alert("Login Successful.");
  FORM_MODAL.style.display = "none";
  showPage("main");
  checkAuthentication();
  console.log("user loged in and redirect to main page", userFound);
});

//=============================================================
// LogOut Logic
//=============================================================

LOGOUT_BTN.addEventListener("click", () => {
  localStorage.removeItem("LoggedInUser");

  alert("Logged Out Successfully.");

  checkAuthentication();
});

ADD_TRANSACTION_BTN.addEventListener("click", () => {
  TRANSACTION_MODAL.style.display = "flex";
});

CLOSE_MODAL.addEventListener("click", () => {
  TRANSACTION_MODAL.style.display = "none";
});

ADD_TRANSACTION_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser"));

  if (loggedInUser) {
  }
  console.log("submit");
});
