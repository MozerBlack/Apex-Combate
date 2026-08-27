// APEX COMBATE — Lógica Principal do Frontend
document.addEventListener("DOMContentLoaded", () => {
  console.log("Apex Combate Frontend Inicializado!");

  // 1. MÁSCARA AUTOMÁTICA DE CPF (usada em formulários de atleta)
  const cpfInput = document.getElementById("cpf");
  if (cpfInput && !cpfInput.dataset.maskApplied) {
    cpfInput.dataset.maskApplied = "true";
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      e.target.value = value;
    });
  }

  // 2. CRONÔMETRO DO PLACAR (placar.html)
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

  // 3. PERFIL — preenche dados do atleta logado (se existir no localStorage)
  const perfilNome = document.querySelector("[data-perfil-nome]");
  if (perfilNome) {
    try {
      const raw = localStorage.getItem("apex_atleta");
      if (raw) {
        const atleta = JSON.parse(raw);
        if (atleta.nome_completo) {
          perfilNome.textContent = atleta.nome_completo;
        }
      }
    } catch (err) {
      console.warn("Não foi possível carregar dados do atleta:", err);
    }
  }
});
