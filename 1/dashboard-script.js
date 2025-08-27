// Dashboard JavaScript Functions

// Navigation Functions
function openAdminPanel() {
    window.location.href = 'admin.html';
}

function openPreview() {
    window.open('index.html', '_blank');
}

function openStats() {
    alert('📊 สถิติการใช้งาน\n\nฟีเจอร์นี้จะแสดง:\n- จำนวนการเข้าสู่ระบบ\n- สถิติการใช้งานรายวัน\n- รายงานความปลอดภัย\n- ข้อมูลผู้ใช้งาน\n\n(กำลังพัฒนา...)');
}

function openSystemSettings() {
    // Navigate to system settings (will be implemented)
    alert('⚙️ ตั้งค่าระบบ\n\nฟีเจอร์นี้จะรวม:\n- ตั้งค่าความปลอดภัย\n- การจัดการ API\n- การตั้งค่าเซิร์ฟเวอร์\n- การสำรองข้อมูล\n\n(กำลังพัฒนา...)');
}

function openThemeManager() {
    // Navigate to theme management section in admin panel
    window.location.href = 'admin.html#theme-section';
}

function openLogoManager() {
    // Navigate to logo management (will be implemented)
    alert('🖼️ จัดการโลโก้\n\nฟีเจอร์นี้จะรวม:\n- อัปโหลดโลโก้ใหม่\n- ใช้ลิงก์ภาพภายนอก\n- ปรับขนาดโลโก้\n- ตัวอย่างแบบเรียลไทม์\n\n(กำลังพัฒนา...)');
}

function openTextEditor() {
    // Navigate to text editing section in admin panel
    window.location.href = 'admin.html#text-section';
}

function downloadFiles() {
    // Create a download package
    const confirmed = confirm('📥 ดาวน์โหลดไฟล์ระบบ\n\nต้องการดาวน์โหลดไฟล์ทั้งหมดของระบบหรือไม่?\n\nไฟล์ที่จะรวม:\n- หน้าล็อกอิน (index.html)\n- หน้า QR Code (qr-login.html)\n- ไฟล์ CSS และ JavaScript\n- การตั้งค่าปัจจุบัน');
    
    if (confirmed) {
        // In a real implementation, this would create a zip file
        alert('✅ เริ่มการดาวน์โหลด...\n\n(ในระบบจริงจะสร้างไฟล์ ZIP ให้ดาวน์โหลด)');
    }
}

function logout() {
    const confirmed = confirm('ต้องการออกจากระบบหรือไม่?');
    if (confirmed) {
        // Clear any stored session data
        localStorage.removeItem('adminLoggedIn');
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'index.html';
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (simple check)
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        // In a real system, redirect to login
        console.log('User not logged in - would redirect to login page');
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + A for Admin Panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            openAdminPanel();
        }
        
        // Ctrl/Cmd + P for Preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            openPreview();
        }
        
        // Ctrl/Cmd + D for Download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            downloadFiles();
        }
    });
    
    // Add loading animation for cards
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Display current time
    updateTime();
    setInterval(updateTime, 1000);
});

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Add time display to header if element exists
    let timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.id = 'current-time';
        timeDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            z-index: 1000;
        `;
        document.body.appendChild(timeDisplay);
    }
    timeDisplay.textContent = timeString;
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.background = '#007bff';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

