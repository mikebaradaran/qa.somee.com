// set up the messages
const cboValues = [
    { cbo: "Select an option...", timer: 0, message: '' },
    { cbo: "Finish lab", timer: -1, message: 'Please put a ✔ when you have completed the lab' },
    { cbo: "ready to start", timer: -1, message: 'Please put a ✔ when you are ready to start 🐱‍🏍' },
    { cbo: "Coffee", timer: 15, message: 'Let\'s take a 15 minutes break ☕' },
    { cbo: "Lunch", timer: 60, message: 'Let\'s take 60 minutes for lunch 🍔' },
    { cbo: "mini break", timer: 5, message: 'Let\'s take a 5 minutes mini break ☕' },
    { cbo: "Course comments", timer: -1, message: '' },
    { cbo: "Course evaluation", timer: -1, message: '' }
];

async function setupForm1() {
    let res = await readFile('courseDetails.txt');
    let pcs = await readFile('pcs.txt');
    let students = await readFile('students.txt');

    getElement('courseTitle').innerHTML = res[0];
    getElement('courseMaterial').href = res[1];
    getElement('afa').value = res[2];
    getElement('email').value = res[3];
    getElement('password1').value = res[4];
    getElement('password2').value = res[5];
    getElement('mimeo').value = res[6];
    getElement("trainerEmail").innerHTML = res[7];
    getElement('trainerPC').href = res[8];
    getElement('ticks').src = "https://tick.qaalabs.com/mike/tutor";

    for (var i = 0; i < students.length; i++) {
        var ol = getElement("pcs");
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = pcs[i];
        a.target = "_blank";
        a.appendChild(document.createTextNode(students[i]));
        li.appendChild(a);
        ol.appendChild(li);
    }
}

function setupForm2() {
    document.querySelectorAll('input').forEach(txt =>
        txt.addEventListener('click', (event) => {
            event.target.select();
            navigator.clipboard.writeText(event.target.value)
            event.target.setAttribute("readonly", "true");
        }));

    cboValues.forEach(item => {
        let op = document.createElement('option');
        op.innerHTML = item.cbo;
        getElement('cboMessages').appendChild(op);
    });
}

function afa() {
    var copyText = getElement('afa');
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value).then(() => {
        let afaPath = "https://qa-learning.webex.com/webappng/sites/qa-learning/dashboard?siteurl=qa-learning";
        window.open(afaPath); //, '_blank');
    }, () => {
        console.error('Failed to start AFA');
    });
}

async function readFile(file) {
    let response = await fetch(file);
    let res = await response.text();
    return splitLines(res);
}

function splitLines(text) {
    return text.split('\n').filter(line => line.trim() !== '');
}

function getElement(id) {
    return document.getElementById(id);
}

setupForm1();
setupForm2();

//========================Timer and messages==============================
var myTimer = null;
function stopTimer() {
    if (myTimer !== null)
        clearInterval(myTimer);
}

function showTutorMessages() {
    let index = getElement('cboMessages').selectedIndex;
    if (index == 6) { // comments
        window.open("http://qa.somee.com/comments/");
        return;
    }
    if (index == 7) { // eval
        window.open("https://evaluation.qa.com/");
        return;
    }

    let item = cboValues[index];
    getElement('txtArea').value = item.message;
    if (item.timer !== -1) {
        stopTimer();
        getElement('timer').value = item.timer;
        getElement('timer').nextElementSibling.value = item.timer;
        if (item.timer === 0)
            setMessage("");
    }
}

function startTimer(timerName, divCountdown) {
    stopTimer();
    setMessage("");

    let mins = parseInt(getElement(timerName).value);
    let seconds = mins * 60;

    myTimer = setInterval(function () {

        var minutes = seconds / 60 | 0;

        if (seconds < 0) {
            stopTimer();
            setMessage(mins + " minutes passed. Ended at " + getTime());
            new Audio('Alarm01.wav').play();
            return;
        }
        getElement(divCountdown).innerHTML = minutes + ":" + (seconds - minutes * 60);
        seconds--;
    }, 1000);
}

function setMessage(msg) {
    getElement('message').innerHTML = msg;
}

function getTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
