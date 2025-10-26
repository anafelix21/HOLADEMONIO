document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatbot-toggle");
  const close = document.getElementById("chatbot-close");
  const chatbot = document.getElementById("chatbot");
  const send = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  toggle.addEventListener("click", () => {
    chatbot.classList.toggle("hidden");
  });

  close.addEventListener("click", () => {
    chatbot.classList.add("hidden");
  });

  send.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    setTimeout(() => {
      const reply = getBotReply(text.toLowerCase());
      addMessage("bot", reply);
    }, 600);
  }

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add(sender === "user" ? "message-user" : "message-bot");
    msg.innerHTML = text.replace(/\n/g, "<br>"); // 👈 Permite saltos de línea
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotReply(text) {
    if (text.includes("hola"))
      return "¡Hola! 😊 ¿Buscas carne de res, cerdo o pollo?";
    if (text.includes("res"))
      return "La carne de res es ideal para asados o guisos. Tenemos cortes como lomo y bistec 🥩.";
    if (text.includes("pollo"))
      return "Tenemos muslo, pechuga y alitas frescas 🐔.";
    if (text.includes("cerdo"))
      return "Deliciosas chuletas, costillas y más 🐷.";
    if (text.includes("horario") || text.includes("hora") || text.includes("atención"))
      return "⏰ *Nuestros horarios de atención son:*\nLunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 8:00 AM - 3:00 PM\nDomingos: Cerrados 🛑";
    if (text.includes("whatsapp") || text.includes("pedido") || text.includes("pedidos"))
      return "📲 ¡Sí! Puedes hacer tus pedidos fácilmente por *WhatsApp*.\nEnvíanos un mensaje con lo que necesitas y te lo confirmamos enseguida.";
    if (text.includes("gracias"))
      return "¡Con gusto! 🐮 Si necesitas algo más, aquí estaré.";
    return "Lo siento, no entendí muy bien 🐮💭 ¿Podrías repetirlo?";
  }
});
