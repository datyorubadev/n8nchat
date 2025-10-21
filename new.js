// Premium Intercom-Style Chat Widget for n8n
(function () {
  if (window.N8nChatWidgetLoaded) return;
  window.N8nChatWidgetLoaded = true;

  // Load font
  const fontElement = document.createElement("link");
  fontElement.rel = "stylesheet";
  fontElement.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(fontElement);

  // Styles
  const widgetStyles = document.createElement("style");
  widgetStyles.textContent = `
  .chat-assist-widget {
    --chat-color-primary: #0F6FFF;
    --chat-color-primary-hover: #0D5FE5;
    --chat-color-surface: #ffffff;
    --chat-color-text: #0D1C2E;
    --chat-color-border: #E8EAED;
    --chat-color-hover: #F5F7FA;
    --chat-radius-md: 10px;
    --chat-radius-lg: 16px;
    --chat-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Chat window */
  .chat-assist-widget .chat-window {
    position: fixed;
    bottom: 100px;
    right: 16px;
    width: 400px;
    height: 640px;
    background: var(--chat-color-surface);
    border-radius: var(--chat-radius-lg);
    box-shadow: 0 12px 40px rgba(13, 28, 46, 0.12);
    display: none;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px) scale(0.96);
    transition: var(--chat-transition);
    opacity: 0;
    z-index: 10000;
  }

  .chat-assist-widget .chat-window.visible {
    display: flex;
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .chat-assist-widget .chat-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--chat-color-border);
    background: var(--chat-color-surface);
  }

  .chat-assist-widget .chat-header-logo {
    width: 40px;
    height: 40px;
    border-radius: var(--chat-radius-md);
    object-fit: cover;
  }

  .chat-assist-widget .chat-header-content {
    flex: 1;
  }

  .chat-assist-widget .chat-header-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--chat-color-text);
  }

  .chat-assist-widget .chat-header-status {
    font-size: 13px;
    color: #8B95A5;
  }

  /* Chat body */
  .chat-assist-widget .chat-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-assist-widget .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Sticky input */
  .chat-assist-widget .chat-controls {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background: var(--chat-color-surface);
    border-top: 1px solid var(--chat-color-border);
    display: flex;
    gap: 12px;
    align-items: center;
    z-index: 2;
  }

  .chat-assist-widget .chat-input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background: var(--chat-color-surface);
    border: 1px solid var(--chat-color-border);
    border-radius: 24px;
    padding: 0 16px;
    transition: var(--chat-transition);
    min-height: 48px;
  }

  .chat-assist-widget .chat-input-container:focus-within {
    border-color: var(--chat-color-primary);
    box-shadow: 0 0 0 3px rgba(15, 111, 255, 0.1);
  }

  .chat-assist-widget .chat-textarea {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--chat-color-text);
    resize: none;
    font-family: inherit;
    font-size: 15px;
    line-height: 1.5;
    padding: 0;
    outline: none;
  }

  .chat-assist-widget .chat-submit {
    background: var(--chat-color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--chat-transition);
    box-shadow: 0 2px 6px rgba(15, 111, 255, 0.3);
  }

  .chat-assist-widget .chat-submit:hover {
    background: var(--chat-color-primary-hover);
    transform: scale(1.05);
  }

  /* Bubbles */
  .chat-assist-widget .chat-bubble {
    padding: 12px 16px;
    border-radius: var(--chat-radius-md);
    max-width: 75%;
    font-size: 15px;
    line-height: 1.5;
  }

  .chat-assist-widget .chat-bubble.user-bubble {
    background: var(--chat-color-primary);
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .chat-assist-widget .chat-bubble.bot-bubble {
    background: var(--chat-color-hover);
    color: var(--chat-color-text);
    border-bottom-left-radius: 4px;
  }

  /* Launcher */
  .chat-assist-widget .chat-launcher {
    position: fixed;
    bottom: 20px;
    right: 16px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--chat-color-primary);
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(15, 111, 255, 0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: var(--chat-transition);
    animation: chatPulse 3s infinite;
  }

  @keyframes chatPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(15, 111, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(15, 111, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(15, 111, 255, 0);
    }
  }

  .chat-assist-widget .chat-launcher:hover {
    transform: scale(1.05);
  }

  .chat-assist-widget .chat-launcher-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-assist-widget .chat-launcher-text {
    display: none;
  }

  .chat-assist-widget .chat-launcher.expanded {
    width: auto;
    border-radius: 30px;
    padding: 0 16px;
    gap: 10px;
    justify-content: flex-start;
    animation: none;
  }

  .chat-assist-widget .chat-launcher.expanded .chat-launcher-text {
    display: inline;
  }
  `;
  document.head.appendChild(widgetStyles);

  // Widget root
  const widgetRoot = document.createElement("div");
  widgetRoot.className = "chat-assist-widget";
  document.body.appendChild(widgetRoot);

  // Chat window
  const chatWindow = document.createElement("div");
  chatWindow.className = "chat-window right-side";
  chatWindow.innerHTML = `
    <div class="chat-header">
      <img class="chat-header-logo" src="https://cdn.jsdelivr.net/gh/datyorubadev/n8nchat/logo.png" alt="Chat Assistant">
      <div class="chat-header-content">
        <div class="chat-header-title">Chat Assistant</div>
        <div class="chat-header-status">Typically replies instantly</div>
      </div>
      <button class="chat-close-btn">×</button>
    </div>
    <div class="chat-body">
      <div class="chat-messages"></div>
      <div class="chat-controls">
        <div class="chat-input-container">
          <textarea class="chat-textarea" placeholder="Send a message..."></textarea>
          <button class="chat-submit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  widgetRoot.appendChild(chatWindow);

  // Launcher
  const launchButton = document.createElement("button");
  launchButton.className = "chat-launcher";
  launchButton.innerHTML = `
    <div class="chat-launcher-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </div>
    <span class="chat-launcher-text">Need help?</span>`;
  widgetRoot.appendChild(launchButton);

  // DOM refs
  const messagesContainer = chatWindow.querySelector(".chat-messages");
  const messageTextarea = chatWindow.querySelector(".chat-textarea");
  const sendButton = chatWindow.querySelector(".chat-submit");

  // Append message
  function appendMessage(text, isUser = false) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`;
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendButton.addEventListener("click", () => {
    const text = messageTextarea.value.trim();
    if (!text) return;
    appendMessage(text, true);
    messageTextarea.value = "";
  });

  messageTextarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });

  // Launcher toggle
  launchButton.addEventListener("click", () => {
    chatWindow.classList.toggle("visible");
  });

  // Expand launcher on hover
  launchButton.addEventListener("mouseenter", () => {
    launchButton.classList.add("expanded");
  });
  launchButton.addEventListener("mouseleave", () => {
    launchButton.classList.remove("expanded");
  });

  // Close chat
  chatWindow.querySelector(".chat-close-btn").addEventListener("click", () => {
    chatWindow.classList.remove("visible");
  });
})();
