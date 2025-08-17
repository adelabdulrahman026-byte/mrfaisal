// File: exam.js
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const screens = {
    start: $('#screen-start'),
    exam: $('#screen-exam'),
    result: $('#screen-result'),
  };

  const startForm = $('#start-form');
  const examForm = $('#exam-form');

  const startError = $('#start-error');
  const examError = $('#exam-error');

  const countdownEl = $('#countdown');

  const scoreEl = $('#score-value');
  const rankEl = $('#rank-value');
  const totalEl = $('#total-value');

  const leaderboardBody = $('#leaderboard tbody');
  const refreshBtn = $('#refresh-leaderboard');

  const confettiCanvas = $('#confetti-canvas');

  const ENDPOINT = window.GAS_ENDPOINT;
  const DURATION_MIN = window.EXAM_DURATION_MIN || 20;

  let student = { name:'', id:'' };
  let timer = { endAt: 0, t: null };
  let token = '';

  // ---- Helpers
  const api = {
    async enter(id, name){
      const url = `${ENDPOINT}?action=enter&studentId=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`;
      const res = await fetch(url);
      return res.json();
    },
    async me(id){
      const url = `${ENDPOINT}?action=me&studentId=${encodeURIComponent(id)}`;
      const res = await fetch(url);
      return res.json();
    },
    async leaderboard(){
      const url = `${ENDPOINT}?action=leaderboard`;
      const res = await fetch(url);
      return res.json();
    },
    async submit(payload){
      const res = await fetch(ENDPOINT, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    }
  };

  function show(name){
    Object.values(screens).forEach(s => s.classList.remove('show'));
    screens[name].classList.add('show');
  }

  function startCountdown(minutes){
    const now = Date.now();
    timer.endAt = now + minutes * 60 * 1000;
    if(timer.t) clearInterval(timer.t);
    timer.t = setInterval(() => {
      const left = timer.endAt - Date.now();
      if(left <= 0){
        countdownEl.textContent = 'انتهى الوقت';
        clearInterval(timer.t);
        examForm.requestSubmit();
        return;
      }
      const m = Math.floor(left/60000);
      const s = Math.floor((left%60000)/1000);
      countdownEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
    }, 200);
  }

  function readAnswers(){
    const answers = {};
    $$('.opts').forEach(group => {
      const qid = group.getAttribute('data-qid');
      const checked = group.querySelector('input:checked');
      answers[qid] = checked ? checked.value : null;
    });
    return answers;
  }

  function fillLeaderboard(rows){
    leaderboardBody.innerHTML = '';
    rows.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.rank}</td>
        <td>${r.name}</td>
        <td>${r.studentId}</td>
        <td><strong>${r.score}</strong></td>
        <td>${r.enter_at}</td>
        <td>${r.submit_at}</td>
      `;
      // تمييز صف الطالب
      if(r.studentId === student.id) tr.style.background = 'rgba(0, 212, 255, .08)';
      leaderboardBody.appendChild(tr);
    });
  }

  function burstConfetti(){
    try{
      // مكتبة خفيفة للكونفيتي
      confetti.create(confettiCanvas, { resize:true, useWorker:true })({
        particleCount: 160, spread: 80, startVelocity: 35, scalar: 1.1
      });
      setTimeout(() => {
        confetti.create(confettiCanvas, { resize:true, useWorker:true })({
          particleCount: 120, spread: 100, startVelocity: 25, scalar: 0.9
        });
      }, 600);
    }catch(e){}
  }

  // ---- Start Screen
  startForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    startError.textContent = '';
    const name = $('#student-name').value.trim();
    const id = $('#student-id').value.trim();

    if(!name || !id){
      startError.textContent = 'من فضلك اكمل البيانات.';
      return;
    }

    try{
      // تحقق من حالته وسجّل أول دخول
      const info = await api.enter(id, name); // يسجل enter_at أول مرة فقط
      if(info.status === 'completed'){
        startError.textContent = 'لقد قمت بتسليم الامتحان من قبل. لا يُسمح بالمحاولة مرة أخرى.';
        return;
      }

      student = { name, id };
      token = info.token || ''; // توكن بسيط ضد إعادة الإرسال

      show('exam');
      startCountdown(DURATION_MIN);
    }catch(err){
      startError.textContent = 'حدث خطأ أثناء بدء الامتحان. جرّب مرة أخرى.';
    }
  });

  // ---- Exam submit
  examForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    examError.textContent = '';
    const answers = readAnswers();

    try{
      const payload = {
        action: 'submit',
        studentId: student.id,
        name: student.name,
        token,
        answers
      };
      const res = await api.submit(payload);

      if(res.error === 'already_submitted'){
        examError.textContent = 'لقد قمت بالتسليم مسبقًا.';
        return;
      }
      if(res.error){
        examError.textContent = 'تعذر التسليم: ' + res.error;
        return;
      }

      // عرض النتيجة
      scoreEl.textContent = res.score;
      rankEl.textContent = res.rank + ' من ' + res.total;
      totalEl.textContent = res.total;

      // لوحة
      fillLeaderboard(res.leaderboard || []);
      show('result');
      burstConfetti();

      // تحديث دوري للوحة
      setInterval(async () => {
        const data = await api.leaderboard();
        fillLeaderboard(data.rows || []);
      }, 15000);

    }catch(err){
      examError.textContent = 'تعذر التسليم. تحقق من الاتصال وحاول مرة أخرى.';
    }
  });

  // ---- Manual refresh
  refreshBtn.addEventListener('click', async () => {
    const data = await api.leaderboard();
    fillLeaderboard(data.rows || []);
  });

})();
