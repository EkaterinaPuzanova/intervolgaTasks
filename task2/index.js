
const carNumber = document.getElementById('car-number');
const carName = document.getElementById('car-name');
const date = document.getElementById('date');
const driverName = document.getElementById('driver-name');
const passportSeries = document.getElementById('passport-series');
const passportNumber = document.getElementById('passport-number');
const passportOffice = document.getElementById('passport-office');
const passportDate = document.getElementById('passport-date');

const arrInput = [carNumber, carName, date, driverName, passportSeries, passportNumber, passportOffice, passportDate];

// Записываем в localStorage при вводе в input
arrInput
    .forEach(input => input.addEventListener('input', function(e) {
        if (input.classList.value.includes('error')) {
            input.classList.remove('error')
        }

        localStorage.setItem(input.id, e.target.value);
    }));

// Получаем данные с localStorage, если такие есть
arrInput
    .forEach(input => input.value = localStorage.getItem(input.id) || '');


const FORM = document.querySelector('.form');
const FORMINPUTS = document.querySelectorAll('.input');

// Валидация гос. номера
function validateCarNumber(num) {
    let re = /^(а|в|е|к|м|н|о|р|с|т|у|х){1}[0-9]{3}(а|в|е|к|м|н|о|р|с|т|у|х){2}$/gi;
    return re.test(num);
}

// Валидация даты пример 2024-08-07
function validateDate(date) {

    if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) return false;

    let parts = date.split('-');
    let day = parseInt(parts[2], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[0], 10);

    if (year < 1990 || year > 2025 || month == 0 || month > 12)
        return false;

    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    if (year % 100 != 0 && year % 4 == 0)
        monthLength[1] = 29;

    return day > 0 && day <= monthLength[month - 1];
}

// Валидация ФИО
function validateName(str) {
    let parts = str.split(' ');
    let surname = parts[0];
    let name = parts[1];
    let otch = parts[2];

    if (!/^[А-ЯЁ][а-яё]{0,30}(( |-)([А-ЯЁ][а-яё]{0,30})){0,2}$/.test(surname)) return false;
    if (!/^[А-ЯЁ][а-яё]{0,30}(( |-)([А-ЯЁ][а-яё]{0,30})){0,2}$/.test(name)) return false;
    if (!/^[А-ЯЁ][а-яё]{0,30}(( |-)([а-яё]{0,30})){0,2}$/.test(otch)) return false;

    return true;
}

// Валидация серии паспорта
function validatePassportSeries(num) {
    if (!/^\d{4}$/.test(num)) return false;
    return true;
}

// Валидация номера паспорта
function validatePassportNumber(num) {
    if (!/^\d{6}$/.test(num)) return false;
    return true;
}


// Отправка формы
FORM.onsubmit = function(event) {
    let objResult = {
        'carNumber': carNumber.value,
        'carName': carName.value,
        'date': date.value,
        'driverName': driverName.value,
        'passportSeries': passportSeries.value,
        'passportNumber': passportNumber.value,
        'passportOffice': passportOffice.value,
        'passportDate': passportDate.value
    }
    let emptyInputs = Array.from(FORMINPUTS).filter(el => el.value === '');

    FORMINPUTS.forEach(function(el) {
        if (el.value === '') {
            el.classList.add('error');

        } else {
            el.classList.remove('error');
        }
    });

    if (emptyInputs.length !== 0) {
        console.log('Fill in all the fields');
        return false;
    }

    if (!validateCarNumber(carNumber.value)) {
        console.log('carNumber not valid', carNumber.value);
        carNumber.classList.add('error');
        return false;
    } else {
        carNumber.classList.remove('error');
    }

    // Дата прибытия транспортного средства к покупателю не может быть раньше сегодняшнего дня.
    if (!validateDate(date.value) || (date.value < new Date().toISOString().substring(0, 10))) {
        console.log('date not valid', date.value);
        date.classList.add('error');
        return false;
    } else {
        date.classList.remove('error');
    }

    // Дата выдачи паспорта не может быть позже сегодняшнего дня.
    if (!validateDate(passportDate.value) || (passportDate.value > new Date().toISOString().substring(0, 10))) {
        console.log('passportDate not valid', passportDate.value);
        passportDate.classList.add('error');
        return false;
    } else {
        passportDate.classList.remove('error');
    }

    if (!validateName(driverName.value)) {
        console.log('driverName not valid', driverName.value);
        driverName.classList.add('error');
        return false;
    } else {
        driverName.classList.remove('error');
    }

    if (!validatePassportSeries(passportSeries.value)) {
        console.log('passportSeries not valid', passportSeries.value);
        passportSeries.classList.add('error');
        return false;
    } else {
        passportSeries.classList.remove('error');
    }

    if (!validatePassportNumber(passportNumber.value)) {
        console.log('passportNumber not valid', passportNumber.value);
        passportNumber.classList.add('error');
        return false;
    } else {
        passportNumber.classList.remove('error');
    }

    let muJSON = JSON.stringify(objResult);
    event.preventDefault();
    console.log('Форма успешно отправлена' , muJSON); 
}

// Сброс формы
FORM.onreset = function() {
    localStorage.clear();
    console.log('LocalStorage is clear');
}