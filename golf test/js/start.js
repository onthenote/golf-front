const main = document.querySelector("#main");
const qna = document.querySelector("#qna") ;


const answer_a = document.querySelector("#answer_a");
const answer_b = document.querySelector("#answer_b");

const result_page = document.querySelector("#result_page");
const spinner = document.querySelector("#spinner");
const result_show = document.querySelector("#result_show");

const endPoint = 12 ;
let qIdx = 0 ;
const select = {E:0,I:0,S:0,N:0,F:0,T:0,P:0,J:0}

// 이미지 URL 배열
let mbti = {'ENFP': ['INFJ', 'INTJ']
, 'ENFJ': ['ISFP', 'INFP']
, 'ENTP': ['INTJ', 'INFJ']
, 'ENTJ': ['INFP', 'INTP']
, 'ESFP': ['ISFJ', 'ISTJ']
, 'ESFJ': ['ISTP', 'ISFP']
, 'ESTP': ['ISFJ', 'ISTJ']
, 'ESTP': ['INTP', 'ISFP']
, 'INFP': ['ENTJ', 'ENFJ']
, 'INFJ': ['ENFP', 'ENTP']
, 'INTP': ['ENTJ', 'ESTP']
, 'INTJ': ['ENFP', 'ENTP']
, 'ISFP': ['ENFJ', 'ESFJ']
, 'ISFJ': ['ESFP', 'ESTP']
, 'ISTP': ['ESFJ', 'ESTP']
, 'ISTJ': ['ESFP', 'ESTP']
}
let keys = Object.keys(mbti);
let images = {};

// 이미지를 미리 다운로드하고 캐싱
for (let i = 0; i < keys.length; i++) {
    let image = new Image();
    image.src = './img/'+keys[i]+'.png';
    images[keys[i]] = image ;
}

// 버튼 클릭시 카운트 증가
document.getElementById('start').onclick = async function() {
    const response = await fetch(API_URL, { method: 'POST' });
    const data = await response.json();
    begin(); // 시작   
    document.getElementById('visitorCount').innerHTML = data.count;
};

function begin(){
    main.style.WebkitAnimation = "fadeOut 1s" ;
    main.style.animation = "fadeOut 1s";

    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadeIn 1s" ;
        setTimeout(() => {
            main.style.display = "none" ;
            qna.style.display = "block" ;
        }, 450)
        goNext(qIdx)
    }, 450)    
}

function goNext(qIdx){
    if(qIdx === endPoint){
        goResult();
        return ;
    }
    var q = document.querySelector('.qBox');
    q.innerHTML = '📌  ' + qnaList[qIdx].q;

    for(let i in qnaList[qIdx].a){
        addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
    }
    var status = document.querySelector('.statusBar');
    var status_cnt = document.querySelector('.status_cnt')
    status.style.width = (100/endPoint) * (qIdx+1) + '%';
    status_cnt.innerText = ((qIdx) + 1) + ' / 12';
}

function addAnswer(answerText, qIdx, idx){
    var a = document.querySelector('.answerBox');
    var answer = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('my-1');
    answer.classList.add('py-3');
    answer.classList.add('px-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');
    answer.classList.add('paragraph');

    a.appendChild(answer);
    answer.innerHTML = answerText;

    answer.addEventListener("click", function(){
        var children = document.querySelectorAll('.answerList');
        for(let i = 0; i < children.length; i++){
            children[i].disabled = true ;
            // children[i].style.WebkitAnimation = "fadeOut 0.5s" ;
            // children[i].style.animation = "fadeOut 0.5s";
        }
        if (qIdx + 1 == endPoint){
            let target = qnaList[qIdx].a[idx].type;
            select[target] += 1 ;

            for(let i = 0; i < children.length; i++){
                children[i].style.display = 'none';
            }
            goNext(++qIdx);            
        } else {
            let target = qnaList[qIdx].a[idx].type;
            select[target] += 1 ;

            for(let i = 0; i < children.length; i++){
                children[i].style.display = 'none';
            }
            goNext(++qIdx);
        }
    }, false);
}

