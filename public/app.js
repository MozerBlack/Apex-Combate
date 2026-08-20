// APEX COMBATE — Lógica Principal do Frontend
document.addEventListener("DOMContentLoaded", () => {
  console.log("Apex Combate Frontend Inicializado!");

  // Elementos Globais da Interface
  const banner = document.getElementById("banner-alerta");
  const formLogin = document.getElementById("form-login");
  const cardLoginPrincipal = document.getElementById("card-login-principal");
  const cardOtp = document.getElementById("card-otp");
  
  const labelUsuario = document.getElementById("label-usuario");
  const inputUsuario = document.getElementById("usuario");
  const labelSenha = document.getElementById("label-senha");
  const inputSenha = document.getElementById("senha");
  
  const abas = document.querySelectorAll(".aba-btn");
  const opcoesClube = document.getElementById("opcoes-clube");
  const btnSolicitarCodigo = document.getElementById("btn-solicitar-codigo");
  const btnValidarOtp = document.getElementById("btn-validar-otp");
  const btnVoltarLogin = document.getElementById("btn-voltar-login");

  let perfilSelecionado = "atleta"; // Padrão inicial

  // Helper para exibir Banners de Alerta
  function exibirBanner(mensagem, tipo = "sucesso") {
    if (!banner) return;
    banner.textContent = mensagem;
    banner.className = `banner ${tipo}`;
    banner.classList.remove("hidden");
    setTimeout(() => banner.classList.add("hidden"), 5000);
  }

  // 1. GERENCIAMENTO DE ABAS DE PERFIL (Atleta / Clube / Federação)
  abas.forEach((aba) => {
    aba.addEventListener("click", () => {
      abas.forEach((a) => a.classList.remove("active"));
      aba.classList.add("active");
      
      perfilSelecionado = aba.getAttribute("data-perfil");
      configurarFormularioPorPerfil(perfilSelecionado);
    });
  });

  function configurarFormularioPorPerfil(perfil) {
    inputUsuario.value = "";
    inputSenha.value = "";

    if (perfil === "atleta") {
      labelUsuario.textContent = "CPF do Atleta";
      inputUsuario.placeholder = "000.000.000-00";
      labelSenha.textContent = "Data de Nascimento";
      inputSenha.type = "date";
      inputSenha.placeholder = "";
      opcoesClube.classList.add("hidden");
    } else if (perfil === "clube") {
      labelUsuario.textContent = "Usuário ou E-mail do Clube";
      inputUsuario.placeholder = "ex: clube.apex ou contato@clube.com";
      labelSenha.textContent = "Senha de Acesso";
      inputSenha.type = "password";
      inputSenha.placeholder = "••••••••";
      opcoesClube.classList.remove("hidden");
    } else if (perfil === "federacao") {
      labelUsuario.textContent = "Identificador / E-mail";
      inputUsuario.placeholder = "PRES-01 ou admin@federacao";
      labelSenha.textContent = "Senha Master / Admin";
      inputSenha.type = "password";
      inputSenha.placeholder = "••••••••";
      opcoesClube.classList.add("hidden");
    }
  }

  // 2. MÁSCARA AUTOMÁTICA DE CPF (Apenas no modo Atleta)
  if (inputUsuario) {
    inputUsuario.addEventListener("input", (e) => {
      if (perfilSelecionado !== "atleta") return;

      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      e.target.value = value;
    });
  }

  // 3. ENVIAR FORMULÁRIO DE LOGIN
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usuarioVal = inputUsuario.value.trim();
      const senhaVal = inputSenha.value;

      if (!usuarioVal || !senhaVal) {
        exibirBanner("Preencha todos os campos obrigatórios.", "erro");
        return;
      }

      // Rota genérica ou individual de API baseada no perfil
      let endpoint = "/api/login";
      let bodyData = { usuario: usuarioVal, senha: senhaVal, perfil: perfilSelecionado };

      if (perfilSelecionado === "atleta") {
        const cpfLimpo = usuarioVal.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
          exibirBanner("Por favor, digite um CPF válido com 11 dígitos.", "erro");
          return;
        }
        bodyData = { cpf: cpfLimpo, data_nascimento: senhaVal, perfil: "ATLETA" };
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });

        const data = await response.json();

        if (response.ok) {
          // Se o Presidente Master logar, aciona a etapa 2FA
          if (data.status === "2FA_REQUIRED") {
            exibirBanner("Código enviado via WhatsApp, SMS e E-mail!", "sucesso");
            cardLoginPrincipal.classList.add("hidden");
            cardOtp.classList.remove("hidden");
            return;
          }

          // Demais Logins (Atleta, Admin, Clube)
          exibirBanner("Login realizado com sucesso!", "sucesso");
          localStorage.setItem("apex_user", JSON.stringify(data.usuario || data));
          setTimeout(() => window.location.href = "perfil.html", 1500);

        } else {
          exibirBanner(data.error || "Credenciais incorretas. Tente novamente.", "erro");
        }
      } catch (err) {
        console.warn("API offline. Redirecionando em modo demonstração...");
        exibirBanner("Modo Demonstração Ativo.", "sucesso");
        localStorage.setItem("apex_user", JSON.stringify({ usuario: usuarioVal, perfil: perfilSelecionado }));
        setTimeout(() => window.location.href = "perfil.html", 1000);
      }
    });
  }

  // 4. SOLICITAR CÓDIGO TEMPORÁRIO (Entrar sem senha - Clube)
  if (btnSolicitarCodigo) {
    btnSolicitarCodigo.addEventListener("click", async () => {
      const usuarioVal = inputUsuario.value.trim();
      if (!usuarioVal) {
        exibirBanner("Informe o usuário ou e-mail do Clube primeiro.", "erro");
        return;
      }

      try {
        const response = await fetch("/api/login/clube/solicitar-codigo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario: usuarioVal }),
        });

        if (response.ok) {
          exibirBanner("Código temporário enviado por WhatsApp, SMS e E-mail!", "sucesso");
          cardLoginPrincipal.classList.add("hidden");
          cardOtp.classList.remove("hidden");
        } else {
          exibirBanner("Clube não localizado.", "erro");
        }
      } catch (err) {
        exibirBanner("Código simulado enviado ao WhatsApp!", "sucesso");
        cardLoginPrincipal.classList.add("hidden");
        cardOtp.classList.remove("hidden");
      }
    });
  }

  // 5. VALIDAR CÓDIGO OTP DE 6 DÍGITOS
  if (btnValidarOtp) {
    btnValidarOtp.addEventListener("click", async () => {
      const codigoVal = document.getElementById("codigo-otp").value.trim();

      if (codigoVal.length !== 6) {
        exibirBanner("O código deve ter exatamente 6 dígitos.", "erro");
        return;
      }

      try {
        const response = await fetch("/api/login/validar-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo: codigoVal }),
        });

        if (response.ok) {
          exibirBanner("Acesso validado com sucesso!", "sucesso");
          setTimeout(() => window.location.href = "perfil.html", 1500);
        } else {
          exibirBanner("Código incorreto ou expirado.", "erro");
        }
      } catch (err) {
        exibirBanner("Acesso liberado (Modo offline)!", "sucesso");
        setTimeout(() => window.location.href = "perfil.html", 1000);
      }
    });
  }

  if (btnVoltarLogin) {
    btnVoltarLogin.addEventListener("click", () => {
      cardOtp.classList.add("hidden");
      cardLoginPrincipal.classList.remove("hidden");
    });
  }

  // 6. SIMULAÇÃO DO CRONÔMETRO DO PLACAR (placar.html)
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