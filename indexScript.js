// set up the messages
const cboValues = [
    { cbo: "Select an option...", timer: 0, message: '' },
    { cbo: "Finish lab", timer: -1, message: 'Please put a ✔ when you have completed the lab' },
    { cbo: "ready to start", timer: -1, message: 'Please put a ✔ when you are ready to start 🐱‍🏍' },
    { cbo: "Coffee", timer: 15, message: 'Let\'s take a 15 minutes break ☕' },
    { cbo: "Lunch", timer: 60, message: 'Let\'s take 60 minutes for lunch 🍔' },
    { cbo: "mini break", timer: 5, message: 'Let\'s take a 5 minutes mini break ☕' }
];

const readFiles = async () => {
    let response = await fetch('courseDetails.txt');
    let res = await response.text();
    res = splitLines(res);
    document.getElementById('courseTitle').innerHTML = res[0];
    document.getElementById('courseMaterial').href = res[1];
    document.getElementById('afa').value = res[2];
    document.getElementById('email').value = res[3];
    document.getElementById('password1').value = res[4];
    document.getElementById('password2').value = res[5];
    document.getElementById('mimeo').value = res[6];
    document.getElementById("trainerEmail").innerHTML = res[7];

    response = await fetch('pcs.txt');
    res = await response.text();
    let pcs = splitLines(res);

    response = await fetch('students.txt');
    res = await response.text();
    let students = splitLines(res);

    for (var i = 0; i < students.length; i++) {
        var ol = document.getElementById("pcs");
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = pcs[i];
        a.target = "_blank";
        a.appendChild(document.createTextNode(students[i]));
        li.appendChild(a);
        ol.appendChild(li);
    }
}

function setupForm() {
    document.querySelectorAll('input').forEach(txt =>
        txt.addEventListener('click', (event) => {
            event.target.select();
            event.target.setAttribute("readonly", "true");
        }));

    cboValues.forEach(item => {
        let op = document.createElement('option');
        op.innerHTML = item.cbo;
        document.getElementById('cboMessages').appendChild(op);
    });
}

function afa() {
    var copyText = document.getElementById('afa');
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value).then(() => {
        let afaPath = "https://qa-learning.webex.com/webappng/sites/qa-learning/dashboard?siteurl=qa-learning";
        window.open(afaPath); //, '_blank');
    }, () => {
        console.error('Failed to start AFA');
    });
}

function splitLines(text) {
    return text.split('\r\n').filter(line => line.trim() !== '');
}

readFiles();
setupForm();

//========================Timer and messages==============================
var myTimer = null;
function stopTimer() {
    if (myTimer !== null)
        clearInterval(myTimer);
}

function showTutorMessages() {
    let index = document.getElementById('cboMessages').selectedIndex;
    let item = cboValues[index];
    document.getElementById('txtArea').value = item.message;
    if (item.timer !== -1) {
        stopTimer();
        document.getElementById('timer').value = item.timer;
        document.getElementById('timer').nextElementSibling.value = item.timer;
        if (item.timer === 0)
            setMessage("");
    }
}

function startTimer(timerName, divCountdown) {
    stopTimer();
    setMessage("");

    let mins = parseInt(document.getElementById(timerName).value);
    let seconds = mins * 60;

    myTimer = setInterval(function () {

        var minutes = seconds / 60 | 0;

        if (seconds < 0) {
            stopTimer();
            setMessage(mins + " minutes passed. Ended at " + getTime());
            new Audio('Alarm01.wav').play();
            return;
        }
        document.getElementById(divCountdown).innerHTML = minutes + ":" + (seconds - minutes * 60);
        seconds--;
    }, 1000);
}

function setMessage(msg) {
    document.getElementById('message').innerHTML = msg;
}

function getTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

