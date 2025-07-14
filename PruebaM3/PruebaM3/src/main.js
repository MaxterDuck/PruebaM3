import { showLoginView } from "./auth.js";
import { loadHome } from "./home.js";
import { initApp } from "./Users.js";

const app = document.getElementById("app");
const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
  showLoginView();
} else {
  document.getElementById("app-layout").style.display = "flex";
  document.getElementById("sidebarName").textContent = currentUser.name;
  document.getElementById("sidebarRole").textContent =
    currentUser.role === "admin" ? "Administrador" : "Usuario";
  navigateTo("home");
}

function navigateTo(view) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return showLoginView();

  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("app-layout").style.display = "flex";
  document.getElementById("sidebarName").textContent = user.name;
  document.getElementById("sidebarRole").textContent =
    user.role === "admin" ? "Admin" : "Usuario";

  // Show/hide Enrollments menu based on user role
  const enrollmentsMenu = document.getElementById("navEnrollments");
  if (enrollmentsMenu) {
    if (user.role === "admin") {
      enrollmentsMenu.style.display = "none";
    } else {
      enrollmentsMenu.style.display = "block";
    }
  }

  // Update hash and load view
  if (view === "home") {
    window.location.hash = "home";
    loadHome(app);
  } else if (view === "events") {
    window.location.hash = "events";
    initApp(app, user);
  } else if (view === "enrollments" && user.role !== "admin") {
    window.location.hash = "enrollments";
    import("./Users.js").then(mod => {
      mod.showEnrollmentsView(app, user);
    });
  }
}

if (typeof window !== 'undefined') {
  window.navigateTo = navigateTo;
}

document.getElementById("navHome").addEventListener("click", () => navigateTo("home"));
document.getElementById("navUsers").addEventListener("click", () => navigateTo("events"));
document.getElementById("navEnrollments").addEventListener("click", () => navigateTo("enrollments"));
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("user");
  showLoginView();
});
