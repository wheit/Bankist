'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
console.log (accounts)

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Elements
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const updateUI = function (acc) {
  //Display movements
  displayMovents(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const displayMovents = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${mov}€</div>
    </div>
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//Create Usernames

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner

      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//Display BALANCE

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};
//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${incomes}€`;
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => (acc += int), 0);

  labelSumInterest.textContent = `${interest}€`;
};

//Event handler

let currentAcount;
btnLogin.addEventListener('click', function (e) {
  //Prevents the default of the form submitting
  e.preventDefault();
  currentAcount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    //Display UI a welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAcount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Update the UI
    updateUI(currentAcount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAcount.balance >= amount &&
    receiverAcc?.username !== currentAcount.username
  ) {
    //Doing the movement
    currentAcount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAcount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount / 10)) {
    //Add movement
    currentAcount.movements.push(amount);

    //Update UI
    updateUI(currentAcount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcount.username === inputCloseUsername.value &&
    currentAcount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAcount.username
    );

    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    // accounts.splice(index,1)
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovents(currentAcount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr=['a','b','c','d','e']
// //Slice
// console.log(arr.slice(2));
// console.log(arr.slice(2,4));
// console.log(arr.slice());
// //Splice(modifica array-ul original)
// // console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1,2);
// console.log(arr);
// //reverse
// arr=['a','b','c','d','e'];
// const arr2=['j','i','h','h','j'];
// console.log(arr2.reverse());
// console.log(arr2);

// //Concat
// const letters=arr.concat(arr2);
// console.log(letters);
// //Join(rezultat string cu separator)
// console.log(letters.join('-'));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// function checkDogs(dogsJulia,dogsKate){
//   const dogsJuliaCorect=dogsJulia.slice(1,-2);
//   console.log(dogsJuliaCorect)
//   const corectData=[...dogsJulia.slice(1,-2),...dogsKate]
//   console.log(corectData)
//   corectData.forEach(function(item,index){

//     item>=3 ? console.log(`Dog nummber ${index+1} is an adult ,amd is ${item} years old`) : console.log(`Dog number ${index+1} is still a puppy`)

//   })
// }
// checkDogs([3,5,2,12,7],[4,1,15,8,3]);
// movements.forEach(function(movement,index,array){
//   if(movement>0){
//     console.log(`Movement ${index+1}:You deposited ${movement}`);
//   }else{
//     console.log(`Movement ${index+1}:You withdrew ${Math.abs(movement)}`);
//   }

// })

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value,key,map){
//    console.log(`${key}: ${value}`);
// })
// //Set

// const eurToUsd=1.1;
// const movementsUSD=movements.map(el=>el*eurToUsd)
// console.log(movements);
// console.log(movementsUSD);
// const movementDescriptions=movements.map((mov,i)=>
// `Movement ${i+1}:You deposited ${mov>0? 'deposited': 'withdrew'} ${Math.abs(mov)}`)
// console.log(movementDescriptions);

// export default execise.js
// Maximum value
// const max=movements.reduce((acc,mov)=>mov>acc? acc=mov : acc=acc,movements[0]);
// console.log(max)

//2.Coding challange #2
// const calcAverageHumanAge=age=>{

//   // const humanYears=age.map(age=>age<=2? age=2*age:age=16+age*4);

//   // const adultDogs=humanYears.filter(age=>age>=18)

//   // const averageAge=adultDogs.reduce((avg,cur,i)=>avg+=cur/adultDogs.length,0)

//   const averageAge=age.map(age=>age<=2? age=2*age:age=16+age*4).filter(age=>age>=18).reduce((avg,cur,i,arr)=>avg+=cur/arr.length,0);
//   console.log(averageAge)

// }
// calcAverageHumanAge([5,2,4,1,15,8,3]);
// calcAverageHumanAge([16,6,10,5,6,1,4]);

// const deposits = movements.filter(mov => mov > 0);

// const withdrawals = movements.filter(mov => mov < 0);

// const eurToUsd = 1.1;

// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

//   console.log(totalDepositUSD);
// const firstWithdrawal=movements.find(mov=>mov<0);
// console.log(movements);
// console.log(firstWithdrawal);
// console.log(accounts);
// const account=accounts.find(acc=>acc.owner==="Jessica Davis");
// console.log(account);
// console.log(movements);
// //Equality
// console.log(movements.includes(-130));
// //Sum Condition
// const anyDeposits=movements.some(mov=>mov>0);

// console.log(anyDeposits);
// //Every
// console.log(account4.movements.every(mov=>mov>0))

//Separe callbacks
// const deposit=mov=>mov>0;
// console.log(movements.some(deposit));

// const arr=[[1,2,3],[4,5,6],7,8];

//Flat
// console.log(arr.flat());

// const accountMovements=accounts.map(acc=>acc.movements);
// console.log(accountMovements);
// const allMovements=accountMovements.flat();
// console.log(allMovements);
// const overallBalance=allMovements.reduce((acc,mov)=>acc+=mov,0);
// console.log(overallBalance);
//flatMap(compinatie map si flat);
// const owners=["Jonas",'Zach','Adam',"Martha"];
// console.log(owners.sort());
// console.log(owners);

//Numbers
// console.log(movements);

//return<0,A,B(keep the order);
//return>0,B,A(switch order);

// movements.sort((a,b)=>{
//   if(a>b)
//     return 1;
//   if(b>a)
//     return-1;

// });
// movements.sort((a,b)=>a-b);

// console.log(movements);
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));
// const x = new Array(7);
// console.log(x);
// console.log(x.map(()=>5))
// x.fill(1, 3, 5);
// console.log(arr);
// arr.fill(23, 2, 6);
// console.log(arr);

//Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));

// });
//Array Methods practice
//1.
// const bankDeposiSum=accounts
// .flatMap(acc=>acc.movements)
// .filter(mov=>mov>0)
// .reduce((sum,cur)=>sum+cur,0);
// console.log(bankDeposiSum);
// //2.
// // const numDeposits1000=accounts
// // .flatMap(acc=>acc.movements)
// // .filter(mov=>mov>=1000).length;
// // console.log(numDeposits1000)
// //Prefixed ++ operator
// const numDeposits1000=accounts
// .flatMap(acc=>acc.movements)
// .reduce((count,cur)=>cur>=1000 ? ++count :count ,0)
// console.log(numDeposits1000);
// //3.
// const {deposits,withdrawals}=accounts
// .flatMap(acc=>acc.movements).reduce((sums,cur)=>{
//   // cur>0?sums.deposits+=cur : sums.withdrawals+=cur;
//   sums[cur>0?"deposits":'withdrawals']+=cur;
//   return sums;

// },{deposits:0,withdrawals:0});
// console.log(deposits,withdrawals);
// //4.
// const convertTitleCase=function(title){
//   const expections=['a','an','the','but','or','on']
//   let titleCase=title.toLowerCase().split(" ").map(word=>expections.includes(word)?word:
//   word[0].toUpperCase()+word.slice(1)).join();
//   console.log(titleCase);

// };
// convertTitleCase("this is a nice title")
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// dogs.forEach(function (el) {
//   el.recommendedFood = el.weight ** 0.75 * 28;
// });
// console.log(dogs);
// //2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// //3.
// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
//   }`
// );
// let ownerseatTooLittle = [];
// let ownersEatTooMuch = dogs
//   .filter(el => el.recommendedFood > el.curFood)
//   .flatMap(dog => dog.owners);
// let ownersEatTooLittle = dogs
//   .filter(el => el.recommendedFood < el.curFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch, ownersEatTooLittle);
// //4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too little!`);
// //5.
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// const checkEatingOkay =  dog =>
// dog.curFood > dog.recommendedFood * 0.9 &&
// dog.curFood < dog.recommendedFood * 1.1;
// //7.
// console.log(dogs.some(checkEatingOkay));
// //8.
// const dogsCopy=dogs.slice().sort((a,b)=>a.recommendedFood-b.recommendedFood);
// console.log(dogsCopy);

