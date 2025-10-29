/* Login.js
   Lógica para registro e inicio de sesión con toasters modernos
*/

// -------------------- Helper para Toast --------------------
function showToast(message, type = "info") {
  let bgColor = "#3498db"; // azul por defecto
  if(type === "success") bgColor = "#2ecc71";
  if(type === "error") bgColor = "#e74c3c";
  if(type === "warning") bgColor = "#f39c12";

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
document.getElementById('register').addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

document.getElementById('login').addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// -------------------- Registro de usuario --------------------
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = registerForm.querySelector('input[placeholder="Name"]').value.trim();
  const email = registerForm.querySelector('input[placeholder="Email"]').value.trim().toLowerCase();
  const password = registerForm.querySelector('input[placeholder="Password"]').value.trim();

  // Validación de campos vacíos
  if(!name || !email || !password){
    showToast("Hay campos incompletos, por favor completalos.", "warning");
    return;
  }

  // Obtener usuarios guardados
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Validar correo existente
  if(users.some(u => u.email === email)){
    showToast("El correo ya fue registrado. :(", "error");
    return;
  }

  // Guardar nuevo usuario
  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  showToast("Registro exitoso. Continua con el inicio de sesión.", "success");

  registerForm.reset();
  container.classList.remove('right-panel-active'); 
});

// -------------------- Login de usuario --------------------
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[placeholder="Email"]').value.trim().toLowerCase();
  const password = loginForm.querySelector('input[placeholder="Password"]').value.trim();
  const rememberMe = document.getElementById('checkbox').checked;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    showToast("Datos correctos, bienvenido " + user.name, "success");

    // Guardar sesión
    const sessionData = { name: user.name, email: user.email, loginTime: Date.now() };
    if (rememberMe) {
      const expires = Date.now() + 30*24*60*60*1000; // 30 días
      localStorage.setItem('session', JSON.stringify({ ...sessionData, expires }));
    } else {
      sessionStorage.setItem('session', JSON.stringify(sessionData));
    }

    // Redirigir
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000); // esperar 1s para mostrar toast
  } else {
    showToast('Correo o contraseña incorrectos.', "error");
  }
});
