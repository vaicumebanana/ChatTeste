// Configuração corrigida
const API_CONFIG = {
    baseURL: "https://api.groq.com",
    endpoint: "/v1/chat/completions", // ATENÇÃO: estava escrito errado antes ("completions" sem o 'i')
    apiKey: "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",
    model: "llama3-70b-8192"
};

// Elementos do DOM
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');

// Função principal corrigida
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Adiciona mensagem do usuário
    addMessage(message, 'user');
    userInput.value = '';

    try {
        // Resposta da API (versão simplificada e testada)
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: message }],
                model: API_CONFIG.model,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();
        addMessage(data.choices[0].message.content, 'bot');

    } catch (error) {
        addMessage(`Erro: ${error.message}`, 'bot');
        console.error("Erro completo:", error);
    }
}

// Funções auxiliares
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
