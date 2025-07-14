
// API endpoint for user authentication and registration
const apiUrl = "http://localhost:3000/users";

export function showLoginView() {
  // This function renders the login view, hides other views, and sets up the login form and register link.
  // It is called when the user is not authenticated or when navigating to the login route.
  const loginDiv = document.getElementById("login");
  loginDiv.style.display = "flex";
  document.getElementById("register").style.display = "none";
  document.getElementById("app-layout").style.display = "none";

  // Render the login form HTML, including username and password fields, and a link to register.
  loginDiv.innerHTML = `
    <div class="login-box">
      <h2>Enter your user</h2>
      <form id="loginForm" style="display:flex;flex-direction:column;gap:1.2rem;">
        <label for="loginUser" class="form-label">Username</label>
        <input type="text" id="loginUser" placeholder="Enter your username" required />
        <label for="loginPass" class="form-label">Password</label>
        <input type="password" id="loginPass" placeholder="Enter your password" required />
        <button id="btnLogin" type="submit">Log in</button>
      </form>
      <p class="form-link">You do not have an account? <a href="#" id="linkRegister">Register</a></p>
    </div>
  `;

  // After rendering, bind the login form submit event and the register link click event.
  // The login form triggers the login() function, and the register link navigates to the register view.
  setTimeout(() => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        login();
      };
    }
    const linkRegister = document.getElementById("linkRegister");
    if (linkRegister) {
      linkRegister.onclick = (e) => {
        e.preventDefault();
        window.location.hash = "register";
        showRegisterView();
      };
    }
  }, 0);
}

export function showRegisterView() {
  // This function renders the registration view, hides other views, and sets up the registration form and login link.
  // It is called when the user clicks the register link or navigates to the register route.
  document.getElementById("login").style.display = "none";
  const registerDiv = document.getElementById("register");
  registerDiv.style.display = "flex";
  document.getElementById("app-layout").style.display = "none";

  // Render the registration form HTML, including all required fields and a link to go back to login.
  registerDiv.innerHTML = `
    <div class="register-box">
      <h2 style="text-align:center;font-size:2rem;font-weight:700;margin-bottom:1.2rem;">Register</h2>
      <label for="regName" class="form-label" style="font-size:1rem;color:#444;margin-bottom:0.2rem;margin-left:2px;font-weight:500;">Full Name</label>
      <input type="text" id="regName" placeholder="Enter your full name" style="padding:0.9rem;border:1px solid #e0e0e0;border-radius:8px;font-size:1rem;margin-bottom:0.7rem;background:#faf9fc;" required />
      <label for="regEmail" class="form-label" style="font-size:1rem;color:#444;margin-bottom:0.2rem;margin-left:2px;font-weight:500;">Email</label>
      <input type="email" id="regEmail" placeholder="Enter your email" style="padding:0.9rem;border:1px solid #e0e0e0;border-radius:8px;font-size:1rem;margin-bottom:0.7rem;background:#faf9fc;" required />
      <label for="regUsername" class="form-label" style="font-size:1rem;color:#444;margin-bottom:0.2rem;margin-left:2px;font-weight:500;">Username</label>
      <input type="text" id="regUsername" placeholder="Choose a username" style="padding:0.9rem;border:1px solid #e0e0e0;border-radius:8px;font-size:1rem;margin-bottom:0.7rem;background:#faf9fc;" required />
      <label for="regPassword" class="form-label" style="font-size:1rem;color:#444;margin-bottom:0.2rem;margin-left:2px;font-weight:500;">Password</label>
      <input type="password" id="regPassword" placeholder="Enter your password" style="padding:0.9rem;border:1px solid #e0e0e0;border-radius:8px;font-size:1rem;margin-bottom:0.7rem;background:#faf9fc;" required />
      <label for="regPassword2" class="form-label" style="font-size:1rem;color:#444;margin-bottom:0.2rem;margin-left:2px;font-weight:500;">Confirm Password</label>
      <input type="password" id="regPassword2" placeholder="Confirm your password" style="padding:0.9rem;border:1px solid #e0e0e0;border-radius:8px;font-size:1rem;margin-bottom:0.7rem;background:#faf9fc;" required />
      <button type="submit" id="btnRegister" style="background:#6e00ff;color:white;padding:0.9rem;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:1.1rem;margin-top:0.5rem;width:100%;transition:background 0.2s;">Register</button>
      <p class="form-link" style="text-align:center;font-size:1rem;margin-top:0.5rem;">¿Ya tienes cuenta? <a href="#" id="linkBackToLogin" style="color:#6e00ff;text-align:center;text-decoration:underline;cursor:pointer;font-size:1rem;">Iniciar sesión</a></p>
    </div>
  `;

  // After rendering, bind the register button click event and the login link click event.
  // The register button triggers the register() function, and the login link navigates back to the login view.
  setTimeout(() => {
    const btnRegister = document.getElementById("btnRegister");
    if (btnRegister) {
      btnRegister.onclick = (e) => {
        e.preventDefault();
        register();
      };
    }
    const linkBackToLogin = document.getElementById("linkBackToLogin");
    if (linkBackToLogin) {
      linkBackToLogin.onclick = (e) => {
        e.preventDefault();
        window.location.hash = "login";
        showLoginView();
      };
    }
  }, 0);
}

async function login() {
  // Handles user login by validating credentials and updating session state.
  // Fetches all users from the backend, checks for a matching username and password, and logs the user in if found.
  // If login is successful, stores user in localStorage and navigates to the home view. Otherwise, shows an error.
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();
  if (!username || !password) return alert("Please complete both fields.");

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Could not connect to server");
    const users = await res.json();
    // Find user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Store user session and show main app
      localStorage.setItem("user", JSON.stringify(user));
      document.getElementById("login").style.display = "none";
      document.getElementById("app-layout").style.display = "flex";
      window.navigateTo("home");
    } else {
      alert("Incorrect username or password.");
    }
  } catch (err) {
    alert("Connection error: " + err.message);
  }
}

async function register() {
  // Handles user registration by validating input fields and creating a new user in the backend.
  // Checks for required fields, password match, and duplicate username. If valid, creates the user and prompts to login.
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const password2 = document.getElementById("regPassword2").value.trim();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();

  // Validate all required fields
  if (!username || !password || !password2 || !name || !email)
    return alert("All fields are required.");
  if (password !== password2)
    return alert("Passwords do not match.");

  // Check for duplicate username
  const res = await fetch(apiUrl);
  const users = await res.json();
  if (users.find(u => u.username === username)) {
    return alert("Username already exists.");
  }

  // Create new user in backend
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, name, email, role: "user" })
  });

  alert("Registration successful. Please log in.");
  window.location.hash = "login";
  showLoginView();
}
