const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", loginUser);

async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch("http://localhost:5000/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const result = await response.json();

    alert(result.message);

    if (result.success) {

    localStorage.setItem("userEmail", email);

    window.location.href = "dashboard.html";

    }

}