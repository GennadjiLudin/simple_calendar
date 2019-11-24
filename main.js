(function (selector) {
    var calendar = document.querySelector(selector);

    var nav = document.createElement('div');
    var prevLink = document.createElement('a');
    var infoDiv = document.createElement('div');
    var nextLink = document.createElement('a');
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    nav.classList.add('nav');
    calendar.appendChild(nav);

    prevLink.href='#';
    prevLink.innerHTML = '◀';
    prevLink.classList.add('prev');
    nav.appendChild(prevLink);

    infoDiv.classList.add('info');
    nav.appendChild(infoDiv);

    nextLink.href='#';
    nextLink.innerHTML = '▶';
    nextLink.classList.add('next');
    nav.appendChild(nextLink);

    calendar.appendChild(table);

    thead.id = 'week-day-names';
    table.appendChild(thead);

    tbody.classList.add('dates');
    table.appendChild(tbody);

    var dates = document.querySelector('.dates');
    var weekDayNames = document.querySelector('#week-day-names');
    var info = document.querySelector('.info');
    var next = document.querySelector('.next');
    var prev = document.querySelector('.prev');


    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();

    drawCalendar(year, month, calendar);

    prev.addEventListener('click', function () {
        year = getPrevYear(year, month);
        month = getPrevMonth(month);
        drawCalendar(year, month, calendar);
    });

    next.addEventListener('click', function () {
        year = getNextYear(year, month);
        month = getNextMonth(month);
        drawCalendar(year, month, calendar);
    });

    function drawCalendar(year, month) {
        showInfo(year, month, info);
        drawDates(year, month, dates);
        showCurrentDay(dates);
    }

    function showCurrentDay(dates) {
        var currentDate = date.getDate();
        var currentYear = date.getFullYear();
        var currentMonth = date.getMonth();

        if (currentMonth == month && currentYear == year) {
            var tds = dates.querySelectorAll('td');
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].innerHTML == currentDate) {
                    tds[i].classList.add('currentDate');
                }
            }
        }
    }

    function drawDates(year, month, dates) {
        var arr = [];
        var from = 1;
        var to = getLastDateOfMonth(year, month);
        var firstElemsNum = getFirstElemsNum(year, month);
        var lastElemsNum = getLastElemsNum(year, month);
        arr = range(arr, from, to);

        var LastDateOfPrevMonth = getLastDateOfPrevMonth(year, month);

        var arrPrev = [];
        var arrNext = [];
        var arrPrev = addFirstElemsNum(firstElemsNum, LastDateOfPrevMonth, arrPrev);
        var arrNext = addLastElemsNum(lastElemsNum, from, arrNext);

        drawWeekDayNames(weekDayNames);
        createTable(arr, arrPrev, arrNext, dates, firstElemsNum);
    }

    function createTable(arr, arrPrev, arrNext, parent, firstElemsNum) {
        parent.innerHTML = '';
        for (var i = 0; i < 6; i++) {
            var tr = document.createElement('tr');
            if (i === 0) {
                createTd(arrPrev, tr, "prev");
                let arrCurRow = arr.splice(0, 7 - firstElemsNum);
                createTd(arrCurRow, tr);
                parent.appendChild(tr);
                continue;
            }

            let arrCurRow = arr.splice(0, 7);
            createTd(arrCurRow, tr);

            if (arrCurRow.length < 7) {
                arrCurRow = arrNext.splice(0, 7 - arrCurRow.length);
                createTd(arrCurRow, tr, "next");
                parent.appendChild(tr);
                continue;
            }
            parent.appendChild(tr);
        }
    }

    function createTd(arr, parent, type) {
        for (var j = 0; j < arr.length; j++) {
            var td = document.createElement('td');
            td.innerHTML = arr[j];
            switch (type) {
                case 'prev':
                    td.id = `${year}${setNumWithZero(month - 1)}${setNumWithZero(arr[j])}`;
                    td.classList.add('empty');
                    td.addEventListener('click', () => {
                        year = getPrevYear(year, month);
                        month = getPrevMonth(month);
                        drawCalendar(year, month, calendar);
                    });
                    break;
                case 'next':
                    td.id = `${year}${setNumWithZero(month + 1)}${setNumWithZero(arr[j])}`;
                    td.classList.add('empty');
                    td.addEventListener('click', () => {
                        year = getNextYear(year, month);
                        month = getNextMonth(month);
                        drawCalendar(year, month, calendar);
                    });
                    break;
                default:
                    td.id = `${year}${setNumWithZero(month)}${setNumWithZero(arr[j])}`;
                    td.classList.add('dates__cell');
                    break;
            }
            parent.appendChild(td);
        }
    }

    function range(arr, from, to) {
        for (var i = from; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    }

    function addFirstElemsNum(num, elem, arr) {
        for (var i = 0; i < num; i++) {
            arr.unshift(elem);
            elem--;
        }
        return arr;
    }

    function addLastElemsNum(num, elem, arr) {
        for (var i = 0; i < num; i++) {
            arr.push(elem);
            elem++;
        }
        return arr;
    }

    function getLastDateOfMonth(year, month) {
        var date = new Date(year, month + 1, 0);
        return date.getDate();
    }

    function getFirstElemsNum(year, month) {
        var jsFirstDay = getFirstDayOfMonth(year, month);
        var realFirstDay = getRealDayOfWeek(jsFirstDay);
        return realFirstDay - 1;
    }

    function getLastElemsNum(year, month) {
        var jsLastDay = getLastDayOfMonth(year, month);
        var realLastDay = getRealDayOfWeek(jsLastDay);
        return 7 - realLastDay + 7;
    }

    function getRealDayOfWeek(jsDay) {
        if (jsDay == 0) {
            return 7;
        } else {
            return jsDay;
        }
    }

    function getFirstDayOfMonth(year, month) {
        var date = new Date(year, month, 1);
        return date.getDay();
    }

    function getLastDayOfMonth(year, month) {
        var date = new Date(year, month + 1, 0);
        return date.getDay();
    }

    function getLastDateOfPrevMonth(year, month) {
        var date = new Date(year, month, 0);
        return date.getDate();
    }

    function getNextYear(year, month) {
        if (month == 11) {
            return year + 1;
        } else {
            return year;
        }
    }

    function getNextMonth(month) {
        if (month == 11) {
            return 0;
        } else {
            return month + 1;
        }
    }

    function getPrevYear(year, month) {
        if (month == 0) {
            return year - 1;
        } else {
            return year;
        }
    }

    function getPrevMonth(month) {
        if (month == 0) {
            return 11;
        } else {
            return month - 1;
        }
    }

    function showInfo(year, month, elem) {
        elem.innerHTML = getMonthName(month) + ' ' + year;
    }

    function drawWeekDayNames(parent) {
        parent.innerHTML = '';
        var dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        var tr = document.createElement('tr');
        for (var i = 0; i < dayNames.length; i++) {
            var td = document.createElement('td');
            td.innerHTML = dayNames[i];
            tr.appendChild(td);
        }
        parent.appendChild(tr);
    }

    function getMonthName(num) {
        var monthes = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return monthes[num];
    }

    function setNumWithZero(num) {
        if (num < 10) {
            return num = '0' + num;
        } else {
            return num;
        }
    }
}('.calendar'));