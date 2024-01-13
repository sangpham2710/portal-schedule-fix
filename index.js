javascript: (function () {
    const convertTime = function (time) {
        let [start, end] = time.split('-');
        let [start_hour, start_minute] = start.split(':');
        let [end_hour, end_minute] = end.split(':');

        if (start_hour === '07') {
            if (end_hour === '09') {
                return [1];
            } else if (end_hour === '11') {
                return [1, 2];
            } else {
                throw new Error('Invalid time');
            }
        } else if (start_hour === '09') {
            if (end_hour === '11') {
                return [2];
            } else {
                throw new Error('Invalid time');
            }
        } else if (start_hour === '13') {
            if (end_hour === '15') {
                return [3];
            } else if (end_hour === '17') {
                return [3, 4];
            } else {
                throw new Error('Invalid time');
            }
        } else if (start_hour === '15') {
            if (end_hour === '17') {
                return [4];
            } else {
                throw new Error('Invalid time');
            }
        }
    };

    let state = false;

    let button = document.createElement('input');
    button.type = 'button';
    button.value = 'Courses';
    button.addEventListener('click', function (event) {
        state = !state;
        if (state) {
            drawSchedule();
            button.value = 'Schedule';
        } else {
            head.innerHTML = oldHead;
            body.innerHTML = oldBody;
            button.value = 'Courses';
        }
    });
    button.classList.add('btn', 'btn-default', 'btn-primary', 'form-control');

    let panel = document.querySelector('.navbar-default');
    let div = document.createElement('div');
    div.classList.add('navbar-form', 'navbar-left');
    div.appendChild(button);
    panel.appendChild(div);

    let head = document.querySelector('table > thead > tr');
    let oldHead = head.innerHTML;
    let body = document.querySelector('table > tbody');
    let oldBody = body.innerHTML;

    const drawSchedule = function () {
        let schedule = [];
        schedule.push([
            'Time',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ]);
        schedule.push(new Array(7).fill(''));
        schedule[1][0] = '07:30 - 09:30';
        schedule.push(new Array(7).fill(''));
        schedule[2][0] = '09:30 - 11:30';
        schedule.push(new Array(7).fill(''));
        schedule[3][0] = '13:30 - 15:30';
        schedule.push(new Array(7).fill(''));
        schedule[4][0] = '15:30 - 17:30';

        courses = document.querySelectorAll('table > tbody > tr');
        for (let course of courses) {
            course_code = course.querySelectorAll('td')[1].textContent;
            course_name = course
                .querySelectorAll('td')[2]
                .querySelector("span[data-bind='text: TenMH']").textContent;
            class_code = course.querySelectorAll('td')[4].textContent;
            theory_classes = course
                .querySelectorAll('td')[9]
                .innerHTML.split('<br>');
            lab_classes = course
                .querySelectorAll('td')[10]
                .innerHTML.split('<br>');

            for (let theory of theory_classes) {
                if (theory === '') continue;
                let [weekday, time, ...room] = theory.split(' ');
                weekday = parseInt(weekday.substring(1)) - 1;
                time = convertTime(time);
                room = room.length > 0 ? room.join(' ').slice(1, -1) : '';
                for (let t of time) {
                    schedule[t][
                        weekday
                    ] = `<b>${course_code}</b> (${room})<br><i>${course_name}</i>`;
                }
            }
            for (let lab of lab_classes) {
                if (lab === '') continue;
                let [weekday, time, ...room] = lab.split(' ');
                weekday = parseInt(weekday.substring(1)) - 1;
                time = convertTime(time);
                room = room.length > 0 ? room.join(' ').slice(1, -1) : '';
                for (let t of time) {
                    schedule[t][
                        weekday
                    ] = `<b>${course_code}</b> (Lab) (${room})<br><i>${course_name}</i>`;
                }
            }
        }

        let scheduleHead = schedule.shift();
        head.innerHTML = scheduleHead
            .map(function (item, index) {
                return index === 0
                    ? `<th style="width: 90px;">${item}</th>`
                    : `<th>${item}</th>`;
            })
            .join('');

        body.innerHTML = '';
        for (let row of schedule) {
            let tr = document.createElement('tr');
            for (let item of row) {
                let td = document.createElement('td');
                td.innerHTML = item;
                tr.appendChild(td);
            }
            body.appendChild(tr);
        }
    };
})();
