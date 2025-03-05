"use strict";
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDate: [
    "2021-01-18T21:31:17.178Z",
    "2021-01-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2021-02-01T10:17:24.185Z",
    "2021-02-05T14:11:59.604Z",
    "2021-02-06T17:01:17.194Z",
    "2021-02-10T23:36:17.929Z",
    "2025-02-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDate: [
    "2021-01-01T13:15:33.035Z",
    "2021-01-30T09:48:16.867Z",
    "2021-01-25T06:04:23.907Z",
    "2021-02-05T14:18:46.235Z",
    "2021-02-08T16:33:06.386Z",
    "2021-02-10T14:43:26.374Z",
    "2021-02-11T18:49:59.371Z",
    "2021-02-12T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDate: [
    "2021-01-01T13:15:33.035Z",
    "2021-01-30T09:48:16.867Z",
    "2021-01-25T06:04:23.907Z",
    "2021-02-05T14:18:46.235Z",
    "2021-02-08T16:33:06.386Z",
    "2021-02-10T14:43:26.374Z",
    "2021-02-11T18:49:59.371Z",
    "2021-02-12T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDate: [
    "2021-01-01T13:15:33.035Z",
    "2021-01-30T09:48:16.867Z",
    "2021-01-25T06:04:23.907Z",
    "2021-02-05T14:18:46.235Z",
    "2021-02-08T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = `${date.getFullYear()}`;
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

let displayMovement = function (acc, sort = false) {
  if (!acc.movements || acc.movements.length === 0) return;
  containerMovements.innerHTML = "";

  const movsWithDates = acc.movements.map((mov, i) => ({
    movement: mov,
    date: acc.movementsDate[i],
  }));

  const sortedMovsWithDates = sort
    ? movsWithDates.slice().sort((a, b) => a.movement - b.movement)
    : movsWithDates;

  sortedMovsWithDates.forEach(function (movObj, i) {
    const type = movObj.movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(movObj.date);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: "currency",
      currency: acc.currency,
    }).format(movObj.movement);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

function calcSummary(account) {
  if (!account.movements) return;

  const sumIn = account.movements
    .filter((move) => move > 0)
    .reduce((acc, move) => acc + move, 0);
  account.sumIn = sumIn;
  labelSumIn.textContent = formatCurrency(
    sumIn,
    account.locale,
    account.currency
  );

  const sumOut = account.movements
    .filter((move) => move < 0)
    .reduce((acc, move) => acc + move, 0);
  account.sumOut = sumOut;
  labelSumOut.textContent = formatCurrency(
    Math.abs(sumOut),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, num) => acc + num, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
}

function calcDisplayBalance(account) {
  if (!account.movements) return;
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
}

function getSimpleUserName(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

getSimpleUserName(accounts);
function updateUI(account) {
  displayMovement(account);
  calcDisplayBalance(account);
  calcSummary(account);
}

// login
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username == inputLoginUsername.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    const now = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    // const locale = navigator.language;
    const locale = currentAccount.locale;
    const dateShouldShow = new Intl.DateTimeFormat(locale, options).format(now);
    labelDate.textContent = dateShouldShow;

    updateUI(currentAccount);

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
  }
});

// transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add date
    currentAccount.movementsDate.push(new Date());
    receiverAcc.movementsDate.push(new Date());

    updateUI(currentAccount);
  }
});

// close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    let closeAccIndex = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );
    accounts.splice(closeAccIndex, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
});

// loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      // add date
      currentAccount.movementsDate.push(new Date());
      updateUI(currentAccount);
    }, 3000);
  }
});

// sort
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovement(currentAccount, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
