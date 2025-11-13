(function verifyAdminAccess() {
      // Obtener sesión actual
      const sessionData = localStorage.getItem('session') || sessionStorage.getItem('session');
      const session = sessionData ? JSON.parse(sessionData) : null;

      if (!session) {
        Toastify({
          text: "Debes iniciar sesión para acceder a esta página.",
          duration: 2500,
          backgroundColor: "#e74c3c",
          close: true
        }).showToast();

        setTimeout(() => window.location.href = "forbidden.html", 1500);
        return;
      }

      // Validar si es administrador
      if (!session.isAdmin) {
        Toastify({
          text: "Acceso denegado. Esta página es solo para administradores.",
          duration: 2500,
          backgroundColor: "#f39c12",
          close: true
        }).showToast();

        setTimeout(() => window.location.href = "forbidden.html", 1500);
        return;
      }

      console.log("✅ Acceso autorizado para administrador:", session.name);

      // Cargar catálogo solo si tiene acceso
      const script = document.createElement("script");
      script.src = "assets/js/pg-catalog.js";
      script.onload = () => console.log("📦 Catálogo cargado correctamente");
      document.body.appendChild(script);
    })();