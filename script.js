// Authentication variables
let currentUser = localStorage.getItem("loggedInUser");
let isEditing = false;
let currentEditElement = null;
let currentSkillIndex = -1;
let currentProjectIndex = -1;

// Default portfolio data structure
const defaultPortfolioData = {
    name: "Your Name",
    tagline: "Your Professional Tagline",
    about: "Click here to add your professional description and background...",
    profileImage: "https://via.placeholder.com/200",
    skills: [],
    projects: [],
    contact: {
        email: "your.email@example.com",
        phone: "+1234567890",
        linkedin: "linkedin.com/in/yourprofile",
        github: "github.com/yourusername"
    }
};

// User-specific portfolio data
let portfolioData = {};

// Authentication functions
function showPortfolio() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("portfolio-container").style.display = "block";
    loadUserPortfolio();
    initializePortfolio();
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
        showPortfolio();
    } else {
        showSignup();
        document.getElementById("portfolio-container").style.display = "none";
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
    
    if (localStorage.getItem("user_" + email)) {
        document.getElementById("signup-msg").innerText = "User already exists. Please login.";
        return;
    }
    
    // Save user credentials
    localStorage.setItem("user_" + email, password);
    localStorage.setItem("loggedInUser", email);
    currentUser = email;
    
    // Create default portfolio for new user
    localStorage.setItem("portfolio_" + email, JSON.stringify(defaultPortfolioData));
    
    document.getElementById("signup-msg").innerText = "Portfolio created successfully!";
    setTimeout(showPortfolio, 1000);
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
        document.getElementById("login-msg").innerText = "Welcome back!";
        setTimeout(showPortfolio, 1000);
    } else {
        document.getElementById("login-msg").innerText = "Incorrect email or password";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    currentUser = null;
    portfolioData = {};
    
    document.getElementById("portfolio-container").style.display = "none";
    document.getElementById("auth-container").style.display = "flex";
    showLogin();
    
    // Clear form fields
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
}

// Portfolio functions
function loadUserPortfolio() {
    if (!currentUser) return;
    
    const userData = localStorage.getItem("portfolio_" + currentUser);
    if (userData) {
        portfolioData = JSON.parse(userData);
    } else {
        // Create default portfolio if none exists
        portfolioData = JSON.parse(JSON.stringify(defaultPortfolioData));
        savePortfolio();
    }
}

function savePortfolio() {
    if (!currentUser) return;
    localStorage.setItem("portfolio_" + currentUser, JSON.stringify(portfolioData));
}

function initializePortfolio() {
    if (!portfolioData || Object.keys(portfolioData).length === 0) return;
    
    // Load data into elements
    document.getElementById("user-name").textContent = portfolioData.name || "Your Name";
    document.getElementById("user-tagline").textContent = portfolioData.tagline || "Your Professional Tagline";
    document.getElementById("about-description").textContent = portfolioData.about || "Click here to add your professional description and background...";
    document.getElementById("profile-image").src = portfolioData.profileImage || "https://via.placeholder.com/200";
    
    // Load contact info
    if (portfolioData.contact) {
        document.getElementById("contact-email").textContent = portfolioData.contact.email || "your.email@example.com";
        document.getElementById("contact-phone").textContent = portfolioData.contact.phone || "+1234567890";
        document.getElementById("contact-linkedin").textContent = portfolioData.contact.linkedin || "linkedin.com/in/yourprofile";
        document.getElementById("contact-github").textContent = portfolioData.contact.github || "github.com/yourusername";
    }
    
    renderSkills();
    renderProjects();
    setupScrollEffects();
}

// Text editing functions
function editText(elementId) {
    if (isEditing) return;
    
    isEditing = true;
    currentEditElement = elementId;
    
    const element = document.getElementById(elementId);
    const currentText = element.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.style.width = '100%';
    input.style.padding = '0.5rem';
    input.style.fontSize = window.getComputedStyle(element).fontSize;
    input.style.background = '#fff';
    input.style.border = '2px solid #667eea';
    input.style.borderRadius = '5px';
    
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    
    input.focus();
    input.select();
    
    input.addEventListener('blur', saveTextEdit);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveTextEdit();
        }
    });
}

function saveTextEdit() {
    if (!isEditing) return;
    
    const element = document.getElementById(currentEditElement);
    const input = element.parentNode.querySelector('input');
    const newText = input.value.trim();
    
    if (newText) {
        element.textContent = newText;
        
        // Update portfolio data
        switch (currentEditElement) {
            case 'user-name':
                portfolioData.name = newText;
                break;
            case 'user-tagline':
                portfolioData.tagline = newText;
                break;
            case 'about-description':
                portfolioData.about = newText;
                break;
            case 'contact-email':
                if (!portfolioData.contact) portfolioData.contact = {};
                portfolioData.contact.email = newText;
                break;
            case 'contact-phone':
                if (!portfolioData.contact) portfolioData.contact = {};
                portfolioData.contact.phone = newText;
                break;
            case 'contact-linkedin':
                if (!portfolioData.contact) portfolioData.contact = {};
                portfolioData.contact.linkedin = newText;
                break;
            case 'contact-github':
                if (!portfolioData.contact) portfolioData.contact = {};
                portfolioData.contact.github = newText;
                break;
        }
        
        savePortfolio();
    }
    
    element.style.display = '';
    input.remove();
    isEditing = false;
    currentEditElement = null;
}

