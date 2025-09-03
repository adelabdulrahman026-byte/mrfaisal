// بيانات API واتساب
const API_URL = 'https://wapilot.net/api/v1/';
const INSTANCE_ID = 'instance1680';
const API_TOKEN = 'LGQTaKiC0BCmDkQMyMoj9Bep3usAEJSro0zzC35bnJ';

// رقم المجموعة
const GROUP_INVITE_LINK = 'https://chat.whatsapp.com/Fiext2ND1LC6Bhr4ch1COJ';

// OTPs التي تم إنشاؤها (سيتم استبدالها ببيانات من Google Sheets)
let generatedOTPs = {};

// دالة لإرسال OTP
function sendOTP() {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value.trim();
    const messageEl = document.getElementById('message');
    const loader = document.getElementById('loader');
    
    // التحقق من إدخال رقم الهاتف
    if (!phone) {
        showMessage('يرجى إدخال رقم الهاتف', 'error');
        return;
    }
    
    // إظهار Loader
    loader.style.display = 'block';
    messageEl.style.display = 'none';
    
    // إنشاء رمز OTP عشوائي (4 أرقام)
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    // حفظ OTP للمستخدم
    generatedOTPs[phone] = otp.toString();
    
    // إعداد رسالة OTP
    const message = `رمز التحقق الخاص بك هو: ${otp}. يرجى إدخاله للانضمام إلى المجموعة.`;
    
    // إرسال الرسالة عبر واتساب API
    fetch(`${API_URL}${INSTANCE_ID}/send-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
            phone: phone,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        loader.style.display = 'none';
        
        if (data.success) {
            showMessage('تم إرسال رمز التحقق إلى رقم الهاتف الخاص بك', 'success');
            // الانتقال إلى الخطوة الثانية
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
        } else {
            showMessage('فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.', 'error');
        }
    })
    .catch(error => {
        loader.style.display = 'none';
        showMessage('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.', 'error');
        console.error('Error:', error);
    });
}

// دالة للتحقق من OTP
function verifyOTP() {
    const phone = document.getElementById('phone').value.trim();
    const otpInput = document.getElementById('otp');
    const otp = otpInput.value.trim();
    const messageEl = document.getElementById('message');
    const loader = document.getElementById('loader');
    
    // التحقق من إدخال OTP
    if (!otp) {
        showMessage('يرجى إدخال رمز التحقق', 'error');
        return;
    }
    
    // إظهار Loader
    loader.style.display = 'block';
    messageEl.style.display = 'none';
    
    // محاكاة عملية التحقق (في الواقع، ستتم مقارنة OTP مع القيمة المخزنة)
    setTimeout(() => {
        loader.style.display = 'none';
        
        if (generatedOTPs[phone] === otp) {
            showMessage('تم التحقق بنجاح! جاري إضافتك إلى المجموعة...', 'success');
            
            // إظهار رابط المجموعة بعد فترة وجيزة
            setTimeout(() => {
                document.getElementById('step2').classList.remove('active');
                document.getElementById('whatsappGroup').style.display = 'block';
            }, 2000);
            
        } else {
            showMessage('رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.', 'error');
        }
    }, 1500);
}

// دالة لعرض الرسائل
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';
}

// دالة لتحميل بيانات Google Sheets (ستحتاج إلى ترخيص مناسب)
function loadGoogleSheetsData() {
    // هذا كود نموذجي لتحميل البيانات من Google Sheets
    // ستحتاج إلى استبداله بالكود الفعلي بناءً على ترخيص الـ API
    const sheetId = '130bDJDAufHdkgjNEV3FDWwhKSDMCCT7w7alc2S-89gk';
    const sheetName = 'Sheet1';
    const apiKey = 'https://script.google.com/macros/s/AKfycbzOZhVIyp-92w7CvCX15bGtpRIWPhF2kISldrD7Ot-ZE18Oz_bYMlYaRw9b-mODrWn-/exec'; // تحتاج إلى الحصول على مفتاح API من Google
    
    // هذا مثال لكيفية جلب البيانات من Google Sheets
    // const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
    
    // fetch(url)
    //     .then(response => response.json())
    //     .then(data => {
    //         // معالجة البيانات هنا
    //         console.log('Data from Google Sheets:', data);
    //     })
    //     .catch(error => {
    //         console.error('Error loading data from Google Sheets:', error);
    //     });
}

// تحميل بيانات Google Sheets عند بدء التحميل
// document.addEventListener('DOMContentLoaded', loadGoogleSheetsData);
