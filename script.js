function login() {
  const key = document.getElementById("key").value;
  const msg = document.getElementById("msg");

  if (key === "") {
    msg.innerText = "Key belum diisi";
    return;
  }

  msg.innerText = "Memeriksa key...";

  if (key === "TEST123") {
    msg.innerText = "Key valid, membuka aplikasi...";
    setTimeout(() => {
      location.href = "combyte3dpoker://keyok";
    }, 500);
  } else {
    msg.innerText = "Key tidak valid";
  }
}
