const API_URL = "https://script.google.com/macros/s/AKfycbydIEYV3O4EGNWG2TBdfnjcB7WEkuBtgBxcuV1R7LNCwLcDtj8sa71_gNX2s4T0H0ueDA/exec";

// بدء الامتحان
async function startExam(studentName) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "startExam",
        student: studentName
      })
    });
    const data = await res.json();
    console.log("Start Exam Response:", data);
    return data;
  } catch (err) {
    console.error("Start Exam Error:", err);
  }
}

// تسليم الامتحان
async function submitExam(studentName, score) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submitExam",
        student: studentName,
        score: score
      })
    });
    const data = await res.json();
    console.log("Submit Exam Response:", data);
    return data;
  } catch (err) {
    console.error("Submit Exam Error:", err);
  }
}
