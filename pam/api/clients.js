export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, sobrenome } = req.body;
  if (!nome || !sobrenome) {
    return res.status(400).json({ error: 'O nome e o sobrenome são obrigatórios.' });
  }

  try {
    const response = await fetch('https://api.orbitera.com.br/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: nome, lastName: sobrenome })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Erro da API externa', details: data });
    }
    return res.status(200).json({ message: 'Cliente cadastrado com sucesso!', data });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao cadastrar cliente.', details: err.message });
  }
}
