document.onkeydown = function(e){
  if(
    e.keyCode == 123 ||
    (e.ctrlKey && e.shiftKey && e.keyCode == 73) ||
    (e.ctrlKey && e.shiftKey && e.keyCode == 74) ||
    (e.ctrlKey && e.keyCode == 85)
  ){
    return false;
  }
};

function toggleMenu(){
  const s = document.getElementById("sidebar");
  s.style.left = s.style.left === "0px" ? "-260px" : "0px";
}

function goBusiness(){
  window.location.href = "PUT-YOUR-LINK-HERE";
}

function goGeo(){
  window.location.href = "https://www.mrfaisal.net/start";
}
