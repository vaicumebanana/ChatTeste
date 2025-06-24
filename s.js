// CONFIGURAÇÃO ATUALIZADA (CORRIGIDA)
const API_CONFIG = {
    baseURL: "https://api.groq.com",
    endpoint: "/v1/chat/completions", // ✅ CORRETO (antes tinha erro de digitação)
    apiKey: "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",
    model: "mixtral-8x7b-32768" // ✅ Modelo atualizado (funciona melhor)
};

// FUNÇÃO PRINCIPAL CORRIGIDA
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    // Adiciona mensagem do usuário
    addMessage(message, 'user');
    input.value = '';
    input.disabled = true;

    try {
        // ✅ URL CORRETA (usando URL absoluta)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        console.error("Detalhes do erro:", error);
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// FUNÇÃO AUXILIAR
function addMessage(text, sender) {
    const chatbox = document.getElementById('chatbox');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
