// بيانات كيك الخاصة بك
const CLIENT_ID = '01KSV3JZQ4PN0N3K6DQS4MMENK';
const CLIENT_SECRET = 'cb442a543faf95d0c35febccd05a7785540a4703ef3e7b82e9e27db02b70f16f';
const REDIRECT_URI = window.location.origin + window.location.pathname;

let accessToken = null;
let botInterval = null;

// فتح وإغلاق اللوحة
document.getElementById('openPanelBtn').addEventListener('click', () => {
    document.getElementById('controlPanel').style.display = 'block';
});

document.getElementById('closePanelBtn').addEventListener('click', () => {
    document.getElementById('controlPanel').style.display = 'none';
});

// تسجيل الدخول
document.getElementById('loginBtn').addEventListener('click', () => {
    addLog('جاري التحويل لتسجيل الدخول بكيك...', 'log-wait');
    const authUrl = `https://id.kick.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=chat:write+user:read`;
    // نستخدم window.top لكي نخرج من الiframe ونسجل الدخول بشكل طبيعي
    window.top.location.href = authUrl;
});

// التحقق من العودة بعد تسجيل الدخول
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        getToken(code);
    }
};

// استبدال الكود بالتوكن
async function getToken(code) {
    addLog('تم استلام الرمز، جاري المصادقة...', 'log-wait');
    try {
        const response = await fetch('https://id.kick.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI
            })
        });
        const data = await response.json();
        if (data.access_token) {
            accessToken = data.access_token;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('botSection').style.display = 'block';
            addLog('تم تسجيل الدخول بنجاح! البوت جاهز.', 'log-success');
        } else {
            addLog('فشل المصادقة.', 'log-error');
        }
    } catch (e) {
        addLog('خطأ في الاتصال (قد تحتاج لسيرفر وسيط بسبب CORS).', 'log-error');
    }
}

// تشغيل البوت
document.getElementById('startBtn').addEventListener('click', () => {
    const channel = document.getElementById('channelName').value.trim();
    const messages = document.getElementById('messagesList').value.trim().split('\n');
    const cooldown = parseInt(document.getElementById('cooldownSec').value) * 1000;

    if (!channel || messages.length === 0) {
        addLog('أدخل اسم القناة ورسالة واحدة على الأقل!', 'log-error');
        return;
    }

    let index = 0;
    addLog(`بدء البوت في القناة: ${channel}`, 'log-success');
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'block';

    sendKickMessage(channel, messages[index]);
    index++;

    botInterval = setInterval(() => {
        if (index >= messages.length) index = 0;
        sendKickMessage(channel, messages[index]);
        index++;
    }, cooldown);
});

// إيقاف البوت
document.getElementById('stopBtn').addEventListener('click', () => {
    clearInterval(botInterval);
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('stopBtn').style.display = 'none';
    addLog('تم إيقاف البوت.', 'log-wait');
});

// إرسال الرسالة لكيك
async function sendKickMessage(channel, message) {
    addLog(`محاولة إرسال: ${message}`, 'log-wait');
    try {
        const chanRes = await fetch(`https://api.kick.com/api/v1/channels/${channel}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const chanData = await chanRes.json();
        const chatroomId = chanData.data.chatroom_id;

        await fetch('https://api.kick.com/api/v2/chat/send', {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ message: message, channel_id: chatroomId })
        });
        addLog(`تم الإرسال بنجاح!`, 'log-success');

    } catch (e) {
        addLog('فشل الإرسال (تأكد من الصلاحيات أو السيرفر الوسيط).', 'log-error');
    }
}

// إضافة سجل
function addLog(text, type = '') {
    const box = document.getElementById('logBox');
    const div = document.createElement('div');
    div.className = type;
    div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
