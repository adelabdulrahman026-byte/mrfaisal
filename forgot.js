// 1. رسم وتكوين واجهة الاسترجاع (HTML & CSS)
document.getElementById('app').innerHTML = `
    <style>body { font-family: 'Tajawal', sans-serif; }</style>
    <div class="bg-white w-full p-8 rounded-[2rem] shadow-2xl text-center mx-auto">
        <h1 class="text-2xl font-black text-slate-800 mb-2">استرجاع الباسورد</h1>
        <p class="text-sm text-slate-500 mb-6">اكتب رقم هاتفك المسجل في المنصة</p>
        <form onsubmit="handleRec(event)" class="space-y-4">
            <input type="tel" id="phone" required placeholder="رقم الهاتف (مثال: 010...)" class="w-full p-4 rounded-xl border-2 border-slate-100 outline-none">
            <button type="submit" id="btn" class="w-full bg-slate-800 text-white font-bold py-4 rounded-xl">إرسال لـ الواتساب</button>
        </form>
        <div id="res" class="mt-4 font-bold text-sm hidden p-3 rounded-xl"></div>
        <div class="mt-4 border-t pt-4"><a href="login.html" class="text-slate-500 text-sm font-bold">العودة للدخول</a></div>
    </div>
`;

// 2. إعدادات وأكواد العمليات الخاصة بالاسترجاع
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZqkJT1InnRm11laZpALoHnIHJmv4VbFW3BzXYrAJk836MOBroxMqm8H21H1nIXrg/exec";

function handleRec(e) {
    e.preventDefault(); 
    const btn = document.getElementById('btn');
    const res = document.getElementById('res'); 
    
    btn.innerText = 'جاري الإرسال...'; 
    btn.disabled = true; 
    res.classList.add('hidden');
    
    fetch(SCRIPT_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "recover", phone: document.getElementById('phone').value }) 
    })
    .then(r => r.json())
    .then(data => {
        res.classList.remove('hidden');
        if(data.status === "success") { 
            res.className = 'mt-4 font-bold text-sm p-3 rounded-xl bg-green-50 text-green-700'; 
            res.innerText = '✅ ' + data.message; 
            btn.innerText = 'تم الإرسال'; 
        } else { 
            res.className = 'mt-4 font-bold text-sm p-3 rounded-xl bg-red-50 text-red-700'; 
            res.innerText = '❌ ' + data.message; 
            btn.innerText = 'إرسال'; 
            btn.disabled = false; 
        }
    }).catch(() => { 
        res.className = 'mt-4 font-bold text-sm p-3 rounded-xl bg-red-50 text-red-700'; 
        res.innerText = '❌ خطأ بالاتصال'; 
        res.classList.remove('hidden'); 
        btn.disabled = false; 
    });
}

// 3. الخطوة دي أهم حاجة عشان الدالة تشتغل بعد ما تشفر الكود (بتربطها بالمتصفح)
window.handleRec = handleRec;

// 4. كود الحماية لمنع كليك يمين واختصارات المطورين
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.onkeydown = function(e) {
    if (e.keyCode === 123) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) return false;
};
