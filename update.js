// Premium Intercom-Style Chat Widget for n8n - Enhanced Version
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Enhanced configuration
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: 'Hello! How can we help you?',
            responseTimeText: 'We typically reply within minutes',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/fabimarkl'
            }
        },
        style: {
            primaryColor: '#0F6FFF',
            secondaryColor: '#0D5FE5',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#0D1C2E'
        },
        features: {
            fileUpload: true,
            voiceMessages: false,
            chatHistory: true,
            readReceipts: true,
            smartSuggestions: true
        },
        suggestedQuestions: [],
        autoResponses: {
            greeting: "Hi there! 👋 I'm here to help. What can I assist you with today?",
            offline: "Sorry, I'm currently offline. Please leave a message and I'll get back to you soon!",
            default: "Thanks for your message! I'll help you with that."
        }
    };

    const settings = window.ChatWidgetConfig ? 
        { ...defaultSettings, ...window.ChatWidgetConfig } : defaultSettings;

    // Enhanced state management
    let conversationId = '';
    let isWaitingForResponse = false;
    let unreadMessages = 0;
    let chatHistory = [];
    let isOnline = true;

    // Create enhanced widget structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Enhanced styles with new features
    const enhancedStyles = `
        /* ... (previous styles) ... */
        
        /* Enhanced Message Status */
        .message-status {
            font-size: 11px;
            color: var(--chat-color-text-tertiary);
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0.7;
        }
        
        .user-bubble .message-status {
            justify-content: flex-end;
        }
        
        /* File Upload Styles */
        .upload-btn {
            background: transparent;
            border: none;
            color: var(--chat-color-text-tertiary);
            cursor: pointer;
            padding: 8px;
            border-radius: var(--chat-radius-sm);
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
        }
        
        .upload-btn:hover {
            background: var(--chat-color-hover);
            color: var(--chat-color-primary);
        }
        
        .file-message {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: var(--chat-color-primary-light);
            border-radius: var(--chat-radius-md);
            border: 1px solid var(--chat-color-border);
            max-width: 75%;
        }
        
        .file-info {
            flex: 1;
            min-width: 0;
        }
        
        .file-name {
            font-weight: 500;
            font-size: 14px;
            color: var(--chat-color-text);
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .file-size {
            font-size: 12px;
            color: var(--chat-color-text-tertiary);
        }
        
        .download-btn {
            background: var(--chat-color-primary);
            color: white;
            border: none;
            border-radius: var(--chat-radius-sm);
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        
        /* Quick Replies */
        .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }
        
        .quick-reply-btn {
            background: white;
            border: 1px solid var(--chat-color-border);
            border-radius: 16px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
        }
        
        .quick-reply-btn:hover {
            background: var(--chat-color-primary);
            color: white;
            border-color: var(--chat-color-primary);
            transform: translateY(-1px);
        }
        
        /* Typing Awareness */
        .typing-awareness {
            padding: 0 20px 8px;
            font-size: 12px;
            color: var(--chat-color-text-tertiary);
            font-style: italic;
            min-height: 18px;
        }
        
        /* Connection Status */
        .connection-status {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10B981;
            z-index: 1;
        }
        
        .connection-status.offline {
            background: #EF4444;
        }
        
        /* Notification Badge Enhancement */
        .notification-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 20px;
            height: 20px;
            background: #EF4444;
            color: white;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        /* Smart Suggestions */
        .smart-suggestions {
            background: var(--chat-color-primary-light);
            border-radius: var(--chat-radius-md);
            padding: 16px;
            margin: 12px 0;
            border-left: 3px solid var(--chat-color-primary);
        }
        
        .suggestion-title {
            font-weight: 600;
            font-size: 13px;
            color: var(--chat-color-text);
            margin-bottom: 8px;
        }
        
        /* Message Reactions */
        .message-reactions {
            display: flex;
            gap: 4px;
            margin-top: 8px;
        }
        
        .reaction-btn {
            background: white;
            border: 1px solid var(--chat-color-border);
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        
        .reaction-btn:hover {
            background: var(--chat-color-hover);
            transform: scale(1.05);
        }
        
        /* Enhanced Animations */
        @keyframes gentleBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-3px); }
            60% { transform: translateY(-2px); }
        }
        
        .message-reaction {
            animation: gentleBounce 0.6s ease;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .chat-assist-widget .chat-window {
                width: 100vw;
                height: 100vh;
                bottom: 0;
                right: 0;
                left: 0;
                border-radius: 0;
            }
            
            .chat-assist-widget .chat-launcher {
                bottom: 20px;
                right: 20px;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .chat-assist-widget {
                --chat-color-surface: #1a1a1a;
                --chat-color-text: #ffffff;
                --chat-color-text-secondary: #a0a0a0;
                --chat-color-text-tertiary: #666666;
                --chat-color-border: #333333;
                --chat-color-hover: #2a2a2a;
            }
        }
    `;

    // Enhanced DOM creation with new features
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    const enhancedHTML = `
        <div class="chat-header">
            <div class="connection-status ${isOnline ? '' : 'offline'}"></div>
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <div class="chat-header-content">
                <div class="chat-header-title">${settings.branding.name}</div>
                <div class="chat-header-status">
                    <span class="chat-status-dot"></span>
                    ${isOnline ? 'Online • Replying instantly' : 'Offline • We\'ll reply soon'}
                </div>
            </div>
            <button class="chat-close-btn">×</button>
        </div>
        
        <div class="chat-welcome">
            <div class="chat-welcome-emoji">👋</div>
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <p class="chat-welcome-subtitle">${settings.branding.responseTimeText}</p>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Start a conversation
            </button>
        </div>
        
        <div class="user-registration">
            <h2 class="registration-title">Welcome! 👋</h2>
            <p class="registration-subtitle">We just need a few details to get started</p>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label" for="chat-user-name">Your name</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="Enter your name" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email">Email address</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="you@company.com" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">Continue</button>
            </form>
        </div>
        
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="typing-awareness"></div>
            <div class="chat-controls">
                ${settings.features.fileUpload ? `
                <button class="upload-btn" title="Attach file">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                </button>
                ` : ''}
                <div class="chat-input-container">
                    <textarea class="chat-textarea" placeholder="Send a message..." rows="1"></textarea>
                </div>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = enhancedHTML;

    // Enhanced functionality implementation
    class EnhancedChatWidget {
        constructor() {
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.checkConnection();
            this.loadChatHistory();
        }
        
        setupEventListeners() {
            // Enhanced event listeners with new features
            if (settings.features.fileUpload) {
                this.setupFileUpload();
            }
            
            // Smart input handling
            this.setupSmartInput();
        }
        
        setupFileUpload() {
            const uploadBtn = chatWindow.querySelector('.upload-btn');
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif';
            
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        }
        
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Create file message
            const fileMessage = this.createFileMessage(file);
            this.addMessage(fileMessage, 'user');
            
            // Upload file and send to webhook
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('conversationId', conversationId);
                
                const response = await fetch(settings.webhook.url, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                this.addMessage(this.createBotMessage(result.message), 'bot');
            } catch (error) {
                console.error('File upload error:', error);
                this.addMessage(this.createBotMessage("Sorry, I couldn't upload your file. Please try again."), 'bot');
            }
        }
        
        createFileMessage(file) {
            const fileSize = this.formatFileSize(file.size);
            
            return `
                <div class="file-message">
                    <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                    <button class="download-btn">Download</button>
                </div>
            `;
        }
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        setupSmartInput() {
            const textarea = chatWindow.querySelector('.chat-textarea');
            const typingAwareness = chatWindow.querySelector('.typing-awareness');
            
            let typingTimer;
            textarea.addEventListener('input', () => {
                clearTimeout(typingTimer);
                typingAwareness.textContent = "Typing...";
                
                typingTimer = setTimeout(() => {
                    typingAwareness.textContent = "";
                }, 1000);
                
                // Auto-suggest based on input
                if (settings.features.smartSuggestions) {
                    this.showSmartSuggestions(textarea.value);
                }
            });
        }
        
        showSmartSuggestions(input) {
            // Implement AI-powered suggestions based on input
            const suggestions = this.generateSuggestions(input);
            if (suggestions.length > 0) {
                this.displayQuickReplies(suggestions);
            }
        }
        
        generateSuggestions(input) {
            // Simple keyword-based suggestions - can be enhanced with AI
            const suggestions = [];
            
            if (input.toLowerCase().includes('price') || input.toLowerCase().includes('cost')) {
                suggestions.push('What are your pricing plans?');
                suggestions.push('Do you offer any discounts?');
            }
            
            if (input.toLowerCase().includes('support')) {
                suggestions.push('How can I contact support?');
                suggestions.push('What are your support hours?');
            }
            
            return suggestions.slice(0, 3); // Limit to 3 suggestions
        }
        
        displayQuickReplies(suggestions) {
            const quickReplies = document.createElement('div');
            quickReplies.className = 'quick-replies';
            
            suggestions.forEach(suggestion => {
                const button = document.createElement('button');
                button.className = 'quick-reply-btn';
                button.textContent = suggestion;
                button.addEventListener('click', () => {
                    this.submitMessage(suggestion);
                    quickReplies.remove();
                });
                quickReplies.appendChild(button);
            });
            
            const messagesContainer = chatWindow.querySelector('.chat-messages');
            messagesContainer.appendChild(quickReplies);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        checkConnection() {
            // Simulate connection check - replace with actual implementation
            setInterval(() => {
                const statusIndicator = chatWindow.querySelector('.connection-status');
                const statusText = chatWindow.querySelector('.chat-header-status');
                
                if (Math.random() > 0.1) { // 90% online
                    isOnline = true;
                    statusIndicator.classList.remove('offline');
                    statusText.innerHTML = '<span class="chat-status-dot"></span>Online • Replying instantly';
                } else {
                    isOnline = false;
                    statusIndicator.classList.add('offline');
                    statusText.innerHTML = '<span class="chat-status-dot" style="background: #EF4444;"></span>Offline • We\'ll reply soon';
                }
            }, 30000); // Check every 30 seconds
        }
        
        loadChatHistory() {
            if (settings.features.chatHistory) {
                const history = localStorage.getItem(`chatHistory_${conversationId}`);
                if (history) {
                    chatHistory = JSON.parse(history);
                    this.renderChatHistory();
                }
            }
        }
        
        saveChatHistory() {
            if (settings.features.chatHistory) {
                const history = {
                    conversationId,
                    messages: chatHistory,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem(`chatHistory_${conversationId}`, JSON.stringify(history));
            }
        }
        
        // ... rest of enhanced methods
    }

    // Initialize enhanced widget
    new EnhancedChatWidget();

    console.log('Enhanced Premium Intercom-Style Chat Widget initialized!');
})();
