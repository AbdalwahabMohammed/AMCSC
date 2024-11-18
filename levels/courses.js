const sidebarToggle = document.querySelector('#sidebar-toggle');
const sidebar = document.querySelector('#sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    // تغيير أيقونة الزر
    sidebarToggle.querySelector('i').classList.toggle('uil-bars');
    sidebarToggle.querySelector('i').classList.toggle('uil-times');
});

const attachmentBtn = document.querySelector('.attachment-btn');
const attachmentMenu = document.querySelector('.attachment-menu');
const attachmentOptions = document.querySelectorAll('.attachment-option');

attachmentBtn.addEventListener('click', () => {
    attachmentBtn.classList.toggle('active');
    attachmentMenu.classList.toggle('show');
    toggleAttachmentOptions();
});

attachmentOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        const type = option.dataset.type;
        const input = document.querySelector(`#${type}Input`);
        if (input) input.click();
    });
});

class ChatBox {
    constructor() {
        this.messageInput = document.querySelector('.message-input');
        this.sendButton = document.querySelector('.send-btn');
        this.chatMessages = document.querySelector('#chat-messages');
        this.fileInputs = document.querySelectorAll('.upload-option input');
        this.urlButton = document.querySelector('.url-btn');
        this.urlModal = document.querySelector('#urlModal');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // إرسال الرسائل النصية
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // تحميل الملفات
        this.fileInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleFileUpload(e));
        });

        // إضافة الروابط
        this.urlButton.addEventListener('click', () => this.showUrlModal());
        document.querySelector('.btn-add').addEventListener('click', () => this.addUrl());
        document.querySelector('.btn-cancel').addEventListener('click', () => this.hideUrlModal());

        // ضبط ارتفاع textarea
        this.messageInput.addEventListener('input', this.adjustTextareaHeight.bind(this));
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.addMessageToChat('text', message);
            this.messageInput.value = '';
            this.adjustTextareaHeight();
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileType = event.target.dataset.type;
        const reader = new FileReader();

        reader.onload = (e) => {
            switch (fileType) {
                case 'image':
                    this.addMessageToChat('image', e.target.result);
                    break;
                case 'video':
                    this.addMessageToChat('video', e.target.result);
                    break;
                case 'pdf':
                    this.addMessageToChat('pdf', file.name, e.target.result);
                    break;
            }
        };

        reader.readAsDataURL(file);
    }

    addMessageToChat(type, content, url = null) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let messageHTML = '';

        switch (type) {
            case 'text':
                messageHTML = `
                    <div class="message sent">
                        <div class="message-content">
                            <p>${this.escapeHtml(content)}</p>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>`;
                break;

            case 'image':
                messageHTML = `
                    <div class="message sent">
                        <div class="message-content">
                            <img src="${content}" class="message-image" alt="صورة مرفقة">
                            <span class="message-time">${time}</span>
                        </div>
                    </div>`;
                break;

            case 'video':
                messageHTML = `
                    <div class="message sent">
                        <div class="message-content">
                            <video controls class="message-video">
                                <source src="${content}" type="video/mp4">
                            </video>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>`;
                break;

            case 'pdf':
                messageHTML = `
                    <div class="message sent">
                        <div class="message-content">
                            <div class="message-pdf">
                                <i class="uil uil-file-pdf"></i>
                                <span>${content}</span>
                            </div>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>`;
                break;

            case 'url':
                messageHTML = `
                    <div class="message sent">
                        <div class="message-content">
                            <a href="${content}" target="_blank" class="message-url">${content}</a>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>`;
                break;
        }

        this.chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showUrlModal() {
        this.urlModal.style.display = 'flex';
        document.querySelector('#urlInput').focus();
    }

    hideUrlModal() {
        this.urlModal.style.display = 'none';
        document.querySelector('#urlInput').value = '';
    }

    addUrl() {
        const url = document.querySelector('#urlInput').value.trim();
        if (url) {
            this.addMessageToChat('url', url);
            this.hideUrlModal();
        }
    }

    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleAttachmentOptions() {
        const radius = 80; // نصف قطر الدائرة
        const totalOptions = this.attachmentOptions.length;
        
        this.attachmentOptions.forEach((option, index) => {
            if (this.attachmentMenu.classList.contains('show')) {
                const angle = (index * (360 / totalOptions) - 90) * (Math.PI / 180);
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                option.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            } else {
                option.style.transform = 'translate(0, 0) scale(0)';
            }
        });
    }
}

// تهيئة صندوق المحادثة
const chatBox = new ChatBox();