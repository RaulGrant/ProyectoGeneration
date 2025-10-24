/* para la lógica del diseño del sistema de inicio de sesión se requiere
   validar las credenciales necesarias.

   Se va a captur ar los campos de la entrada, es decir, nombre de usuario y la contraseña


*/

// Se comenzará a trabajr con el DOM
//llamamos al Id Container para cambiar entre login y registro
const container = document.getElementById("container");
const registerForm = document.querySelector(".register-container form");
const loginButton = document.querySelector(".login-container form");


//Se agrega el evento listener de tipo click para realizar los cambios determinados
//Esta parte muestra la sección del registro
document.getElementById('register').addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

//Esta parte muestra la sección del login
document.getElementById('login').addEventListener('click', ()=>{
    container.classList.remove('right-panel-active');
});

//Comenzamos con el registro del usuario, aquí trabajremos con el atributo register

registerForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  //Se tomaran las entradas del usuario, nombre, email y contraseña

  const name = registerForm.querySelector('input[placeholder="Name"]').value.trim();
  const email = registerForm.querySelector('input[placeholder="Email"]').value.trim().toLowerCase();
  const password = registerForm.querySelector('input[placeholder="Password"]').value.trim();

  //Sección donde se validan si hay espacios vacios
  //Con esto se garantiza que los campos estan completos, de lo contrario, no hay acceso

  if(!name || ! email || !password){
    alert("Hay campos incompletos, por favor completalos. :))")
    return;
  }

  //En esta parte se revisa si hay usaurio alamceandos en el localStorage
  // esta sección usamos JSON.parse para convertir una cadena de texto a un objeto JS 

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  //aquí verificamos si exiset el correo, si no, continuamos con el proceso

  if(users.some(u => u.email === email)){
    alert("El correo ya fue registrado. :(")
    return;
  }

  //En este bloque de código guardmos al nuevo usuario
  //usando push que es un método que se utiliza para agregar nuevos usuario
  /*en este caso, es necesario comprender que localStorage solo acepta cadenas de texto, por lo tanto,
    convierte el array a texto JSON y lo alamcena.
  */
  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  // Se garantiza que hubo éxito con un alert

  alert("Registro exitoso. Continua con el inicio de sesión :))");
  //Se requieren limpiar los campos del formulario para el siguiente usuario
  registerForm.reset();
  container.classList.remove('right-panel-active'); 
});

// Comenzamos con el Login del usuario

// 
loginButton.addEventListener('submit', (e) => {
  e.preventDefault()


//Se guardan las entradas que el usuario proporciona

const email = loginButton.querySelector('input[placeholder="Email"]').value.trim().toLowerCase();
const password = loginButton.querySelector('input[placeholder="Password"]').value.trim();
const rememberMe = document.getElementById('checkbox').checked;


//Se obtienen los usuarios guardados en el localStorage
// En este caso si no encuentra al usuario se guarda la informacion en un array vacio

const users = JSON.parse(localStorage.getItem('users') || '[]');

//Se realiza una comparación entre el usaurio guardado y el usuario que entra

const user = users.find( u => u.email === email && u.password === password);

//Validación de usuario

if(user){
  alert("Datos correctos, bienvenido " + user.name);

  


    // Guardar sesión temporal o persistente
    const sessionData = { name: user.name, email: user.email, loginTime: Date.now() };
    if (rememberMe) {
      // Sesión persistente 30 días
      const expires = Date.now() + 30*24*60*60*1000;
      localStorage.setItem('session', JSON.stringify({ ...sessionData, expires }));
    } else {
      // Sesión temporal de pestaña
      sessionStorage.setItem('session', JSON.stringify(sessionData));
    }

    // Redirigir a página index
    window.location.href = 'index.html';

  } else {
    alert('Correo o contraseña incorrectos.');
  }
});



