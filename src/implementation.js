document.addEventListener('DOMContentLoaded', function() {
    initPersonalAIChatbot({
        apiKey: 'your-api-key',
        domainName: 'your-domain-name',
        initialMessage: "Hi, welcome to our website. Chat now?",
        aiAvatarUrl: 'path/to/your/image',
        userAvatarUrl: 'path/to/your/image',
        chatbotName: 'AI Chatbot',
        sendButtonColor: '#6656FF',
        messageIconColor: '#6656FF',
        startChatButtonColor: '#6656FF',
        initiatorPosition: 'bottom-right',
        initialQuestion: 'Hi how are you today?',
        requireIntake: true,  // Set to false to disable intake form
        defaultUserEmail: 'anonymous@user.com',  // Used when requireIntake is false
        intakeFormTitle: 'Before we start chatting',
        intakeFormSubtitle: 'Please fill out your information to continue'
    });
});
