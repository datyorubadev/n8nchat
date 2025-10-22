// Premium Intercom-Style Chat Widget for n8n - Updated Version
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Updated Premium Intercom-inspired styles
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #0F6FFF);
            --chat-color-primary-hover: #0D5FE5;
            --chat-color-primary-light: #E8F1FF;
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #0D1C2E);
            --chat-color-text-secondary: #586069;
            --chat-color-text-tertiary: #8B95A5;
            --chat-color-border: #E8EAED;
            --chat-color-hover: #F5F7FA;
            --chat-shadow-sm: 0 1px 2px rgba(13, 28, 46, 0.04);
            --chat-shadow-md: 0 4px 12px rgba(13, 28, 46, 0.08);
            --chat-shadow-lg: 0 12px 40px rgba(13, 28, 46, 0.12);
            --chat-shadow-button: 0 2px 8px rgba(15, 111, 255, 0.24);
            --chat-radius-sm: 6px;
            --chat-radius-md: 10px;
            --chat-radius-lg: 16px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 100px;
            z-index: 10000;
            width: 400px;
            height: 680px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.96);
        }

        .chat-assist-widget .chat-window.right-side {
            right: 20px;
        }

        .chat-assist-widget .chat-window.left-side {
            left: 20px;
        }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .chat-assist-widget .chat-header {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chat-color-surface);
            color: var(--chat-color-text);
            border-bottom: 1px solid var(--chat-color-border);
            position: relative;
            min-height: 60px;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-header-logo {
            width: 36px;
            height: 36px;
            border-radius: var(--chat-radius-md);
            object-fit: cover;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-header-content {
            flex: 1;
            min-width: 0;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--chat-color-text);
            line-height: 1.4;
            margin-bottom: 2px;
        }

        .chat-assist-widget .chat-header-status {
            font-size: 13px;
            color: var(--chat-color-text-tertiary);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chat-assist-widget .chat-status-dot {
            width: 8px;
            height: 8px;
            background: #10B981;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .chat-assist-widget .chat-close-btn {
            background: transparent;
            border: none;
            color: var(--chat-color-text-tertiary);
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            font-size: 20px;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: var(--chat-color-hover);
            color: var(--chat-color-text);
        }

        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 32px;
            text-align: center;
            width: 100%;
            max-width: 340px;
        }

        .chat-assist-widget .chat-welcome-emoji {
            font-size: 48px;
            margin-bottom: 20px;
            line-height: 1;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 12px;
            line-height: 1.3;
            letter-spacing: -0.02em;
        }

        .chat-assist-widget .chat-welcome-subtitle {
            font-size: 15px;
            color: var(--chat-color-text-secondary);
            line-height: 1.5;
            margin-bottom: 28px;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: calc(100% - 32px);
            margin: 0 auto;
            padding: 14px 24px;
            background: var(--chat-color-primary);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: var(--chat-shadow-button);
        }

        .chat-assist-widget .chat-start-btn:hover {
            background: var(--chat-color-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(15, 111, 255, 0.3);
        }

        .chat-assist-widget .chat-start-btn:active {
            transform: translateY(0);
        }

        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
            position: relative;
            flex: 1;
            min-height: 0;
        }

        .chat-assist-widget .chat-body.active {
            display: flex;
        }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            background: var(--chat-color-surface);
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 0;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: #D1D5DB;
            border-radius: var(--chat-radius-full);
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb:hover {
            background-color: #9CA3AF;
        }

        .chat-assist-widget .message-row {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            flex-shrink: 0;
        }

        .chat-assist-widget .bot-avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-md);
            object-fit: cover;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: var(--chat-radius-md);
            max-width: 75%;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.5;
            position: relative;
            white-space: pre-line;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: var(--chat-color-primary);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            margin-left: auto;
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: var(--chat-color-hover);
            color: var(--chat-color-text);
            border-bottom-left-radius: 4px;
        }

        .chat-assist-widget .bot-image {
            max-width: 100%;
            max-height: 200px;
            border-radius: var(--chat-radius-sm);
            margin: 8px 0;
            display: block;
            object-fit: cover;
        }

        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            background: var(--chat-color-hover);
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            max-width: 70px;
            flex-shrink: 0;
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-text-tertiary);
            border-radius: 50%;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.7;
            }
            30% {
                transform: translateY(-6px);
                opacity: 1;
            }
        }

        .chat-assist-widget .chat-controls {
            padding: 16px 20px 20px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-border);
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
        }

        .chat-assist-widget .upload-btn {
            background: transparent;
            border: none;
            color: var(--chat-color-text-tertiary);
            cursor: pointer;
            padding: 8px;
            border-radius: var(--chat-radius-sm);
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .chat-assist-widget .upload-btn:hover {
            background: var(--chat-color-hover);
            color: var(--chat-color-primary);
        }

        .chat-assist-widget .chat-input-container {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            background: var(--chat-color-surface);
            border: 1px solid var(--chat-color-border);
            border-radius: 24px;
            transition: var(--chat-transition);
            padding: 0 16px;
            min-height: 48px;
            max-height: 48px;
            max-width: 100%;
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
            max-height: 80px;
            min-height: 24px;
            height: 24px;
            padding: 0;
            outline: none;
            overflow-y: auto;
        }

        .chat-assist-widget .chat-textarea::-webkit-scrollbar {
            width: 4px;
        }

        .chat-assist-widget .chat-textarea::-webkit-scrollbar-thumb {
            background-color: #D1D5DB;
            border-radius: 2px;
        }

        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--chat-color-text-tertiary);
        }

        .chat-assist-widget .chat-submit {
            background: var(--chat-color-primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 42px;
            height: 42px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(15, 111, 255, 0.3);
        }

        .chat-assist-widget .chat-submit:hover {
            background: var(--chat-color-primary-hover);
            transform: scale(1.05);
            box-shadow: 0 3px 8px rgba(15, 111, 255, 0.4);
        }

        .chat-assist-widget .chat-submit:active {
            transform: scale(0.98);
        }

        .chat-assist-widget .chat-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .chat-assist-widget .chat-submit svg {
            width: 20px;
            height: 20px;
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--chat-color-primary);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(15, 111, 255, 0.3);
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            gap: 0;
            overflow: hidden;
            white-space: nowrap;
            animation: chatPulse 3s infinite;
        }

        .chat-assist-widget .chat-launcher.right-side {
            right: 16px;
        }

        .chat-assist-widget .chat-launcher.left-side {
            left: 16px;
        }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 24px rgba(15, 111, 255, 0.4);
            animation: none;
        }

        .chat-assist-widget .chat-launcher:active {
            transform: scale(1.02);
        }

        .chat-assist-widget .chat-launcher.expanded {
            width: auto;
            padding: 0 20px;
            border-radius: 30px;
            animation: none;
        }

        .chat-assist-widget .chat-launcher-icon {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-launcher svg {
            width: 28px;
            height: 28px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-assist-widget .chat-launcher:hover svg {
            transform: scale(1.1);
        }
        
        .chat-assist-widget .chat-launcher-text {
            font-weight: 600;
            font-size: 15px;
            white-space: nowrap;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-assist-widget .chat-launcher.expanded .chat-launcher-text {
            opacity: 1;
            max-width: 150px;
            margin-left: 10px;
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

        .chat-assist-widget .chat-footer {
            padding: 12px 20px;
            text-align: center;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-border);
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-footer-link {
            color: var(--chat-color-text-tertiary);
            text-decoration: none;
            font-size: 12px;
            transition: var(--chat-transition);
            font-family: inherit;
        }

        .chat-assist-widget .chat-footer-link:hover {
            color: var(--chat-color-primary);
        }

        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 0;
            align-self: flex-start;
            max-width: 85%;
            flex-shrink: 0;
        }

        .chat-assist-widget .suggested-question-btn {
            background: white;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            padding: 12px 16px;
            text-align: left;
            font-size: 14px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
            line-height: 1.4;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-hover);
            border-color: var(--chat-color-primary);
            transform: translateX(2px);
        }

        .chat-assist-widget .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .chat-assist-widget .quick-reply-btn {
            background: white;
            border: 1px solid var(--chat-color-border);
            border-radius: 16px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
        }

        .chat-assist-widget .quick-reply-btn:hover {
            background: var(--chat-color-primary);
            color: white;
            border-color: var(--chat-color-primary);
            transform: translateY(-1px);
        }

        /* Attachment Preview Styles */
        .chat-assist-widget .attachment-preview {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            margin-bottom: 12px;
        }

        .chat-assist-widget .attachment-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: var(--chat-color-primary-light);
            border-radius: var(--chat-radius-md);
            border: 1px solid var(--chat-color-border);
            max-width: 75%;
            align-self: flex-end;
        }

        .chat-assist-widget .attachment-image {
            max-width: 120px;
            max-height: 120px;
            border-radius: var(--chat-radius-sm);
            object-fit: cover;
        }

        .chat-assist-widget .attachment-info {
            flex: 1;
            min-width: 0;
        }

        .chat-assist-widget .attachment-name {
            font-weight: 500;
            font-size: 14px;
            color: var(--chat-color-text);
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .chat-assist-widget .attachment-size {
            font-size: 12px;
            color: var(--chat-color-text-tertiary);
        }

        .chat-assist-widget .remove-attachment {
            background: transparent;
            border: none;
            color: var(--chat-color-text-tertiary);
            cursor: pointer;
            padding: 4px;
            border-radius: var(--chat-radius-sm);
            transition: var(--chat-transition);
        }

        .chat-assist-widget .remove-attachment:hover {
            background: var(--chat-color-hover);
            color: #EF4444;
        }

        .chat-assist-widget .chat-link {
            color: var(--chat-color-primary);
            text-decoration: none;
            word-break: break-all;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-link:hover {
            text-decoration: underline;
        }

        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 32px;
            text-align: center;
            width: 100%;
            max-width: 340px;
            display: none;
        }

        .chat-assist-widget .user-registration.active {
            display: block;
        }

        .chat-assist-widget .registration-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--chat-color-text);
            margin-bottom: 8px;
            line-height: 1.3;
            letter-spacing: -0.01em;
        }

        .chat-assist-widget .registration-subtitle {
            font-size: 14px;
            color: var(--chat-color-text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
        }

        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
            text-align: left;
        }

        .chat-assist-widget .form-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--chat-color-text);
            letter-spacing: -0.01em;
        }

        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 15px;
            transition: var(--chat-transition);
            background: var(--chat-color-surface);
            color: var(--chat-color-text);
        }

        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(15, 111, 255, 0.1);
        }

        .chat-assist-widget .form-input::placeholder {
            color: var(--chat-color-text-tertiary);
        }

        .chat-assist-widget .form-input.error {
            border-color: #EF4444;
        }

        .chat-assist-widget .form-input.error:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #EF4444;
            margin-top: -4px;
        }

        .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 14px 24px;
            background: var(--chat-color-primary);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: var(--chat-shadow-button);
        }

        .chat-assist-widget .submit-registration:hover {
            background: var(--chat-color-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(15, 111, 255, 0.3);
        }

        .chat-assist-widget .submit-registration:active {
            transform: translateY(0);
        }

        .chat-assist-widget .submit-registration:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        /* Smooth entrance animation */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-assist-widget .chat-bubble,
        .chat-assist-widget .suggested-questions,
        .chat-assist-widget .message-row {
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Notification badge */
        .chat-assist-widget .notification-badge {
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

        @keyframes bounceIn {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
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
    `;
    document.head.appendChild(widgetStyles);

    // Configuration
    const defaultSettings = {
        webhook: {
            url: '',
            route: ''
        },
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
            chatHistory: true,
            smartSuggestions: true
        },
        suggestedQuestions: [],
        autoResponses: {
            greeting: "Hi there! 👋 I'm here to help. What can I assist you with today?",
            offline: "Sorry, I'm currently offline. Please leave a message and I'll get back to you soon!",
            default: "Thanks for your message! I'll help you with that."
        }
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { 
                ...defaultSettings.style, 
                ...window.ChatWidgetConfig.style
            },
            features: { ...defaultSettings.features, ...window.ChatWidgetConfig.features },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions,
            autoResponses: { ...defaultSettings.autoResponses, ...window.ChatWidgetConfig.autoResponses }
        } : defaultSettings;

    // State management
    let conversationId = '';
    let isWaitingForResponse = false;
    let unreadMessages = 0;
    let chatHistory = [];
    let fileInput = null;
    let currentAttachments = [];
    let isLauncherExpanded = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    // Updated HTML structure
    const enhancedHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <div class="chat-header-content">
                <div class="chat-header-title">${settings.branding.name}</div>
                <div class="chat-header-status">
                    <span class="chat-status-dot"></span>
                    Online • Replying instantly
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
    
    // Create toggle button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <div class="chat-launcher-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
        </div>
        <span class="chat-launcher-text">Need help?</span>
        ${unreadMessages > 0 ? `<div class="notification-badge">${unreadMessages}</div>` : ''}
    `;
    
    // Add elements to DOM
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Get DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    // Registration form elements
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    // File upload elements
    if (settings.features.fileUpload) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif';
        fileInput.multiple = true;
        widgetRoot.appendChild(fileInput);
    }

    // Helper functions
    function createSessionId() {
        return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function linkifyText(text) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
        });
    }

    function isImageFile(file) {
        return file.type.startsWith('image/');
    }

    function isImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
    }

    // Enhanced bot message creation with image support
    function createBotMessage(messageText) {
        const messageRow = document.createElement('div');
        messageRow.className = 'message-row';
        
        const avatar = document.createElement('img');
        avatar.className = 'bot-avatar';
        avatar.src = settings.branding.logo;
        avatar.alt = settings.branding.name;
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot-bubble';
        
        // Process message text to extract and display images
        const imageUrls = extractImageUrls(messageText);
        let processedText = messageText;
        
        // Display images first
        if (imageUrls.length > 0) {
            imageUrls.forEach(imageUrl => {
                const img = document.createElement('img');
                img.className = 'bot-image';
                img.src = imageUrl;
                img.alt = 'Product image';
                img.loading = 'lazy';
                bubble.appendChild(img);
                
                // Remove the image URL from the text
                processedText = processedText.replace(imageUrl, '').trim();
            });
            
            // Add line break after images if there's text
            if (processedText.trim()) {
                const lineBreak = document.createElement('div');
                lineBreak.style.height = '8px';
                bubble.appendChild(lineBreak);
            }
        }
        
        // Add the remaining text with proper formatting
        if (processedText.trim()) {
            const textElement = document.createElement('div');
            textElement.innerHTML = linkifyText(processedText);
            bubble.appendChild(textElement);
        }
        
        messageRow.appendChild(avatar);
        messageRow.appendChild(bubble);
        
        return messageRow;
    }

    function extractImageUrls(text) {
        const urlPattern = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg)(?:\?[^\s]*)?)/gi;
        const urls = text.match(urlPattern) || [];
        return urls.filter(url => isImageUrl(url));
    }

    // Message creation functions
    function createTypingIndicator() {
        const messageRow = document.createElement('div');
        messageRow.className = 'message-row';
        
        const avatar = document.createElement('img');
        avatar.className = 'bot-avatar';
        avatar.src = settings.branding.logo;
        avatar.alt = settings.branding.name;
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messageRow.appendChild(avatar);
        messageRow.appendChild(indicator);
        
        return messageRow;
    }

    function createUserMessage(messageText) {
        const messageRow = document.createElement('div');
        messageRow.className = 'message-row';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble user-bubble';
        bubble.textContent = messageText;
        
        messageRow.appendChild(bubble);
        
        return messageRow;
    }

    // Create attachment message for the chat
    function createAttachmentMessage(file) {
        const messageRow = document.createElement('div');
        messageRow.className = 'message-row';
        
        if (isImageFile(file)) {
            const imageBubble = document.createElement('div');
            imageBubble.className = 'chat-bubble user-bubble';
            imageBubble.style.padding = '8px';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '8px';
            img.style.display = 'block';
            
            imageBubble.appendChild(img);
            messageRow.appendChild(imageBubble);
        } else {
            const fileBubble = document.createElement('div');
            fileBubble.className = 'chat-bubble user-bubble';
            fileBubble.style.display = 'flex';
            fileBubble.style.alignItems = 'center';
            fileBubble.style.gap = '8px';
            fileBubble.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span>${file.name} (${formatFileSize(file.size)})</span>
            `;
            
            messageRow.appendChild(fileBubble);
        }
        
        return messageRow;
    }

    // Attachment handling functions
    function createAttachmentPreview(file) {
        const attachmentItem = document.createElement('div');
        attachmentItem.className = 'attachment-item';
        
        if (isImageFile(file)) {
            const img = document.createElement('img');
            img.className = 'attachment-image';
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            attachmentItem.appendChild(img);
        }
        
        const attachmentInfo = document.createElement('div');
        attachmentInfo.className = 'attachment-info';
        attachmentInfo.innerHTML = `
            <div class="attachment-name">${file.name}</div>
            <div class="attachment-size">${formatFileSize(file.size)}</div>
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-attachment';
        removeBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        `;
        removeBtn.addEventListener('click', () => {
            removeAttachment(file);
        });
        
        attachmentItem.appendChild(attachmentInfo);
        attachmentItem.appendChild(removeBtn);
        
        return attachmentItem;
    }

    function showAttachmentPreviews() {
        // Remove existing preview container
        const existingPreview = messagesContainer.querySelector('.attachment-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        if (currentAttachments.length === 0) return;
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'attachment-preview';
        
        currentAttachments.forEach(file => {
            const preview = createAttachmentPreview(file);
            previewContainer.appendChild(preview);
        });
        
        messagesContainer.appendChild(previewContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeAttachment(fileToRemove) {
        currentAttachments = currentAttachments.filter(file => file !== fileToRemove);
        showAttachmentPreviews();
    }

    function clearAttachmentPreviews() {
        // Clear only the preview thumbnails, not the currentAttachments array
        const previewContainer = messagesContainer.querySelector('.attachment-preview');
        if (previewContainer) {
            previewContainer.remove();
        }
    }

    // Enhanced message submission with attachments
    async function submitMessage(messageText) {
        if (isWaitingForResponse || (!messageText.trim() && currentAttachments.length === 0)) return;
        
        isWaitingForResponse = true;
        sendButton.disabled = true;
        
        // Clear attachment preview thumbnails immediately when send is clicked
        clearAttachmentPreviews();
        
        // Display user message if there's text
        if (messageText.trim()) {
            const userMessage = createUserMessage(messageText);
            messagesContainer.appendChild(userMessage);
        }
        
        // Display attachments as actual chat messages
        if (currentAttachments.length > 0) {
            currentAttachments.forEach(file => {
                const attachmentMessage = createAttachmentMessage(file);
                messagesContainer.appendChild(attachmentMessage);
            });
        }
        
        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to chat history
        if (settings.features.chatHistory) {
            if (messageText.trim()) {
                chatHistory.push({
                    type: 'user',
                    content: messageText,
                    timestamp: new Date().toISOString()
                });
            }
            if (currentAttachments.length > 0) {
                chatHistory.push({
                    type: 'user',
                    content: `Sent ${currentAttachments.length} attachment(s)`,
                    attachments: currentAttachments.map(f => f.name),
                    timestamp: new Date().toISOString()
                });
            }
        }

        try {
            const formData = new FormData();
            
            // Add message data
            formData.append('action', 'sendMessage');
            formData.append('sessionId', conversationId);
            formData.append('route', settings.webhook.route);
            formData.append('chatInput', messageText);
            formData.append('metadata', JSON.stringify({
                userId: emailInput ? emailInput.value.trim() : "",
                userName: nameInput ? nameInput.value.trim() : ""
            }));
            
            // Add attachments
            currentAttachments.forEach((file, index) => {
                formData.append(`attachments`, file);
            });

            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                body: formData
            });
            
            const responseData = await response.json();
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Display bot response with image support
            const responseText = Array.isArray(responseData)
                ? responseData[0].output
                : responseData.output;
            
            const botMessage = createBotMessage(responseText);
            messagesContainer.appendChild(botMessage);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Save bot response to history
            if (settings.features.chatHistory) {
                chatHistory.push({
                    type: 'bot',
                    content: responseText,
                    timestamp: new Date().toISOString()
                });
                saveChatHistory();
            }

        } catch (error) {
            console.error('Message submission error:', error);
            
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                indicator.parentElement.remove();
            }
            
            const errorMessage = createBotMessage("Sorry, I couldn't send your message. Please try again.");
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
            sendButton.disabled = false;
            // Clear attachments after sending
            currentAttachments = [];
        }
    }

    // File upload handling
    function handleFileUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Ensure launcher remains expanded when attaching files
        if (!isLauncherExpanded) {
            launchButton.classList.add('expanded');
            chatWindow.classList.add('visible');
            isLauncherExpanded = true;
        }

        // Add files to current attachments
        currentAttachments.push(...files);
        
        // Show attachment previews
        showAttachmentPreviews();
        
        // Reset file input
        event.target.value = '';
        
        // Focus on textarea for adding message
        messageTextarea.focus();
    }

    // Chat history management
    function saveChatHistory() {
        if (settings.features.chatHistory) {
            const history = {
                conversationId,
                messages: chatHistory,
                userInfo: {
                    name: nameInput ? nameInput.value.trim() : '',
                    email: emailInput ? emailInput.value.trim() : ''
                },
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(`chatHistory_${conversationId}`, JSON.stringify(history));
        }
    }

    // Registration handler
    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleRegistration(event) {
        event.preventDefault();
        
        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        
        // Get values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        // Validate
        let isValid = true;
        
        if (!name) {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!email) {
            emailError.textContent = 'Please enter your email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Initialize conversation
        conversationId = createSessionId();
        
        // Hide registration form, show chat interface
        userRegistration.classList.remove('active');
        chatBody.classList.add('active');
        
        // Show welcome message
        const welcomeMessage = createBotMessage(`Hello ${name}! ${settings.autoResponses.greeting}`);
        messagesContainer.appendChild(welcomeMessage);
        
        // Add suggested questions if configured
        if (settings.suggestedQuestions && settings.suggestedQuestions.length > 0) {
            const suggestedQuestionsContainer = document.createElement('div');
            suggestedQuestionsContainer.className = 'suggested-questions';
            
            settings.suggestedQuestions.forEach(question => {
                const questionButton = document.createElement('button');
                questionButton.className = 'suggested-question-btn';
                questionButton.textContent = question;
                questionButton.addEventListener('click', () => {
                    submitMessage(question);
                    suggestedQuestionsContainer.remove();
                });
                suggestedQuestionsContainer.appendChild(questionButton);
            });
            
            messagesContainer.appendChild(suggestedQuestionsContainer);
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        messageTextarea.focus();
        
        // Save to chat history
        if (settings.features.chatHistory) {
            chatHistory.push({
                type: 'system',
                content: `User registered: ${name} (${email})`,
                timestamp: new Date().toISOString()
            });
            saveChatHistory();
        }
    }

    // Auto-resize textarea
    function autoResizeTextarea() {
        messageTextarea.style.height = '24px';
        const newHeight = messageTextarea.scrollHeight;
        if (newHeight > 24) {
            messageTextarea.style.height = (newHeight > 80 ? 80 : newHeight) + 'px';
        }
    }

    // Event listeners
    startChatButton.addEventListener('click', showRegistrationForm);
    registrationForm.addEventListener('submit', handleRegistration);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        submitMessage(messageText);
        messageTextarea.value = '';
        messageTextarea.style.height = '24px';
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = '24px';
        }
    });
    
    // File upload event listener - prevent chat close and ensure launcher stays expanded
    if (settings.features.fileUpload && fileInput) {
        const uploadBtn = chatWindow.querySelector('.upload-btn');
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent chat close
            // Ensure launcher is expanded
            if (!isLauncherExpanded) {
                launchButton.classList.add('expanded');
                chatWindow.classList.add('visible');
                isLauncherExpanded = true;
            }
            fileInput.click();
        });
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Enhanced launcher behavior
    launchButton.addEventListener('click', () => {
        const isExpanded = launchButton.classList.contains('expanded');
        if (!isExpanded) {
            // Expand launcher first
            launchButton.classList.add('expanded');
            isLauncherExpanded = true;
            setTimeout(() => {
                chatWindow.classList.add('visible');
                // Reset notification badge when chat is opened
                unreadMessages = 0;
                const badge = launchButton.querySelector('.notification-badge');
                if (badge) badge.remove();
            }, 200);
        } else {
            // Close chat
            chatWindow.classList.remove('visible');
            isLauncherExpanded = false;
            setTimeout(() => {
                launchButton.classList.remove('expanded');
            }, 300);
        }
    });

    // Close button functionality
    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
            launchButton.classList.remove('expanded');
            isLauncherExpanded = false;
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !launchButton.contains(e.target) && chatWindow.classList.contains('visible')) {
            chatWindow.classList.remove('visible');
            launchButton.classList.remove('expanded');
            isLauncherExpanded = false;
        }
    });

    // Prevent closing when clicking inside chat
    chatWindow.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    console.log('Updated Premium Intercom-Style Chat Widget initialized successfully!');
})();
