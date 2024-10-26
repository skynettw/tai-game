// 假設資料已經從伺服器取得，這是遊戲的題目資料
const questions = [
  {
    "item": "鄭成功是台灣歷史上哪一位開台英雄？",
    "correct": "鄭成功",
    "wrong": ["劉銘傳", "施琅"]
  },
  {
    "item": "誰是台灣第一位本土出生的總統？",
    "correct": "李登輝",
    "wrong": ["蔣經國", "馬英九"]
  },
  {
    "item": "蔣經國擔任台灣總統的時間是從何時開始？",
    "correct": "1978年",
    "wrong": ["1988年", "1975年"]
  },
  {
    "item": "台灣史上誰成功實施了土地改革？",
    "correct": "陳誠",
    "wrong": ["鄭南榕", "吳國楨"]
  },
  {
    "item": "誰是台灣最早推動三民主義的國父？",
    "correct": "孫中山",
    "wrong": ["蔣中正", "馮玉祥"]
  }
  // 加入更多問題
];

let currentQuestionIndex = 0;
let shuffledAnswers = [];
let score = 0;

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById('question').textContent = currentQuestion.item;
  
  // 將正確答案和錯誤答案混合
  shuffledAnswers = [...currentQuestion.wrong, currentQuestion.correct];
  shuffledAnswers.sort(() => Math.random() - 0.5);
  
  // 更新選項文字
  const buttons = document.getElementsByClassName('answer-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].textContent = shuffledAnswers[i];
  }
  
  document.getElementById('result').textContent = '';
  document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(index) {
  const currentQuestion = questions[currentQuestionIndex];
  const resultElement = document.getElementById('result');
  if (shuffledAnswers[index] === currentQuestion.correct) {
    resultElement.textContent = '答對了！';
    score++;
  } else {
    resultElement.textContent = `答錯了，正確答案是：${currentQuestion.correct}`;
  }
  document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  document.getElementById('question-box').style.display = 'none';
  document.getElementById('result').textContent = `遊戲結束！你得到了 ${score}/${questions.length} 分！`;
}

// 初始化遊戲
loadQuestion();
