const getStartedBtn = document.querySelector(".getStartedBtn")
const headerLoggedIn = document.querySelector(".headerLoggedIn")
const headerLoggedOut = document.querySelector(".headerLoggedOut")
const logoutBtn = document.querySelector(".logoutBtn")
const headerUsername = document.querySelector(".headerUsername")
const getUserId = () => JSON.parse(localStorage.getItem("username"))?.id;

window.onload = () => {
    const loggedIn = select(".headerLoggedIn");
    const loggedOut = select(".headerLoggedOut");
    const username = select(".headerUsername");
    const userId = getUserId();

    if (userId) {
        loggedIn.classList.remove("hide");
        loggedOut.classList.add("hide");
        username.innerHTML = JSON.parse(localStorage.getItem("user"))?.username;
    }
};

const redirectToPage = (page) => window.location.href = `pages/${page}.html`;

select(".getStartedBtn").onclick = () => {
    getUserId() ? redirectToPage("todoListPage") : redirectToPage("loginPage");
};

select(".logoutBtn").onclick = () => {
    localStorage.removeItem("user");
    window.location.reload();
};