function goResult(){
    qna.style.WebkitAnimation = "fadeOut 0.5s" ;
    qna.style.animation = "fadeOut 0.5s"

    setTimeout(() => {
        qna.style.display = "none" ;
        result_page.style.WebkitAnimation = "fadeIn 1s";
        result_page.style.animation = "fadeIn 1s" ;
        setTimeout(() => {
            
            result_page.style.display = "block" ;
            spinner.classList.remove("hide");
        }, 450)
    }, 450)

    setTimeout(() => {
        result_show.style.WebkitAnimation = "fadeIn 1s";
        result_show.style.animation = "fadeIn 1s" ;
        result_show.style.display = "block";
        spinner.classList.add("hide");
        const resultName = document.querySelector("#result");
        resultName.classList.remove("d-flex");
        resultName.classList.remove("align-items-center");
        resultName.classList.remove("justify-content-center");
        getResult();
    }, 450 + 2000)    
    // setResult();
}

function calResult(){
    let res = [0,0,0,0] 
    res[0] = select['E'] > select['I'] ? 'E' : 'I'; 
    res[1] = select['S'] > select['N'] ? 'S' : 'N';
    res[2] = select['F'] > select['T'] ? 'F' : 'T';
    res[3] = select['P'] > select['J'] ? 'P' : 'J';
    let returnMBTI = res[0] + res[1] + res[2] + res[3];
    return returnMBTI;
}

function getResult(){
    let point = calResult();
    const resultName = document.querySelector("#type");
    let type = infoList[point].name;
    type = type.replace(/\n/g, '<br/>');
    resultName.innerHTML = type;

    const resultDesc = document.querySelector("#resultDescription");
    let tag = document.createElement('p');
    tag.classList.add("desc");
    tag.innerText = hashtag[point][0];
    tag.style.fontSize = "19px" ;
    resultDesc.appendChild(tag);

    for (let i = 0; i < infoList[point]['comment'].length;i++){
        let desc = document.createElement('p');
        desc.classList.add("desc");
        desc.innerText = '✔️ ' + infoList[point].comment[i];
        desc.style.fontSize = "17px" ;
        resultDesc.appendChild(desc);
    }
    

    const imgDiv = document.querySelector('#resultImg');
    let Img = document.createElement('img');

    Img.src = images[point].src;
    Img.alt = point;
    // Img.style.height = '66%';
    Img.classList.add("img-fluid");
  
    imgDiv.appendChild(Img);

    let player = document.createElement('p');
    // player.classList.add("desc");
    player.innerText = hashtag[point][1];
    player.style.fontSize = "16px" ;
    imgDiv.appendChild(player);

    let card1 = document.querySelector('.card1');
    card1.src = images[mbti[point][0]].src;
    card1.alt = mbti[point][0];
    card1.classList.add("img-fluid");

    let card_text1 = document.querySelector('.card-text1');
    card_text1.innerHTML = infoList[mbti[point][0]].name;

    let card2 = document.querySelector('.card2');
    card2.src = images[mbti[point][1]].src;
    card2.alt = mbti[point][1];
    card2.classList.add("img-fluid");
    
    let card_text2 = document.querySelector('.card-text2');
    card_text2.innerHTML = infoList[mbti[point][1]].name;
}

// API 경로
const API_URL = 'https://port-0-golftest-29i2dlhrqa0oh.sel4.cloudtype.app/api/count';

// 카운트를 가져오는 함수
async function getCount() {
  const response = await fetch(API_URL);
  const data = await response.json();
  // console.log(data);
  return data.count;
}

// 페이지 로드시 카운트 가져오기
window.onload = async function() {
  const count = await getCount();
  const countWithCommas = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // console.log(countWithCommas);
  document.getElementById('visitorCount').innerHTML = countWithCommas;

  // 카운트를 적용시킬 요소
  const $counter = document.querySelector("#visitorCount");
  // 목표 수치
  const max = count;
  
  setTimeout(() => counter($counter, max), 500);
};






const counter = ($counter, max) => {
  let now = max;

  const handle = setInterval(() => {
    $counter.innerHTML = Math.ceil(max - now).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    // 목표수치에 도달하면 정지
    if (now < 1) {
      clearInterval(handle);
    }
    
    // 증가되는 값이 계속하여 작아짐
    const step = now / 10;
    
    // 값을 적용시키면서 다음 차례에 영향을 끼침
    now -= step;
  }, 50);
}