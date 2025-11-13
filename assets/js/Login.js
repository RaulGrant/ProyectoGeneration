
// -------------------- Helper para Toast --------------------
function showToast(message, type = "info") {
  let bgColor = "#3498db"; // azul por defecto
  if (type === "success") bgColor = "#2ecc71";
  if (type === "error") bgColor = "#e74c3c";
  if (type === "warning") bgColor = "#f39c12";

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: bgColor,
    stopOnFocus: true,
  }).showToast();
}

// -------------------- Variables del DOM --------------------
const container = document.getElementById("container");
const registerForm = document.querySelector(".register-container form");
const loginForm = document.querySelector(".login-container form");

// -------------------- Eventos para cambiar panel --------------------
document.getElementById("register").addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

document.getElementById("login").addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// -------------------- Crear perfil ADMIN por defecto --------------------
(function createDefaultAdmin() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const adminExists = users.some((u) => u.email === "admin@pawssible.com");
  if (!adminExists) {
    users.push({
      name: "Administrador",
      email: "admin@pawssible.com",
      password: "admin123",
      isAdmin: true,
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
})();

// -------------------- Registro de usuario --------------------
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = registerForm
    .querySelector('input[placeholder="Name"]')
    .value.trim();
  const email = registerForm
    .querySelector('input[placeholder="Email"]')
    .value.trim()
    .toLowerCase();
  const password = registerForm
    .querySelector('input[placeholder="Password"]')
    .value.trim();

  if (!name || !email || !password) {
    showToast("Hay campos incompletos, por favor complétalos.", "warning");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u) => u.email === email)) {
    showToast("El correo ya fue registrado. :(", "error");
    return;
  }

  // Asignar privilegios: si el correo es el del admin, true; de lo contrario false
  const isAdmin = email === "admin@pawssible.com";
  users.push({ name, email, password, isAdmin });
  localStorage.setItem("users", JSON.stringify(users));

  showToast("Registro exitoso. Continua con el inicio de sesión.", "success");
  registerForm.reset();
  container.classList.remove("right-panel-active");
});

// -------------------- Login de usuario --------------------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm
    .querySelector('input[placeholder="Email"]')
    .value.trim()
    .toLowerCase();
  const password = loginForm
    .querySelector('input[placeholder="Password"]')
    .value.trim();
  const rememberMe = document.getElementById("checkbox").checked;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    showToast("Datos correctos, bienvenido " + user.name, "success");

    // Datos de sesión (simulando payload de un JWT)
    const sessionData = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      loginTime: Date.now(),
    };

    if (rememberMe) {
      const expires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 días
      localStorage.setItem("session", JSON.stringify({ ...sessionData, expires }));
    } else {
      sessionStorage.setItem("session", JSON.stringify(sessionData));
    }

    // Redirigir según tipo de usuario
    setTimeout(() => {
      if (user.isAdmin) {
        window.location.href = "index.html";
      } else {
        window.location.href = "index.html";
      }
    }, 1000);
  } else {
    showToast("Correo o contraseña incorrectos.", "error");
  }
});

// -------------------- Protección de páginas --------------------
/*
document.addEventListener("DOMContentLoaded", () => {
  const session =
    JSON.parse(localStorage.getItem("session")) ||
    JSON.parse(sessionStorage.getItem("session"));

  if (!session) {
    window.location.href = "forbidden.html";
  }

  // Proteger página solo para admin:
  if (!session.isAdmin) {
    window.location.href = "forbidden.html";
  }
});
*/

// -------------------- Futura integración con JWT --------------------
/*
Cuando implementes el backend en Java (Spring Boot, por ejemplo):
1. Sustituye el bloque de “users” local por peticiones fetch() al backend:
   - POST /api/auth/login → devuelve JWT
   - POST /api/auth/register
2. Guarda el JWT en localStorage como `token`.
3. Decodifica o verifica el rol (isAdmin) desde el backend.
4. Usa `Authorization: Bearer <token>` en tus requests.
*/
