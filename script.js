'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////BANKIST APP

////////////////////////////////////////////////////////////////////////////////////////////
////////////Data

//Different Data! Contains movement dates, currency and locale

const account1 = {
  owner: 'Kimsanboyev Nurillo',
  movements: [200, 455.23, -306.5, 25000, 642.21, -133.9, 79.97, 1300],
  interest: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T21:42:02.388Z',
    '2020-01-18T21:31:17.178Z',
    '2020-02-18T21:31:17.178Z',
    '2020-03-18T21:31:17.178Z',
    '2020-04-18T21:31:17.178Z',
    '2020-05-18T21:31:17.178Z',
    '2020-06-18T21:31:17.178Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account2 = {
  owner: 'Raxmonov Shaxboz',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T21:42:02.388Z',
    '2020-01-18T21:31:17.178Z',
    '2020-02-18T21:31:17.178Z',
    '2020-03-18T21:31:17.178Z',
    '2020-04-18T21:31:17.178Z',
    '2020-05-18T21:31:17.178Z',
    '2020-06-18T21:31:17.178Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Elements

const body = document.querySelectorAll('body');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUserName = document.querySelector('.login__input--user');
const inputLoginUserPin = document.querySelector('.login__input--pin');
const inputTranferTo = document.querySelector('.form__input--to');
const inputTranferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUserName = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////// Functions

const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //textContent=0

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit ' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(mov);

    const html = ` <div class="movements__row">
     <div class="movements__type
      movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
     <div class="movements__value">${formattedMov} </div>
   </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} EUR`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} EUR`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} EUR`;
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //Set time 5 minutes
  let time = 100;

  //Call the timer every second
  setInterval(function () {
    //In the each call, print the remaining time to UI
    labelTimer.textContent = time;

    //Decrese 1s
    time--;

    //When 0 seconds,stop timer and long out user
  }, 1000);
};
//Event handler
let currentAccount;
//Fake always logged in
currentAccount = account1;
updateUI(currentAccount);

//Experimenting API
// const now = new Date();
// labelDate.textContent = new Intl.DateTimeFormat('en - US').format(now);

//Experementing API 2
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// labelDate.textContent = new Intl.DateTimeFormat('en - US', options).format(now);

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUserName.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginUserPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //   weekday: 'long',
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year},  ${hour}:${min}`;

    //Clear input fields
    inputLoginUserName.value = inputLoginUserPin.value = '';
    inputLoginUserPin.blur();

    startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTranferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTranferTo.value
  );

  inputTranferAmount.value = inputTranferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUserName.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUserName.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(containerMovements.innerHTML);

//////////////////////////////////////////////////////////////////////////////////////
//////////Lectures

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    //0,2,4,6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    //0,3,6,9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

//Create date
// const now = new Date();
// console.log(now);

// //Working wiht date
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// future.setFullYear(2040);
// console.log(future);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);

////////////////////////////////////////////////////////////////////////////////////////////
/////////  Set TimeOut
setTimeout(() => console.log('Here is your pizza 🍕'), 3000);
console.log('Waiting... ');

///////////////////////////////////////////////
////// Set Interval

setInterval(function () {
  const now = new Date();
  console.log(now);
}, 2000);
