// Authentication variables
let currentUser = localStorage.getItem("loggedInUser");

// To-Do List variables
const taskInput = document.getElementById('task');
const addTaskBtn = document.getElementById('add');
const taskList = document.getElementById('taskList');
let tasks = [];

// Authentication functions
function showTodoList() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("todo-container").style.display = "flex";
    loadUserTasks();
    renderTasks();
    updateStats();
}

function showSignup() {
    document.getElementById("signup-box").style.display = "block";
    document.getElementById("login-box").style.display = "none";
    clearMessages();
}

function showLogin() {
    document.getElementById("signup-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
    clearMessages();
}

function clearMessages() {
    document.getElementById("signup-msg").innerText = "";
    document.getElementById("login-msg").innerText = "";
}

function checkAuth() {
    if (currentUser) {
        showTodoList();
    } else {
        showSignup();
        document.getElementById("todo-container").style.display = "none";
        document.getElementById("auth-container").style.display = "flex";
    }
}

function signup() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    
    if (!email || !password) {
        document.getElementById("signup-msg").innerText = "Please enter both email and password";
        return;
    }
    
    if (password.length < 6) {
        document.getElementById("signup-msg").innerText = "Password must be at least 6 characters";
        return;
    }
    
    // Check if user already exists
    if (localStorage.getItem("user_" + email)) {
        document.getElementById("signup-msg").innerText = "User already exists. Please login.";
        return;
    }
    
    // Save user data
    localStorage.setItem("user_" + email, password);
    localStorage.setItem("loggedInUser", email);
    currentUser = email;
    
    document.getElementById("signup-msg").innerText = "Account created successfully!";
    setTimeout(showTodoList, 1000);
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    
    if (!email || !password) {
        document.getElementById("login-msg").innerText = "Please enter both email and password";
        return;
    }
    
    const storedPassword = localStorage.getItem("user_" + email);
    
    if (storedPassword === password) {
        localStorage.setItem("loggedInUser", email);
        currentUser = email;
        document.getElementById("login-msg").innerText = "Login successful!";
        setTimeout(showTodoList, 1000);
    } else {
        document.getElementById("login-msg").innerText = "Incorrect email or password";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    currentUser = null;
    document.getElementById("todo-container").style.display = "none";
    document.getElementById("auth-container").style.display = "flex";
    showLogin();
    
    // Clear form fields
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
}

// To-Do List functions
function loadUserTasks() {
    const userTasks = localStorage.getItem("tasks_" + currentUser);
    tasks = userTasks ? JSON.parse(userTasks) : [];
}

function saveTasks() {
    localStorage.setItem("tasks_" + currentUser, JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    document.getElementById("total-tasks").textContent = `Total: ${total}`;
    document.getElementById("completed-tasks").textContent = `Completed: ${completed}`;
    document.getElementById("pending-tasks").textContent = `Pending: ${pending}`;
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <span class="task-text" onclick="toggleComplete(${index})">${task.text}</span>
            <span class="delete" onclick="deleteTask(${index})">&times;</span>
        `;
        taskList.appendChild(li);
    });
    updateStats();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Event listeners
document.getElementById("signup-btn").addEventListener('click', signup);
document.getElementById("login-btn").addEventListener('click', login);
document.getElementById("logout-btn").addEventListener('click', logout);
document.getElementById("show-login").addEventListener('click', showLogin);
document.getElementById("show-signup").addEventListener('click', showSignup);

// To-Do List event listeners
document.getElementById("add").addEventListener('click', addTask);
document.getElementById("task").addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize app
window.addEventListener('load', checkAuth);
