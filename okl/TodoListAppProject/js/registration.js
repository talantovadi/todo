// Updated code with corrections
const regForm = document.querySelector(".regForm");
const regEmailInput = document.querySelector(".regEmailInput");
const regUsernameInput = document.querySelector(".regUsernameInput");
const regPasswordInput = document.querySelector(".regPasswordInput");
const regConfirmPasswordInput = document.querySelector(".regConfirmPasswordInput");
const errorMessage = document.querySelector(".errorMessage");

const userId = JSON.parse(localStorage.getItem("username"))?.id;

const registerUser = async (email, username, password) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email, username, password
        })
    };

    try {
        const response = await fetch("https://65841ae24d1ee97c6bcefdc1.mockapi.io/users", options);
        const userData = await response.json();
        if (response.status >= 200 && response.status <= 299) {
            localStorage.setItem("user", JSON.stringify(userData));
            window.location.replace("../pages/todoListPage.html");
        }
    } catch (e) {
        console.error(e);
    }
};

regForm.onsubmit = (e) => {
    e.preventDefault();
    if (regPasswordInput.value === regConfirmPasswordInput.value) {
        registerUser(regEmailInput.value, regUsernameInput.value, regPasswordInput.value);
    } else {
        errorMessage.innerHTML = "Passwords must match!";
    }
};

regPasswordInput.oninput = () => {
    errorMessage.innerHTML = "";
};

regConfirmPasswordInput.oninput = () => {
    errorMessage.innerHTML = "";
};
