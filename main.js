let myminuts = document.getElementById("minuts");
let myseconds = document.getElementById("seconds");
let startbutton = document.querySelector("#start");
let stopbutton = document.querySelector("#stop");
let resetbutton = document.querySelector("#reset");
let intervalid;
startbutton.addEventListener("click", () => {
  intervalid = setInterval(() => {
    let seconds = +myseconds.innerHTML;
    let minutes = +myminuts.innerHTML;
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    myseconds.innerHTML = seconds;
    myminuts.innerHTML = minutes;
  }, 1000);
});

stopbutton.addEventListener("click", () => {
  clearInterval(intervalid);
});

resetbutton.addEventListener("click", () => {
  clearInterval(intervalid);

  myminuts.innerHTML = "0";
  myseconds.innerHTML = "0";
});