function editProfileImage() {
    const newImageUrl = prompt("Enter image URL:", portfolioData.profileImage || "https://via.placeholder.com/200");
    if (newImageUrl && newImageUrl.trim()) {
        portfolioData.profileImage = newImageUrl.trim();
        document.getElementById("profile-image").src = portfolioData.profileImage;
        savePortfolio();
    }
}

// Skills functions
function renderSkills() {
    const skillsGrid = document.getElementById("skills-grid");
    skillsGrid.innerHTML = "";
    
    if (!portfolioData.skills) portfolioData.skills = [];
    
    portfolioData.skills.forEach((skill, index) => {
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-item fade-in";
        skillDiv.innerHTML = `
            <div class="skill-name">
                ${skill.name}
                <button class="skill-delete" onclick="deleteSkill(${index})">×</button>
            </div>
            <div class="skill-progress">
                <div class="skill-fill" style="width: ${skill.level}%"></div>
            </div>
        `;
        skillsGrid.appendChild(skillDiv);
    });
}

function editSkills() {
    document.getElementById("skill-modal").style.display = "block";
    currentSkillIndex = -1;
    document.getElementById("skill-name").value = "";
    document.getElementById("skill-level").value = "";
}

function addSkill() {
    const name = document.getElementById("skill-name").value.trim();
    const level = parseInt(document.getElementById("skill-level").value);
    
    if (!name || !level || level < 1 || level > 100) {
        alert("Please enter a valid skill name and level (1-100)");
        return;
    }
    
    const skill = { name, level };
    
    if (!portfolioData.skills) portfolioData.skills = [];
    
    if (currentSkillIndex === -1) {
        portfolioData.skills.push(skill);
    } else {
        portfolioData.skills[currentSkillIndex] = skill;
    }
    
    savePortfolio();
    renderSkills();
    document.getElementById("skill-modal").style.display = "none";
}

function deleteSkill(index) {
    if (confirm("Delete this skill?")) {
        portfolioData.skills.splice(index, 1);
        savePortfolio();
        renderSkills();
    }
}

// Projects functions
function renderProjects() {
    const projectsGrid = document.getElementById("projects-grid");
    projectsGrid.innerHTML = "";
    
    if (!portfolioData.projects) portfolioData.projects = [];
    
    portfolioData.projects.forEach((project, index) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project-card fade-in";
        projectDiv.innerHTML = `
            <div class="project-content">
                <button class="project-delete" onclick="deleteProject(${index})">×</button>
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <div class="project-links">
                    ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank">Live Demo</a>` : ''}
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectDiv);
    });
}

function editProjects() {
    document.getElementById("project-modal").style.display = "block";
    currentProjectIndex = -1;
    document.getElementById("project-title").value = "";
    document.getElementById("project-description").value = "";
    document.getElementById("project-link").value = "";
    document.getElementById("project-demo").value = "";
}

function addProject() {
    const title = document.getElementById("project-title").value.trim();
    const description = document.getElementById("project-description").value.trim();
    const link = document.getElementById("project-link").value.trim();
    const demo = document.getElementById("project-demo").value.trim();
    
    if (!title || !description) {
        alert("Please enter project title and description");
        return;
    }
    
    const project = { title, description, link, demo };
    
    if (!portfolioData.projects) portfolioData.projects = [];
    
    if (currentProjectIndex === -1) {
        portfolioData.projects.push(project);
    } else {
        portfolioData.projects[currentProjectIndex] = project;
    }
    
    savePortfolio();
    renderProjects();
    document.getElementById("project-modal").style.display = "none";
}

function deleteProject(index) {
    if (confirm("Delete this project?")) {
        portfolioData.projects.splice(index, 1);
        savePortfolio();
        renderProjects();
    }
}

function editContact() {
    // This function can be expanded if needed
    console.log("Edit contact function called");
}

// Scroll effects and navigation
function setupScrollEffects() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
        
        // Fade in elements
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('show');
            }
        });
    });
    
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Modal handling
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Auth event listeners
    document.getElementById("signup-btn").addEventListener('click', signup);
    document.getElementById("login-btn").addEventListener('click', login);
    document.getElementById("logout-btn").addEventListener('click', logout);
    document.getElementById("show-login").addEventListener('click', showLogin);
    document.getElementById("show-signup").addEventListener('click', showSignup);
    
    // Portfolio event listeners
    document.getElementById("add-skill-btn").addEventListener('click', editSkills);
    document.getElementById("add-project-btn").addEventListener('click', editProjects);
    document.getElementById("save-skill").addEventListener('click', addSkill);
    document.getElementById("save-project").addEventListener('click', addProject);
    
    setupModals();
    checkAuth();
});
