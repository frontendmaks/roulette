let deposit = 100;
let order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
let selectedNumber = null;
let amountMoney = null;

let depositElem = document.getElementById('deposit-number');
depositElem.innerHTML = `Депозит: <strong>${deposit} грн.</strong>`;

$(document).ready(function () {
    // викликаємо функцію, яка створює масив з картками
    initWheel();

    //підключаємось до сокета
    const socket = new WebSocket('ws://localhost:8080');

    $('button').on('click', function () {
        selectedNumber = $('#number-input').val();
        amountMoney = $('#bet-input').val();
        if (selectedNumber != '' && amountMoney != '') {
            if (selectedNumber < 0 || selectedNumber > 14) {
                alert('Виберіть число від 0 до 14!');
            } else if (amountMoney < 0 || amountMoney > deposit) {
                alert('Виберіть коректну суму депозиту!');
            } else {
                socket.send('');
            }
        } else {
            alert('Заповніть всі поля!');
        }
    });

    socket.addEventListener('message', (event) => {
        const num = parseInt(event.data);
        spinWheel(num);
    });
});

function bet(numFromSocket) { 
    deposit -= amountMoney;
    depositElem.innerHTML = `Депозит: <strong>${deposit} грн.</strong>`;

    setTimeout(function () {
        if (parseInt(selectedNumber) === numFromSocket && numFromSocket > 0 && numFromSocket < 15) {
            let winMoney = amountMoney * 10;
            deposit += winMoney;
            depositElem.innerHTML = `Депозит: <strong>${deposit} грн.</strong>`;
            alert('Ви виграли! Ваш прибуток: ' + winMoney + 'грн.');
        } else if (parseInt(selectedNumber) === numFromSocket && numFromSocket === 0) {
            let winMoney = amountMoney * 35;
            deposit += winMoney;
            depositElem.innerHTML = `Депозит: <strong>${deposit} грн.</strong>`;
            alert('Ви виграли! Ваш прибуток: ' + winMoney + 'грн.');
        } else {
            alert('Ви програли!');
        }
    }, 7 * 1000)
}

function initWheel() {
    // тут ми створюємо масив з картками цифр
    var $wheel = $('.roulette-wrapper .wheel'),
        row = "";

    row += "<div class='row'>";
    row += "  <div class='card red'>1<\/div>";
    row += "  <div class='card black'>14<\/div>";
    row += "  <div class='card red'>2<\/div>";
    row += "  <div class='card black'>13<\/div>";
    row += "  <div class='card red'>3<\/div>";
    row += "  <div class='card black'>12<\/div>";
    row += "  <div class='card red'>4<\/div>";
    row += "  <div class='card green'>0<\/div>";
    row += "  <div class='card black'>11<\/div>";
    row += "  <div class='card red'>5<\/div>";
    row += "  <div class='card black'>10<\/div>";
    row += "  <div class='card red'>6<\/div>";
    row += "  <div class='card black'>9<\/div>";
    row += "  <div class='card red'>7<\/div>";
    row += "  <div class='card black'>8<\/div>";
    row += "<\/div>";

    for (var x = 0; x < 29; x++) {
        $wheel.append(row);
    }
}

function spinWheel(roll) {
    var $wheel = $('.roulette-wrapper .wheel'),
        // індекс введеного значення 
        position = order.indexOf(roll);

    //визначаємо місце до якого зміщуємо 
    var rows = 12,
        card = 75 + 3 * 2,
        landingPosition = (rows * 15 * card) + (position * card);

    //легке зміщення, щоб вибір не показував на центр картки, а додавав зміщення від центру
    var randomize = Math.floor(Math.random() * 75) - (75 / 2);

    // загальне зміщення колеса
    landingPosition = landingPosition + randomize;

    //задаємо час анімації і анімуємо зміщення по осі Х на потрібне значення
    $wheel.css({
        'transition-duration': '7s',
        'transform': 'translate3d(-' + landingPosition + 'px, 0px, 0px)'
    });

    bet(roll);

    setTimeout(function () {
        var resetTo = -(position * card + randomize);

        //перезавантажуємо колесо
        $wheel.css({
            'transition-duration': '',
            'transform': 'translate3d(' + resetTo + 'px, 0px, 0px)'
        });
    }, 7 * 1000);
}