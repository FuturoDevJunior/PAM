document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('webForm');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    mensagem.textContent = '';
    mensagem.className = 'mensagem';

    const nome = form.nome.value.trim();
    const sobrenome = form.sobrenome.value.trim();

    if (!nome || !sobrenome) {
      mensagem.textContent = 'Todos os campos são obrigatórios.';
      mensagem.classList.add('erro');
      return;
    }

    try {
      const response = await fetch('/api/submit.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, sobrenome })
      });
      const data = await response.json();
      if (response.ok && data.sucesso) {
        mensagem.textContent = data.mensagem || 'Enviado com sucesso!';
        mensagem.classList.add('sucesso');
        form.reset();
      } else {
        mensagem.textContent = data.mensagem || 'Erro ao enviar.';
        mensagem.classList.add('erro');
      }
    } catch (err) {
      mensagem.textContent = 'Erro de conexão. Tente novamente.';
      mensagem.classList.add('erro');
    }
  });
}); 