const $wrapper = document.querySelector('#wrapper');
const $timerInput = document.getElementById('timer-input');
const $timer = document.querySelector('.timer');
const $start = document.getElementById('start');

const total = 16; // 전체 카드 숫자
const color = ['red', 'orange', 'yellow', 'green', 'white', 'pink', 'aqua', 'blueviolet'];
let colorCopy = color.concat(color); // 동일한 색 카드 만들기
let shuffled = [];// 섞인 카드들 보관
let clicked = [];//선택된 카드 보관
let completed = []; // 맞춘 카드 보관
let clickFlage = false; //깃발 표시를 통해 클릭 이벤트 동작 유무 조정
//타이머 만들기
let time = 0;
let timeInterval;
let timeresult;
let timeflage = false;

function timmer() {
    if(timeflage) {
        timeInterval = setInterval(() => {
            const hours = Math.floor(time/3600);
            const checkMinutes = Math.floor(time/60);
            const seconds = time % 60;
            const minutes = checkMinutes % 60;
            timeresult = `${hours < 10 ? `0${hours}` : hours} : ${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`;
            $timerInput.innerText = timeresult;
            time ++;
        }, 50);
    }
    return;
}

// 각 배열의 순차적인 값들을 뒤섞음
function shuffle() {
    for(let i = 0; colorCopy.length > 0; i += 1) {
        const randomIndex = Math.floor(Math.random() * colorCopy.length);
        shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1));
    }
}

// 섞인 카드들을 html에 생성
function creatCard(i) {
    const card = document.createElement('div');
    card.className = 'card';
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = shuffled[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    return card;
}

function clickEvent() {
    // 버그 수정 (카드 오픈 시 클릭되는 문제 및 중복 클릭, 완성한 카드 클릭 문제 방지)
    if(!clickFlage || completed.includes(this) || clicked[0] === this){
        return;
    }
    this.classList.toggle('flipped');
    clicked.push(this);
    // 두번째 카드가 클릭될 때까지 대기
    if(clicked.length != 2) {
        return;
    }
    // 두카드의 색이 동일한지 비교
    const firstCard = clicked[0].querySelector('.card-back').style.backgroundColor;
    const secondCard = clicked[1].querySelector('.card-back').style.backgroundColor;
    if(firstCard === secondCard) {
        completed.push(clicked[0]);
        completed.push(clicked[1]);
        clicked = [];
        if(completed.length !== total) {
            return;
        }

        clearInterval(timeInterval);
        //모든 카드를 맞출 경우 마지막 카드가 보여지고 메세지 띠우기
        setTimeout(() => {
            alert(`축하합니다. ${timeresult}만에 성공!!!!`)
            history.go(0);
            // reSetGame();
            return;
        }, 300);
    }
    //연속적인 카드 오픈으로 인한 버그 수정 (이벤트 루프 문제)
    clickFlage = false;
    setTimeout(() => {
        clicked[0].classList.remove('flipped');
        clicked[1].classList.remove('flipped');
        clicked=[];
        clickFlage = true;
    }, 600);
}
// 게임 다시 실행하기
function reSetGame() {
    $wrapper.innerHTML = '';
    colorCopy = color.concat(color);
    shuffled = [];
    completed =[];
    clickFlage = false;
    time = 0;
    timeflage = false;
    $start.style.display = 'inline-block';
}

// 게임 시작을 통해 카드가 뒤집히는 동작
function gameStart() {
    $start.style.display = 'none';
    shuffle();
    for (let i = 0; i < total; i ++) {
        const card = creatCard(i);
        // 각 카드에 대한 클릭 이벤트
        card.addEventListener('click', clickEvent);
        $wrapper.appendChild(card);
    }

    document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('flipped');
        }, 500 + 50 * index);
    });

    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card) => {
            card.classList.remove('flipped');
            clickFlage = true;
            timeflage = true;
            timmer();
        });
    }, 3000);
}

$start.addEventListener('click', gameStart);
