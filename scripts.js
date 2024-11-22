document.addEventListener("DOMContentLoaded", () => {
    const localStorageKey = "userDatabase";
    const loggedInUserKey = "loggedInUser"; // Key for storing the logged-in user in localStorage

    // Initialize default admin account
    if (!localStorage.getItem(localStorageKey)) {
        localStorage.setItem(localStorageKey, JSON.stringify([
            { username: "admin", password: "password", role: "Owner" }
        ]));
    }

    // Login functionality
    const loginButton = document.getElementById("login-button");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const users = JSON.parse(localStorage.getItem(localStorageKey));
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Store the logged-in user in localStorage
                localStorage.setItem(loggedInUserKey, JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid username or password.");
            }
        });

        // Allow pressing "Enter" to log in
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener("keyup", (e) => {
                if (e.key === "Enter") loginButton.click();
            });
        });
    }

    // Dashboard initialization
    const loggedInUser = JSON.parse(localStorage.getItem(loggedInUserKey));
    const usernameDisplay = document.getElementById("username-display");

    if (loggedInUser && usernameDisplay) {
        usernameDisplay.textContent = `Welcome, ${loggedInUser.username} (${loggedInUser.role})`;
    } else if (!loggedInUser && usernameDisplay) {
        alert("Please log in first!");
        window.location.href = "index.html";
    }

    // Logout functionality
    const logoutTab = document.getElementById("logout-tab");
    if (logoutTab) {
        logoutTab.addEventListener("click", () => {
            localStorage.removeItem(loggedInUserKey); // Clear the logged-in user
            window.location.href = "index.html";
        });
    }

    // Tabs functionality
    const tabs = document.querySelectorAll(".tab-button");
    const tabContent = document.getElementById("tab-content");
    const userManagementSection = document.getElementById("user-management");
    const modalOverlay = document.querySelector(".modal-overlay");
    const modal = document.querySelector(".modal");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabName = tab.dataset.tab;
            if (tabName === "User Management") {
                userManagementSection.style.display = "block";
                tabContent.style.display = "none";
            } else {
                userManagementSection.style.display = "none";
                tabContent.style.display = "block";
                tabContent.textContent = `You clicked on ${tabName}`;
            }
        });
    });

    // User Management
    const userList = document.getElementById("user-list");
    const openAddUserModalButton = document.getElementById("open-add-user-modal");

    function populateUserList() {
        const users = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        userList.innerHTML = "";

        users.forEach((user, index) => {
            const userItem = document.createElement("li");
            userItem.classList.add("user-item");
            userItem.innerHTML = `
                <span>${user.username} (${user.role})</span>
                <button class="edit-button" data-index="${index}">🖉 Edit</button>
            `;
            userList.appendChild(userItem);
        });

        // Add edit functionality to each button
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", () => {
                openEditModal(button.dataset.index);
            });
        });
    }

    // Add User Modal
    openAddUserModalButton.addEventListener("click", () => {
        modal.innerHTML = `
            <h2>Add User</h2>
            <input type="text" id="new-username" placeholder="Username">
            <input type="password" id="new-password" placeholder="Password">
            <select id="new-role">
                <option value="Mod">Mod</option>
                <option value="Admin">Admin</option>
                <option value="Owner">Owner</option>
            </select>
            <button id="save-user-button">Save</button>
        `;
        modalOverlay.style.display = "flex";

        document.getElementById("save-user-button").addEventListener("click", () => {
            const username = document.getElementById("new-username").value.trim();
            const password = document.getElementById("new-password").value.trim();
            const role = document.getElementById("new-role").value;

            if (username && password) {
                const users = JSON.parse(localStorage.getItem(localStorageKey)) || [];
                if (users.some(u => u.username === username)) {
                    alert("Username already exists!");
                    return;
                }

                users.push({ username, password, role });
                localStorage.setItem(localStorageKey, JSON.stringify(users));
                modalOverlay.style.display = "none";
                populateUserList();
            } else {
                alert("All fields are required.");
            }
        });
    });

    // Edit User Modal
    function openEditModal(index) {
        const users = JSON.parse(localStorage.getItem(localStorageKey));
        const user = users[index];

        modal.innerHTML = `
            <h2>Edit User</h2>
            <input type="text" id="edit-username" value="${user.username}" placeholder="New Username">
            <input type="password" id="edit-password" value="${user.password}" placeholder="New Password">
            <select id="edit-role">
                <option value="Mod" ${user.role === "Mod" ? "selected" : ""}>Mod</option>
                <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Admin</option>
                <option value="Owner" ${user.role === "Owner" ? "selected" : ""}>Owner</option>
            </select>
            <button id="save-edit-button">Save</button>
            <button id="delete-user-button">Delete</button>
        `;
        modalOverlay.style.display = "flex";

        document.getElementById("save-edit-button").addEventListener("click", () => {
            user.username = document.getElementById("edit-username").value.trim();
            user.password = document.getElementById("edit-password").value.trim();
            user.role = document.getElementById("edit-role").value;

            users[index] = user;
            localStorage.setItem(localStorageKey, JSON.stringify(users));
            modalOverlay.style.display = "none";
            populateUserList();
        });

        document.getElementById("delete-user-button").addEventListener("click", () => {
            users.splice(index, 1);
            localStorage.setItem(localStorageKey, JSON.stringify(users));
            modalOverlay.style.display = "none";
            populateUserList();
        });
    }

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = "none";
        }
    });

    populateUserList();
});
