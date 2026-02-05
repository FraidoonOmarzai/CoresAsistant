// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Reveal animations
gsap.utils.toArray('.reveal-text').forEach((element, i) => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: element.style.animationDelay ? parseFloat(element.style.animationDelay) : 0
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('glass-strong');
    } else {
        navbar.classList.remove('glass-strong');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('translate-x-full');
}

// Contact Form Handling
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMessage');
    const originalContent = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        successMsg.classList.remove('hidden');
        successMsg.classList.add('success-animation');
        document.getElementById('contactForm').reset();
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    }, 1500);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Copied!';
        tooltip.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium';
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    });
}

// WebGL Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.5;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist/150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resize);
resize();
initParticles();
animateParticles();

// 3D Hero Effect with Three.js
const heroCanvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create floating geometry
const geometry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x6366f1, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const particles2 = new THREE.Group();
for (let i = 0; i < 20; i++) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.6 })
    );
    mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
    );
    particles2.add(mesh);
}
scene.add(particles2);

camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate3D() {
    requestAnimationFrame(animate3D);
    
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.002;
    
    sphere.position.x = mouseX * 0.5;
    sphere.position.y = mouseY * 0.5;
    
    particles2.rotation.y += 0.001;
    
    renderer.render(scene, camera);
}

animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Magnetic button effect
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});



// chatbot
// CHATBOT - Replace YOUR_WORKER_URL with your actual Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL = 'https://YOUR_WORKER_NAME.YOUR_SUBDOMAIN.workers.dev';

let chatHistory = [];
let isProcessing = false;

document.getElementById('chatbot-toggle').addEventListener('click', () => {
    const chatWindow = document.getElementById('chatbot-window');
    const isActive = chatWindow.classList.toggle('active');
    document.getElementById('chat-icon').classList.toggle('hidden', isActive);
    document.getElementById('close-icon').classList.toggle('hidden', !isActive);
    if (isActive) document.getElementById('chat-input').focus();
});

function addMessage(content, isUser = false) {
    const div = document.createElement('div');
    div.className = 'flex gap-3 animate-fade-in' + (isUser ? ' justify-end' : '');
    div.innerHTML = isUser ? 
        `<div class="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
            <p class="text-sm text-white">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>` :
        `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-white">CA</span>
        </div>
        <div class="bg-gray-800/80 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
            <p class="text-sm text-white">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>`;
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || isProcessing) return;
    
    input.value = '';
    addMessage(message, true);
    isProcessing = true;
    document.getElementById('send-button').disabled = true;
    document.getElementById('typing-indicator').classList.remove('hidden');
    
    chatHistory.push({ role: 'user', content: message });
    
    try {
        const res = await fetch(CLOUDFLARE_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024
            })
        });
        
        const data = await res.json();
        const reply = data.choices[0].message.content;
        chatHistory.push({ role: 'assistant', content: reply });
        
        document.getElementById('typing-indicator').classList.add('hidden');
        addMessage(reply, false);
    } catch (error) {
        document.getElementById('typing-indicator').classList.add('hidden');
        addMessage('Sorry, an error occurred. Please try again.', false);
        console.error(error);
    } finally {
        isProcessing = false;
        document.getElementById('send-button').disabled = false;
    }

});
