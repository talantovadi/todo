const tasksBlock = document.querySelector(".bottomBlock");
const todoTitleInput = document.querySelector(".todoTitleInput");
const todoDescInput = document.querySelector(".todoDescInput");
const topBlockForm = document.querySelector(".topBlockForm");
const editModal = document.querySelector(".editModalWindow");
const editModalTitleInput = document.querySelector(".editModalTitleInput");
const editModalDescInput = document.querySelector(".editModalDescInput");
const editModalForm = document.querySelector(".editModalWindowForm");
const editModalCloseBtn = document.querySelector(".editModalCloseBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const wrapper = document.querySelector(".wrapper");
const headerUsername = document.querySelector(".headerUsername");

const allBtn = document.querySelector(".all");
const completedBtn = document.querySelector(".completed");
const uncompletedBtn = document.querySelector(".uncompleted");
const allFilterButtons = document.querySelectorAll(".filterButton");

const userId = JSON.parse(localStorage.getItem("user"))?.id;

window.onload = () => {
    if (userId) {
        headerUsername.innerHTML = JSON.parse(localStorage.getItem("user"))?.username;
    }
    setTimeout(() => {
        if (!userId) {
            window.location.replace("../pages/loginPage.html");
        }
    }, 1);
};

const fetchData = async () => {
    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo`);
        const data = await response.json();
        if (response.status >= 400 && response.status <= 499) {
            return "error";
        }
        return data.length > 0 ? data : false;
    } catch (e) {
        return "error";
    }
};

const getFilteredTasks = async (completed) => {
    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo`);
        return await response.json();
    } catch (e) {
        console.log(e);
    }
};

const popNoTasksMessage = () => {
    const noTasks = document.createElement("p");
    noTasks.setAttribute("class", "noTasksMessage");
    noTasks.innerHTML = "No tasks...";
    tasksBlock.append(noTasks);
};

const changeActiveBtn = (index) => {
    allFilterButtons.forEach((btn) => {
        btn.style.backgroundColor = "#2f2f2f";
        btn.style.color = "#ffffff";
    });
    allFilterButtons[index].style.backgroundColor = "pink";
    allFilterButtons[index].style.color = "#000000";
};

completedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(true);
    tasksBlock.innerHTML = null;
    await tasks.forEach((task) => {
    if (task.completed === true)
    {createElements(task)}
});
    changeActiveBtn(1);
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage();
    }
};

allBtn.onclick = async () => {
    const tasks = await getFilteredTasks("");
    tasksBlock.innerHTML = null;
    await tasks.forEach((task) => createElements(task));
    changeActiveBtn(0);
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage();
    }
};

uncompletedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(false);
    console.log(tasks);
    tasksBlock.innerHTML = null;
    await tasks.forEach((task) => 
    {
        
        if  (task.completed === false){
        createElements(task)}
    });
    changeActiveBtn(2);
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage();
    }
};

const deleteTask = async (id) => {
    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo/${id}`, { method: "DELETE" });
        console.log(response);
    } catch (e) {
        console.log(e);
    }
};

const checkTask = async (id, completed) => {
    const options = {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ completed }),
    };

    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo/${id}`, options);
        console.log(response);
    } catch (e) {
        console.log(e);
    }
};

const editTask = async (id, title, desc) => {
    const options = {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ title, description: desc }),
    };

    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo/${id}`, options);
        return await response.json();
    } catch (e) {
        console.log(e);
    }
};

const postTask = async (title, desc) => {
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ title, description: desc, completed: false }),
    };

    try {
        const response = await fetch(`https://65841ae24d1ee97c6bcefdc1.mockapi.io/users/${userId}/todo/`, options);
        return await response.json();
    } catch (e) {
        console.log(e);
    }
};

const createElements = (task) => {
    const noTasks = document.querySelector(".noTasksMessage");
    if (noTasks) noTasks.remove();

    const div = document.createElement("div");
    div.classList.add("taskBlock");

    const taskTitleDescCheckbox = document.createElement("div");
    taskTitleDescCheckbox.classList.add("taskTitleDescCheckbox");

    const taskTitleDesc = document.createElement("div");
    taskTitleDesc.classList.add("taskTitleDesc");

    const taskBlockLine = document.createElement("div");
    taskBlockLine.classList.add("taskBlockLine");

    const taskButtons = document.createElement("div");
    taskButtons.classList.add("taskButtons");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "taskCheckbox");
    checkbox.checked = task.completed;
    checkbox.onclick = async (e) => {
        const check = e.target.checked;
        await checkTask(task.id, check);
    };

    const title = document.createElement("h2");
    title.classList.add("taskTitle");

    const titleToPrint = task.title.split("");
    const intervalTitle = setInterval(() => {
        title.innerHTML = title.innerHTML + titleToPrint.shift();
        if (titleToPrint.length < 1) {
            clearInterval(intervalTitle);
        }
    }, 7);

    const desc = document.createElement("p");
    desc.classList.add("taskDesc");

    const descToPrint = task.description.split("");
    const intervalDesc = setInterval(() => {
        desc.innerHTML = desc.innerHTML + descToPrint.shift();

        if (descToPrint.length < 1) {
            clearInterval(intervalDesc);
        }
    }, 5);

    const editBtn = document.createElement("button");
    editBtn.classList.add("taskEdit");
    editBtn.innerHTML = "EDIT";
    editBtn.onclick = async () => {
        editModal.classList.remove("hide");
        wrapper.style.filter = "blur(2px)";
        editModalForm.onsubmit = async (e) => {
            e.preventDefault();
            const editedTask = await editTask(task.id, editModalTitleInput.value, editModalDescInput.value);
            title.innerHTML = editedTask.title;
            desc.innerHTML = editedTask.description;
            editModalTitleInput.value = "";
            editModalDescInput.value = "";
            editModal.classList.add("hide");
            wrapper.style.filter = "none";
        };
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("taskDelete");
    deleteBtn.innerHTML = "DELETE";
    deleteBtn.onclick = async () => {
        await deleteTask(task.id);
        await div.remove();
        if (tasksBlock.children.length === 0) {
            popNoTasksMessage();
        }
    };

    taskTitleDesc.append(title, desc);
    taskTitleDescCheckbox.append(checkbox, taskTitleDesc);
    taskButtons.append(editBtn, deleteBtn);
    div.append(taskTitleDescCheckbox, taskBlockLine, taskButtons);
    tasksBlock.insertBefore(div, tasksBlock.firstChild);
};

topBlockForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = todoTitleInput.value;
    const desc = todoDescInput.value;
    const task = await postTask(title, desc);
    todoTitleInput.value = "";
    todoDescInput.value = "";
    createElements(task);
};

const createTasks = async () => {
    const tasks = await fetchData();
    if (typeof tasks === "object") {
        tasks.forEach((task) => {
            createElements(task);
        });
    } else if (tasks === "error") {
        const error = document.createElement("p");
        error.innerHTML = "Error...";
        tasksBlock.append(error);
    } else if (!tasks) {
        popNoTasksMessage();
    }
};

editModalCloseBtn.onclick = () => {
    wrapper.style.filter = "none";
    editModal.classList.add("hide");
    editModalTitleInput.value = "";
    editModalDescInput.value = "";
};

logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.replace("../index.html");
};

createTasks().then();
