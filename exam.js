const ENDPOINT = "https://script.google.com/macros/s/AKfycbz1anGSdFDEMj41VxKNcHkrTicjY2fkXezQot3WL8Ec43bIBvlo6wC2jG4TViCj7A3OFQ/exec";

// بدء الامتحان
async function startExam(studentName) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "startExam",
        student: studentName,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      console.log("✅ Exam started for:", studentName);
      return true;
    } else {
      alert("حدث خطأ أثناء بدء الامتحان. جرّب مرة أخرى.");
      return false;
    }
  } catch (err) {
    console.error("❌ Start Exam Error:", err);
    alert("تعذر بدء الامتحان. تحقق من الاتصال.");
    return false;
  }
}

// تسليم الامتحان
async function submitExam(studentName, score) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submitExam",
        student: studentName,
        score: score,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      console.log("✅ Exam submitted:", data);
      return data;
    } else {
      alert("❌ لم يتم تسجيل النتيجة. حاول مرة أخرى.");
      return null;
    }
  } catch (err) {
    console.error("❌ Submit Exam Error:", err);
    alert("تعذر تسليم الإجابات. تحقق من الاتصال.");
    return null;
  }
}

// مثال للتجربة: تشغيل بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startExamBtn");
  const submitBtn = document.getElementById("submitExamBtn");

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      const name = document.getElementById("studentName").value.trim();
      if (name) {
        await startExam(name);
      } else {
        alert("من فضلك اكتب اسمك أولاً.");
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const name = document.getElementById("studentName").value.trim();
      const score = Math.floor(Math.random() * 100); // مؤقت: لحد ما نربط الأسئلة
      if (name) {
        const result = await submitExam(name, score);
        if (result) {
          alert(`تم تسجيل نتيجتك: ${score}`);
        }
      } else {
        alert("من فضلك اكتب اسمك أولاً.");
      }
    });
  }
});
