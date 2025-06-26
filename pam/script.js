document.getElementById('clienteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  let valid = true;
  ['nome','sobrenome'].forEach(id => {
    const field = document.getElementById(id);
    const err  = document.getElementById('erro-'+id);
    if (!field.value.trim()) {
      err.style.display = 'block';
      valid = false;
    } else {
      err.style.display = 'none';
    }
  });
  if (!valid) {
    return;
  }

  const data = {
    nome: document.getElementById('nome').value.trim(),
    sobrenome: document.getElementById('sobrenome').value.trim()
  };

  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    const resultadoDiv = document.getElementById('resultado');
    if (response.ok) {
      resultadoDiv.style.color = 'green';
      resultadoDiv.textContent = result.message;
    } else {
      resultadoDiv.style.color = 'red';
      resultadoDiv.textContent = result.error || 'Erro ao cadastrar cliente.';
    }
  } catch (err) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.color = 'red';
    resultadoDiv.textContent = 'Erro de rede: ' + err.message;
  }
});
