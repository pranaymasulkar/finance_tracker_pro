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
const TRANSACTION_ROWS = document.querySelector("#transaction-rows");
const BAR_INCOM_EXPENSE_CHART = document.querySelector("#icomeExpenseChart");
const CATEGORY_EXPENSE = document.querySelector("#categoryExpense");
//=============================================================
// Local Storage
//=============================================================

const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];
const userFound = JSON.parse(localStorage.getItem("LoggedInUser"));
const myTransactions = JSON.parse(localStorage.getItem("Transactions")) || [];

function getUserTransactions() {
  return myTransactions.filter((tx) => tx.userId === userFound.id);
}
console.log(userFound);
console.log(registeredUsers);
console.log(myTransactions);

//=============================================================
// Page Swicth logic
//=============================================================

function checkAuthentication() {
  const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser"));

  if (loggedInUser) {
    FORM_MODAL.style.display = "none";

    showPage("main");
    PROFILE_NAME.textContent = loggedInUser.userId.charAt(0).toUpperCase();
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
  location.reload();
  console.log("user loged in and redirect to main page", userFound);
});

//=============================================================
// LogOut Logic
//=============================================================

LOGOUT_BTN.addEventListener("click", () => {
  checkAuthentication();
  localStorage.removeItem("LoggedInUser");
  location.reload();
  alert("Logged Out Successfully.");
});

//=============================================================
// Dispsplay Transaction model on Btn click
//=============================================================

TRANSACTION_MODAL.style.display = "none";

ADD_TRANSACTION_BTN.addEventListener("click", () => {
  TRANSACTION_MODAL.style.display = "flex";
});

//=============================================================
// HIde Transactionn Modal on CLick
//=============================================================

CLOSE_MODAL.addEventListener("click", () => {
  TRANSACTION_MODAL.style.display = "none";
});

//=============================================================
// UI Of DashBorad Values
//=============================================================

const mainSec = document.querySelector(".card-section");
function dashboardValues() {
  const filteredTransactions = getUserTransactions();
  const filteredIncome = filteredTransactions.filter(
    (income) => income.txType === "income",
  );

  const TOTAL_INCOME = filteredIncome.reduce((totalicom, incomAmount) => {
    return totalicom + Number(incomAmount.txAmount);
  }, 0);

  // console.log(filteredIncome, "incoms", TOTAL_INCOME);

  const filterExpense = filteredTransactions.filter(
    (expense) => expense.txType === "expense",
  );

  const TOTAL_EXPENSE = filterExpense.reduce((totalExpense, expenseAmount) => {
    return totalExpense + Number(expenseAmount.txAmount);
  }, 0);

  const CURRENT_BALANCE = TOTAL_INCOME - TOTAL_EXPENSE;

  const expenseTransactions = filteredTransactions.filter(
    (type) => type.txType === "expense",
  );

  const categoryWiseExpense = {};
  expenseTransactions.forEach((txCat) => {
    if (!expenseTransactions[txCat.txCategory]) {
      categoryWiseExpense[txCat.txCategory] = 0;
    }
    categoryWiseExpense[txCat.txCategory] += Number(txCat.txAmount);
  });

  const Lable = Object.keys(categoryWiseExpense);
  const expensData = Object.values(categoryWiseExpense);
  console.log(categoryWiseExpense, Lable, expensData, "expenses");
  doughnutChartUpdate(Lable, expensData);

  // console.log(filterExpense, "Total Expense", TOTAL_EXPENSE);

  const TOTAL_TRANSACTIONS = filteredTransactions.length;

  const cardUi = [
    {
      title: "Current Balance",
      icon: `<i class="ri-bank-line  icon-total"></i>`,
      amount: CURRENT_BALANCE,
      class: "",
      curency: "₹",
    },
    {
      title: "Total Income",
      icon: `<i class="ri-arrow-right-up-line icon-incom"></i>`,
      amount: TOTAL_INCOME,
      class: "text-green",
      curency: "₹",
    },
    {
      title: "Total Expense",
      icon: `<i class="ri-arrow-right-down-line icon-expense"></i>`,
      amount: TOTAL_EXPENSE,
      class: "text-red",
      curency: "₹",
    },
    {
      title: "Total Transactions",
      icon: `<i class="ri-list-ordered-2 icon-tran"></i>`,
      amount: TOTAL_TRANSACTIONS,
      class: "",
      curency: "",
    },
  ];

  mainSec.innerHTML = "";
  cardUi.forEach((item) => {
    mainSec.innerHTML += `
                        <div class="card">
                         <div class="icon">
                         ${item.icon}
                         </div>
                          <p>${item.title}</p>
                          <h3 class="${item.class}">${item.curency} ${item.amount}</h3>
                        </div>
      `;
  });
  barChartUpdate(TOTAL_INCOME, TOTAL_EXPENSE);
}
dashboardValues();
//=============================================================
// UI Of Transaction Table
//=============================================================

function transactionRow(data) {
  TRANSACTION_ROWS.innerHTML = "";
  data.forEach((value, index) => {
    return (TRANSACTION_ROWS.innerHTML += `
                                  <tr>
                                    <td>${index + 1}</td>
                                    <td>${value.txDate}</td>
                                    <td><strong>${value.txDescription}</strong></td>
                                    <td><span class="categry">${value.txCategory}</span></td>
                                    <td>
                                    ${value.txType === "income" ? `<span class="income">${value.txType}</span>` : `<span class="expense">${value.txType}</span>`}
                                    </td>
                                    <td><strong>₹ ${value.txAmount}</strong></td>
                                    <td>
                                      <button class="edit-btn" onclick="editTransaction(${value.id})">
                                      <i class="ri-pencil-fill"></i>
                                      </button>
                                      <button class="delete-btn" onclick="deleteTransaction(${value.id})">
                                      <i class="ri-delete-bin-4-fill"></i>
                                      </button>
                                    </td>
                                  </tr>
                              `);
  });
}
//=============================================================
// Delete Transaction logic
//=============================================================

