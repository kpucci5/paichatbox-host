(function() {
    window.initPersonalAIChatbot = function(config) {
        config = {
            apiKey: config.apiKey,
            domainName: config.domainName,
            initialMessage: config.initialMessage,
            aiAvatarUrl: config.aiAvatarUrl,
            userAvatarUrl: config.userAvatarUrl,
            chatbotName: config.chatbotName,
            sendButtonColor: config.sendButtonColor || '#6656FF',
            messageIconColor: config.messageIconColor || '#6656FF',
            startChatButtonColor: config.startChatButtonColor || '#6656FF',
            userMessageColor: config.userMessageColor || '#6656FF',
            initiatorPosition: config.initiatorPosition || 'bottom-right',
            initialQuestion: config.initialQuestion,
            requireIntake: config.requireIntake !== undefined ? config.requireIntake : true,
            defaultUserEmail: config.defaultUserEmail || 'anonymous@user.com',
            intakeFormTitle: config.intakeFormTitle || 'Before we start chatting',
            intakeFormSubtitle: config.intakeFormSubtitle || 'Please fill out your information to continue'
        };

        let positionCSS;
        switch (config.initiatorPosition) {
            case 'top-left':
                positionCSS = 'top: 20px; left: 20px;';
                break;
            case 'top-right':
                positionCSS = 'top: 20px; right: 20px;';
                break;
            case 'bottom-left':
                positionCSS = 'bottom: 20px; left: 20px;';
                break;
            case 'bottom-right':
            default:
                positionCSS = 'bottom: 20px; right: 20px;';
                break;
        }
        
        // Add the additional styles for the message icon and intake form
        const additionalStyles = `
            .pai-chat-message-icon.expanded {
                position: fixed !important;
                z-index: 9999 !important;
                cursor: pointer !important;
                ${positionCSS}
                width: 24px !important;
                height: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transform: scale(2.5) !important;
            }
            
            .pai-intake-form {
                position: relative;
                background: rgba(255, 255, 255, 0.95);
                padding: 35px 25px;
                border-radius: 15px;
                width: 85%;
                max-width: 320px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                backdrop-filter: blur(10px);
            }

            .pai-intake-form h3 {
                font-size: 15px;
                margin: 0 0 6px 0;
                color: #2B263E;
            }
            
            .pai-intake-form p {
                font-size: 13px;
                margin: 0 0 12px 0;
                color: #666;
            }

            .pai-intake-input {
                width: 100%;
                padding: 8px 12px;
                margin: 8px 0;
                border: 1px solid #EFF0F6;
                border-radius: 8px;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
            }

            .pai-intake-label {
                display: block;
                text-align: left;
                font-size: 12px;
                color: #666;
                margin-top: 8px;
                margin-bottom: 2px;
            }

            .pai-intake-submit {
                background-color: ${config.startChatButtonColor || config.sendButtonColor};
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 20px;
                cursor: pointer;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                transition: opacity 0.3s;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                width: 100%;
                margin-top: 16px;
            }
            
            .pai-intake-submit:hover {
                opacity: 0.9;
            }

            .pai-intake-error {
                color: #FF4444;
                font-size: 12px;
                text-align: left;
                margin-top: 2px;
                display: none;
            }
            
            @media (max-width: 480px) {
                .pai-chat-message-icon.expanded {
                    bottom: 20px !important;
                    right: 20px !important;
                    left: auto !important;
                    top: auto !important;
                }

                .pai-intake-form {
                    width: 90%;
                    padding: 20px 15px;
                }
                
                .pai-intake-form h3 {
                    font-size: 14px;
                }
                
                .pai-intake-form p {
                    font-size: 12px;
                }
                
                .pai-intake-input {
                    padding: 8px;
                    font-size: 13px;
                }
                
                .pai-intake-submit {
                    padding: 10px 20px;
                    font-size: 13px;
                }
                
                .pai-intake-error {
                    font-size: 11px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);

        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css?family=Inter');

            #personal-ai-chat-widget {
                font-family: "Inter", sans-serif !important;
            }

            .pai-chat-initiator {
                position: fixed;
                display: flex;
                align-items: flex-start;
                z-index: 1000;
                cursor: pointer;
                transition: opacity 0.3s ease;
                ${positionCSS}
            }

            .pai-chat-avatar-wrapper {
                margin-right: 10px;
            }

            .pai-chat-avatar-wrapper,
            .pai-chat-bubble {
                transition: opacity 0.3s ease;
            }

            .pai-chat-avatar {
                width: 60px;
                height: 60px;
                border-radius: 20px 0px 20px 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .pai-chat-bubble-wrapper {
                position: relative;
                cursor: pointer;
            }

            .pai-chat-bubble {
                background-color: #fff;
                border: 1px solid #EFF0F6;
                border-radius: 0 20px 20px 20px;
                padding: 10px 15px 15px 15px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.075);
                max-width: 300px;
                cursor: pointer;
            }

            .pai-chat-text {
                font-size: 14px;
                line-height: 1.4;
                min-height: 50px;
                display: flex;
                align-items: center;
            }

            .pai-chat-message-icon {
                position: absolute;
                bottom: -5px;
                right: -5px;
                width: 24px;
                height: 24px;
                opacity: 0;
                transition: all 0.5s ease-in-out;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
            }

            .pai-chat-message-icon.fade-in {
                opacity: 1;
            }

            .pai-chat-message-icon svg {
                fill: ${config.messageIconColor};
            }

            .pai-chat-initiator-close {
                position: absolute;
                right: -8px;
                top: -12px;
                background: none;
                border: none;
                font-size: 25px;
                cursor: pointer;
                color: #2B263E;
                z-index: 1003;
                line-height: 1;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }

            .pai-chat-initiator-close.fade-in {
                opacity: 1;
            }

            .pai-chat-window {
                display: none;
                position: fixed;
                ${positionCSS}
                width: 380px;
                height: 600px;
                background-color: white;
                border-radius: 20px;
                box-shadow: 0 5px 40px rgba(0,0,0,0.16);
                flex-direction: column;
                z-index: 1002;
                overflow: hidden;
                transition: all 0.3s ease-in-out;
                max-height: calc(100vh - 100px);
            }

            .pai-chat-window.fullscreen {
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 80% !important;
                height: 80vh !important;
                max-width: 1200px;
            }

            .pai-email-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(3px);
                z-index: 1003;
                display: none;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
            }

            .pai-chat-header {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px 10px;
                border-bottom: 1px solid #EFF0F6;
                position: relative;
            }

            .pai-chat-header-content {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .pai-chat-avatar-header {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-bottom: 10px;
            }

            .pai-chat-title {
                font-size: 16px;
                font-weight: bold;
                color: #2B263E;
            }

            .pai-chat-close {
                position: absolute;
                right: 10px;
                top: 10px;
                background: none;
                border: none;
                font-size: 30px;
                cursor: pointer;
                color: #2B263E;
            }

            .pai-fullscreen-toggle {
                position: absolute;
                right: 45px;
                top: 10px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                color: #2B263E;
                opacity: 0.7;
                transition: opacity 0.3s;
                line-height: 0;
                display: flex;
                align-items: center;
            }

            .pai-fullscreen-toggle:hover {
                opacity: 1;
            }

            .pai-fullscreen-toggle svg {
                width: 20px;
                height: 20px;
            }

            .pai-chat-messages {
                flex: 1 1 auto;
                overflow-y: auto;
                padding: 10px;
                background-color: #F8F9FD;
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
                height: calc(100% - 180px);
                min-height: 200px;
                display: flex;
                flex-direction: column;
            }

            .pai-chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .pai-chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .pai-chat-messages::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .pai-chat-message {
                display: flex;
                align-items: flex-start;
                margin-bottom: 15px;
                max-width: 80%;
                flex-shrink: 0;
            }

            .pai-chat-message.ai {
                align-self: flex-start;
                margin-right: 10%;
            }

            .pai-chat-message.user {
                align-self: flex-end;
                margin-left: 35%;
                position: relative;
                padding-right: 30px;
            }

            .pai-chat-message-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px 0px 10px 10px;
                margin: 0 8px;
            }

            .pai-chat-message-content {
                background-color: #fff;
                border-radius: 15px;
                padding: 8px 12px;
                max-width: calc(100% - 46px);
                position: relative;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            .pai-chat-message.ai .pai-chat-message-content {
                border-top-left-radius: 0;
            }

.pai-chat-message.user .pai-chat-message-content {
                border-radius: 0px 20px 20px 20px;
                background-color: ${config.sendButtonColor};
                color: white;
            }

            .pai-chat-message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }

            .pai-chat-message-name {
                font-size: 12px;
                font-weight: bold;
                color: #666;
            }

            .pai-chat-message.user .pai-chat-message-name,
            .pai-chat-message.user .pai-chat-message-time {
                color: rgba(255,255,255,0.8);
            }

            .pai-chat-message-time {
                font-size: 10px;
                margin-left: 5px;
                color: #888;
            }

            .pai-chat-message-text {
                font-size: 14px;
                line-height: 1.4;
            }

            .pai-chat-message-text p {
                margin-bottom: 10px;
            }

            .pai-chat-message-text p:last-child {
                margin-bottom: 0;
            }

            .pai-chat-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                padding: 15px;
                min-height: 60px;
                background: #fff;
                border-top: 1px solid #EFF0F6;
                margin-top: auto;
            }

            .pai-chat-input {
                width: 100%;
                border: none;
                background: transparent;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                line-height: 1.4;
                color: #000000;
                outline: none;
                resize: none;
                overflow: hidden;
                padding: 8px 40px 8px 8px;
                min-height: 40px;
                border: 1px solid #EFF0F6;
                border-radius: 20px;
            }

            .pai-chat-input:disabled,
            .pai-chat-send-inline:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .pai-chat-send-inline {
                position: absolute;
                right: 25px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pai-chat-send-inline svg {
                width: 20px;
                height: 20px;
                fill: ${config.sendButtonColor};
            }

            .pai-chat-input::placeholder {
                color: #CCCCCC;
                opacity: 1;
            }

            .pai-chat-typing-indicator {
                display: inline-flex;
                align-items: center;
            }

            .pai-chat-typing-indicator span {
                height: 8px;
                width: 8px;
                background-color: ${config.sendButtonColor};
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
                animation: typing .5s infinite ease-in-out;
            }

            .pai-chat-typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .pai-chat-typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0px); }
            }

            @media (max-width: 480px) {
                /* ... (previous mobile styles remain the same) ... */
            }
        `;
        document.head.appendChild(style);

        const chatWidgetHtml = `
            <div id="personal-ai-chat-widget" class="pai-chat-closed">
                <div class="pai-chat-initiator">
                    <div class="pai-chat-avatar-wrapper">
                        <img src="${config.aiAvatarUrl}" alt="AI Avatar" class="pai-chat-avatar">
                    </div>
                    <div class="pai-chat-bubble-wrapper">
                        <div class="pai-chat-bubble">
                            <span class="pai-chat-text" id="ai-initial-message"></span>
                        </div>
                        <div class="pai-chat-message-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </div>
                        <button class="pai-chat-initiator-close">&times;</button>
                    </div>
                </div>
                <div class="pai-chat-window">
                    <div class="pai-email-overlay" style="${!config.requireIntake ? 'display: none !important;' : ''}">
                        <div class="pai-intake-form">
                            <button class="pai-chat-close">&times;</button>
                            <h3>${config.intakeFormTitle}</h3>
                            <p>${config.intakeFormSubtitle}</p>
                            <div>
                                <label class="pai-intake-label" for="firstName">First Name*</label>
                                <input type="text" id="firstName" class="pai-intake-input" placeholder="Enter your first name">
                                <div class="pai-intake-error" id="firstName-error">Please enter your first name</div>
                            </div>
                            <div>
                                <label class="pai-intake-label" for="lastName">Last Name*</label>
                                <input type="text" id="lastName" class="pai-intake-input" placeholder="Enter your last name">
                                <div class="pai-intake-error" id="lastName-error">Please enter your last name</div>
                            </div>
                            <div>
                                <label class="pai-intake-label" for="email">Email Address*</label>
                                <input type="email" id="email" class="pai-intake-input" placeholder="Enter your email address">
                                <div class="pai-intake-error" id="email-error">Please enter a valid email address</div>
                            </div>
                            <div>
                                <label class="pai-intake-label" for="phone">Phone Number*</label>
                                <input type="tel" id="phone" class="pai-intake-input" placeholder="Enter your phone number">
                                <div class="pai-intake-error" id="phone-error">Please enter a valid phone number</div>
                            </div>
                            <button class="pai-intake-submit">Start Chat</button>
                        </div>
                    </div>
                    <div class="pai-chat-header">
                        <div class="pai-chat-header-content">
                            <img src="${config.aiAvatarUrl}" alt="AI Avatar" class="pai-chat-avatar-header">
                            <span class="pai-chat-title">Chat with ${config.chatbotName}</span>
                        </div>
                        <button class="pai-fullscreen-toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                            </svg>
                        </button>
                        <button class="pai-chat-close">&times;</button>
                    </div>
                    <div class="pai-chat-messages"></div>
                    <div class="pai-chat-input-wrapper">
                        <textarea class="pai-chat-input" rows="1" placeholder="Type your message..." disabled></textarea>
                        <button class="pai-chat-send-inline" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatWidgetHtml);

        const chatWidget = document.getElementById('personal-ai-chat-widget');
        const chatInitiator = chatWidget.querySelector('.pai-chat-initiator');
        const chatWindow = chatWidget.querySelector('.pai-chat-window');
        const emailOverlay = chatWidget.querySelector('.pai-email-overlay');
        const intakeForm = chatWidget.querySelector('.pai-intake-form');
        const messageIcon = chatWidget.querySelector('.pai-chat-message-icon');
        const initiatorCloseButton = chatWidget.querySelector('.pai-chat-initiator-close');
        const mainChatClose = chatWindow.querySelector('.pai-chat-header .pai-chat-close');
        const emailFormClose = emailOverlay.querySelector('.pai-chat-close');
        const fullscreenToggle = chatWidget.querySelector('.pai-fullscreen-toggle');
        const chatMessages = chatWidget.querySelector('.pai-chat-messages');
        const chatInput = chatWidget.querySelector('.pai-chat-input');
        const sendButton = chatWidget.querySelector('.pai-chat-send-inline');
        const aiInitialMessage = document.getElementById('ai-initial-message');

        // Intake form elements
        const inputs = {
            firstName: intakeForm.querySelector('#firstName'),
            lastName: intakeForm.querySelector('#lastName'),
            email: intakeForm.querySelector('#email'),
            phone: intakeForm.querySelector('#phone')
        };
        const errors = {
            firstName: intakeForm.querySelector('#firstName-error'),
            lastName: intakeForm.querySelector('#lastName-error'),
            email: intakeForm.querySelector('#email-error'),
            phone: intakeForm.querySelector('#phone-error')
        };
        const submitButton = intakeForm.querySelector('.pai-intake-submit');

        let userEmail = null;
        let sessionId = localStorage.getItem('pai-chat-session');
        let initialMessageSent = false;
        let userData = null;

        // Check for existing session or set default if intake not required
        if (sessionId) {
            userEmail = sessionId;
            chatInput.disabled = false;
            sendButton.disabled = false;
            emailOverlay.style.display = 'none';
        } else if (!config.requireIntake) {
            userEmail = config.defaultUserEmail;
            sessionId = config.defaultUserEmail;
            localStorage.setItem('pai-chat-session', config.defaultUserEmail);
            chatInput.disabled = false;
            sendButton.disabled = false;
            emailOverlay.style.display = 'none';
        }

        function showMessageIcon() {
            chatInitiator.style.display = 'none';
            messageIcon.style.position = 'fixed';
            
            messageIcon.style.cssText = `
                display: flex !important;
                opacity: 1 !important;
                position: fixed !important;
                z-index: 9999 !important;
                ${positionCSS}
                transform: scale(2.5) !important;
                background: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                width: 24px !important;
                height: 24px !important;
            `;
        
            messageIcon.classList.add('expanded');
            document.body.appendChild(messageIcon);
        }

        function validateInput(input, errorElement, validationFn) {
            const value = input.value.trim();
            const isValid = validationFn(value);
            errorElement.style.display = isValid ? 'none' : 'block';
            return isValid;
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
            return /^\+?\d{10,}$/.test(phone.replace(/[\s()-]/g, ''));
        }

        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function typeMessage(targetElement, message, callback) {
            let index = 0;
            targetElement.textContent = '';
            function typeChar() {
                if (index < message.length) {
                    targetElement.textContent += message.charAt(index);
                    index++;
                    setTimeout(typeChar, 20);
                } else {
                    if (callback) callback();
                }
            }
            typeChar();
        }

        function typeInitialMessage() {
            typeMessage(aiInitialMessage, config.initialMessage, function() {
                messageIcon.classList.add('fade-in');
                initiatorCloseButton.classList.add('fade-in');
            });
        }

        function scrollToBottom() {
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }

        function addAIMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('pai-chat-message', 'ai');
            
            const time = getCurrentTime();
            
            messageElement.innerHTML = `
                <img src="${config.aiAvatarUrl}" alt="AI Avatar" class="pai-chat-message-avatar">
                <div class="pai-chat-message-content">
                    <div class="pai-chat-message-header">
                        <span class="pai-chat-message-name">${config.chatbotName}</span>
                        <span class="pai-chat-message-time">${time}</span>
                    </div>
                    <div class="pai-chat-message-text">${message}</div>
                </div>
            `;
            
            chatMessages.appendChild(messageElement);
            scrollToBottom();
        }

        function addUserMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('pai-chat-message', 'user');
            
            const time = getCurrentTime();
            
            messageElement.innerHTML = `
                <img src="${config.userAvatarUrl}" alt="User Avatar" class="pai-chat-message-avatar">
                <div class="pai-chat-message-content">
                    <div class="pai-chat-message-header">
                        <span class="pai-chat-message-name">You</span>
                        <span class="pai-chat-message-time">${time}</span>
                    </div>
                    <div class="pai-chat-message-text">${message}</div>
                </div>
            `;
            
            chatMessages.appendChild(messageElement);
            scrollToBottom();
        }

        function processMessage(message) {
            const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)([.,;!?]?)\s*/g;
message = message.replace(urlRegex, (fullMatch, url, punctuation) => {
                const fullUrl = url.startsWith('http') ? url : `http://${url}`;
                return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>${punctuation}`;
            });
        
            const paragraphs = message.split('\n\n');
            const formattedParagraphs = paragraphs.map(paragraph => {
                const lines = paragraph.split('\n');
                return lines.join('<br>');
            });
        
            return formattedParagraphs.map(p => `<p>${p}</p>`).join('');
        }

        async function handleMessage(message) {
            if (message.trim()) {
                addUserMessage(message);
                chatInput.value = '';
                chatInput.style.height = 'auto';
                
                const aiMessageElement = document.createElement('div');
                aiMessageElement.classList.add('pai-chat-message', 'ai');
                const time = getCurrentTime();
                
                aiMessageElement.innerHTML = `
                    <img src="${config.aiAvatarUrl}" alt="AI Avatar" class="pai-chat-message-avatar">
                    <div class="pai-chat-message-content">
                        <div class="pai-chat-message-header">
                            <span class="pai-chat-message-name">${config.chatbotName}</span>
                            <span class="pai-chat-message-time">${time}</span>
                        </div>
                        <div class="pai-chat-message-text">
                            <div class="pai-chat-typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                `;
                chatMessages.appendChild(aiMessageElement);
                scrollToBottom();
        
                try {
                    const response = await fetch('https://api.personal.ai/v1/message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': config.apiKey
                        },
                        body: JSON.stringify({
                            Text: message,
                            UserName: userEmail,
                            SourceName: "WebChat",
                            SessionId: userEmail,
                            DomainName: config.domainName,
                            is_draft: false
                        })
                    });
        
                    const data = await response.json();
                    
                    if (data.ai_message) {
                        aiMessageElement.querySelector('.pai-chat-message-text').innerHTML = processMessage(data.ai_message);
                    } else {
                        aiMessageElement.querySelector('.pai-chat-message-text').textContent = 
                            "Sorry, I couldn't generate a response at this time.";
                    }
        
                    scrollToBottom();
                } catch (error) {
                    console.error('API Error:', error);
                    aiMessageElement.querySelector('.pai-chat-message-text').textContent = 
                        "Sorry, there was an error processing your request.";
                }
            }
        }

        // Event Listeners
        chatInitiator.addEventListener('click', function() {
            this.style.display = 'none';
            chatWindow.style.display = 'flex';
            
            if (!userEmail && config.requireIntake) {
                emailOverlay.style.display = 'flex';
            } else {
                if (!initialMessageSent) {
                    addAIMessage(config.initialQuestion || `Hi, I'm ${config.chatbotName}, how can I help you?`);
                    initialMessageSent = true;
                }
            }
        });

        messageIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            if (this.classList.contains('expanded')) {
                this.style.opacity = '0';
                this.classList.remove('expanded');
                chatWindow.style.display = 'flex';
                
                if (!userEmail && config.requireIntake) {
                    emailOverlay.style.display = 'flex';
                } else if (!initialMessageSent) {
                    addAIMessage(config.initialQuestion || `Hi, I'm ${config.chatbotName}, how can I help you?`);
                    initialMessageSent = true;
                }
            }
        });

        mainChatClose.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            setTimeout(() => {
                showMessageIcon();
            }, 50);
        });
        
        emailFormClose.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            setTimeout(() => {
                showMessageIcon();
            }, 50);
        });

        initiatorCloseButton.addEventListener('click', function(event) {
            event.stopPropagation();
            const initiator = chatWidget.querySelector('.pai-chat-initiator');
            
            this.style.display = 'none';
            initiator.querySelector('.pai-chat-avatar-wrapper').style.opacity = '0';
            initiator.querySelector('.pai-chat-bubble').style.opacity = '0';
            
            setTimeout(() => {
                initiator.querySelector('.pai-chat-avatar-wrapper').style.display = 'none';
                initiator.querySelector('.pai-chat-bubble').style.display = 'none';
                showMessageIcon();
            }, 300);
        });

        fullscreenToggle.addEventListener('click', function() {
            chatWindow.classList.toggle('fullscreen');
            const isFullscreen = chatWindow.classList.contains('fullscreen');
            fullscreenToggle.innerHTML = isFullscreen ? 
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
        });

        submitButton.addEventListener('click', async function() {
            const validations = {
                firstName: validateInput(inputs.firstName, errors.firstName, value => value.length > 0),
                lastName: validateInput(inputs.lastName, errors.lastName, value => value.length > 0),
                email: validateInput(inputs.email, errors.email, isValidEmail),
                phone: validateInput(inputs.phone, errors.phone, isValidPhone)
            };

            if (Object.values(validations).every(v => v)) {
                userData = {
                    firstName: inputs.firstName.value.trim(),
                    lastName: inputs.lastName.value.trim(),
                    email: inputs.email.value.trim(),
                    phone: inputs.phone.value.trim()
                };

                userEmail = userData.email;
                sessionId = userData.email;
                localStorage.setItem('pai-chat-session', userData.email);
                
                emailOverlay.style.display = 'none';
                chatInput.disabled = false;
                sendButton.disabled = false;
                
                // Send user information as first message
                try {
                    await fetch('https://api.personal.ai/v1/message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': config.apiKey
                        },
                        body: JSON.stringify({
                            Text: `User Information:\nFirst Name: ${userData.firstName}\nLast Name: ${userData.lastName}\nEmail: ${userData.email}\nPhone: ${userData.phone}`,
                            UserName: userData.email,
                            SourceName: "WebChat",
                            SessionId: userData.email,
                            DomainName: config.domainName,
                            is_draft: false
                        })
                    });
                
                    await fetch('https://api.personal.ai/v1/message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': config.apiKey
                        },
                        body: JSON.stringify({
                            Text: "START_CHAT",
                            UserName: userData.email,
                            SourceName: "WebChat",
                            SessionId: userData.email,
                            DomainName: config.domainName,
                            is_draft: false
                        })
                    });

                    addAIMessage(config.initialQuestion || `Hi ${userData.firstName}, I'm ${config.chatbotName}, how can I help you?`);
                    initialMessageSent = true;
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        chatInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleMessage(this.value);
            }
        });

        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            scrollToBottom();
        });

        sendButton.addEventListener('click', function() {
            handleMessage(chatInput.value);
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
                setTimeout(() => {
                    showMessageIcon();
                }, 50);
            }
        });

        window.addEventListener('resize', function() {
            if (messageIcon.classList.contains('expanded')) {
                showMessageIcon();
            }
        });

        // Initialize the chat widget
        typeInitialMessage();
    };
})();
