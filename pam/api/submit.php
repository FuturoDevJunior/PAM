<?php
header('Content-Type: application/json');

// Permitir CORS para testes locais (remova em produção se necessário)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}
header('Access-Control-Allow-Origin: *');

// Apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit;
}

// Lê o corpo JSON
$input = json_decode(file_get_contents('php://input'), true);
$nome = isset($input['nome']) ? trim($input['nome']) : '';
$sobrenome = isset($input['sobrenome']) ? trim($input['sobrenome']) : '';

// Validação
if ($nome === '' || $sobrenome === '') {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Todos os campos são obrigatórios.']);
    exit;
}

// Envia para API externa
$url = 'https://api.orbitera.com.br/clients';
$payload = json_encode(['nome' => $nome, 'sobrenome' => $sobrenome]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao conectar à API externa.']);
    exit;
}

$data = json_decode($response, true);
if ($httpcode >= 200 && $httpcode < 300) {
    echo json_encode(['sucesso' => true, 'mensagem' => 'Dados enviados com sucesso!', 'retorno_api' => $data]);
} else {
    http_response_code(400);
    $msg = isset($data['mensagem']) ? $data['mensagem'] : 'Erro ao enviar para API externa.';
    echo json_encode(['sucesso' => false, 'mensagem' => $msg, 'retorno_api' => $data]);
} 