function deleteTransaction(id) {
  const isConfirmed = confirm(
    "Are you sure you want to delete this transaction?",
  );

  if (!isConfirmed) return;

  const updatedTransactions = myTransactions.filter(
    (transaction) => transaction.id !== id,
  );

  localStorage.setItem(
    "Transactions",

    JSON.stringify(updatedTransactions),
  );

  location.reload();
}

//=============================================================
// Update Transaction logic
//=============================================================

let editedTransactionId = null;

function editTransaction(id) {
  TRANSACTION_MODAL.style.display = "flex";

  const transactionEdit = myTransactions.find(
    (transaction) => transaction.id === id,
  );

  editedTransactionId = id;

  console.log(transactionEdit, "this id transaction i want to edit");

  txType.value = transactionEdit.txType;
  txDescription.value = transactionEdit.txDescription;
  txAmount.value = transactionEdit.txAmount;
  txDate.value = transactionEdit.txDate;
  txCategory.value = transactionEdit.txCategory;
}

//=============================================================
// Add Transaction Logic
//=============================================================

ADD_TRANSACTION_FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser"));

  let TX_TYPE = document.getElementById("txType");
  let TX_DESCRIPTION = document.getElementById("txDescription");
  let TX_AMOUNT = document.getElementById("txAmount");
  let TX_DATE = document.getElementById("txDate");
  let TX_CATEGORY = document.getElementById("txCategory");

  let txType = TX_TYPE.value;
  let txDescription = TX_DESCRIPTION.value;
  let txAmount = TX_AMOUNT.value;
  let txDate = TX_DATE.value;
  let txCategory = TX_CATEGORY.value;

  let newTransaction = {
    id: Date.now(),
    userId: loggedInUser.id,
    txType,
    txDescription,
    txAmount,
    txDate,
    txCategory,
  };

  if (editedTransactionId) {
    const transactionUpdate = myTransactions.find((transaction) => {
      return transaction.id === editedTransactionId;
    });

    transactionUpdate.txType = txType;
    transactionUpdate.txDescription = txDescription;
    transactionUpdate.txAmount = txAmount;
    transactionUpdate.txDate = txDate;
    transactionUpdate.txCategory = txCategory;

    filterdMyTx();
    dashboardValues();
    alert("Update Transaction Succsesfully");
    editedTransactionId = null;
    TRANSACTION_MODAL.style.display = "none";
  } else {
    myTransactions.push(newTransaction);

    alert("Added Transaction Succsesfully");
  }

  localStorage.setItem("Transactions", JSON.stringify(myTransactions));

  filterdMyTx();

  dashboardValues();

  ADD_TRANSACTION_FORM.reset();

  TRANSACTION_MODAL.style.display = "none";

  location.reload();
  console.log(loggedInUser, "Transaction User");

  // console.log(txType, txDescription, txAmount, txDate, txCategory);
});

//=============================================================
// Dark Mode Logic
//=============================================================

const DARK_MODE_BTN = document.querySelector("#dark-mode-btn");

DARK_MODE_BTN.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  console.log("dark mode");
});

//=============================================================
// Dark Mode Logic
//=============================================================

const SEARCH_INPUT = document.querySelector("#searchInput");
const TYPE_FILTER = document.querySelector("#typeFilter");

function filterdMyTx() {
  const filteredTransactions = getUserTransactions();
  const searchedWord = SEARCH_INPUT.value.toLowerCase();
  const searchType = TYPE_FILTER.value;

  const searchfilterd = filteredTransactions.filter((transaction) => {
    const matchedWord = transaction.txDescription
      .toLowerCase()
      .includes(searchedWord);

    const typeFilterd =
      searchType === "all" || transaction.txType === searchType;

    return matchedWord && typeFilterd;
    console.log(matchedWord, typeFilterd);
  });

  transactionRow(searchfilterd);

  console.log(searchfilterd, "lll");
}
filterdMyTx();

SEARCH_INPUT.addEventListener("input", filterdMyTx);
TYPE_FILTER.addEventListener("change", filterdMyTx);

//=============================================================
// Chart Manage Logic
//=============================================================

function barChartUpdate(income, expense) {
  new Chart(BAR_INCOM_EXPENSE_CHART, {
    type: "bar",
    data: {
      labels: ["Icom vs Expense"],
      datasets: [
        {
          label: "Income",
          data: [income],
          backgroundColor: ["rgb(22, 101, 52)"],
          borderColor: ["rgb(22, 101, 52)"],
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: [expense],
          backgroundColor: ["rgb(153, 27, 27)"],
          borderColor: ["rgb(153, 27, 27)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function doughnutChartUpdate(Lable, expensData) {
  new Chart(CATEGORY_EXPENSE, {
    type: "doughnut",
    data: {
      labels: Lable,
      datasets: [
        {
          label: "Total Expense",
          data: expensData,
          backgroundColor: [
            "#F59E0B",
            "#3B82F6",
            "#EC4899",
            "#EF4444",
            "#10B981",
            "#8B5CF6",
            "#6366F1",
            "#22C55E",
            "#14B8A6",
            "#EAB308",
            "#92400E",
            "#06B6D4",
            "#84CC16",
            "#6B7280",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
doughnutChartUpdate();
