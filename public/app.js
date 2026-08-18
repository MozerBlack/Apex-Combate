// APEX COMBATE — Lógica Principal do Frontend
document.addEventListener("DOMContentLoaded", () => {
  console.log("Apex Combate Frontend Inicializado!");

  // 1. MÁSCARA AUTOMÁTICA DE CPF
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      // Formatação 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      e.target.value = value;
    });
  }

  // 2. LÓGICA DE LOGIN DO ATLETA (CPF + DATA DE NASCIMENTO)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
      const dataNascimento = document.getElementById("data_nascimento").value;

      if (cpf.length !== 11) {
        alert("Por favor, digite um CPF válido com 11 dígitos.");
        return;
      }

      if (!dataNascimento) {
        alert("Por favor, selecione sua data de nascimento.");
        return;
      }

      try {
        // Envio para a API / Backend
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cpf, data_nascimento: dataNascimento }),
        });

        const data = await response.json();

        if (response.ok) {
          // Salva sessão localmente e redireciona para a Área do Atleta
          localStorage.setItem("apex_atleta", JSON.stringify(data.usuario));
          window.location.href = "perfil.html";
        } else {
          alert(data.error || "Dados incorretos. Verifique CPF e Data de Nascimento.");
        }
      } catch (err) {
        console.warn("API offline. Redirecionando em modo demonstração...");
        // Fallback temporário para testes offline
        localStorage.setItem("apex_atleta", JSON.stringify({ cpf, dataNascimento }));
        window.location.href = "perfil.html";
      }
    });
  }

  // 3. SIMULAÇÃO DE CRONÔMETRO DO PLACAR (placar.html)
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    let totalSegundos = 165; // 02:45 min

    const updateTimer = () => {
      const minutos = Math.floor(totalSegundos / 60);
      const segundos = totalSegundos % 60;
      
      timerElement.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

      if (totalSegundos > 0) {
        totalSegundos--;
      }
    };

    setInterval(updateTimer, 1000);
  }
});