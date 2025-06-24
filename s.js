// Configuração atualizada com sua chave
const GROQ_API = {
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: "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",
  model: "llama3-70b-8192" // Modelo mais recente da Groq
};

// Elementos da UI
const UI = {
  chatbox: document.getElementById('chatbox'),
  userInput: document.getElementById('userInput'),
  sendBtn: document.getElementById('sendBtn')
};

// Função principal para enviar mensagens
async function sendMessage() {
  const message = UI.userInput.value.trim();
  if (!message) return;

  // Adiciona mensagem do usuário
  addMessage(message, 'user');
  UI.userInput.value = '';
  UI.sendBtn.disabled = true;
  
  try {
    // Mostra status de "digitando"
    const typingIndicator = addMessage("Digitando...", 'bot');
    
    // Chamada à API Groq
    const response = await fetch(GROQ_API.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API.apiKey}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
        model: GROQ_API.model,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    // Remove o "digitando..."
    UI.chatbox.removeChild(typingIndicator);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na API');
    }

    const data = await response.json();
    addMessage(data.choices[0].message.content, 'bot');
    
  } catch (error) {
    addMessage(`⚠️ Erro: ${error.message}`, 'error');
    console.error("Detalhes do erro:", error);
  } finally {
    UI.sendBtn.disabled = false;
    UI.userInput.focus();
  }
}

// Função auxiliar para adicionar mensagens
function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.textContent = text;
  UI.chatbox.appendChild(msg);
  UI.chatbox.scrollTop = UI.chatbox.scrollHeight;
  return msg;
}

// Event Listeners
UI.sendBtn.addEventListener('click', sendMessage);
UI.userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
