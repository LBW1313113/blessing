// 烟花动画实现
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// 设置canvas尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 粒子类
class Particle {
    constructor(x, y, color, velocity, size = 2) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.98;
        this.gravity = 0.05;
        this.size = size;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// 轨迹粒子类
class TrailParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = 0.8;
        this.size = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.alpha -= 0.02;
        this.size *= 0.98;
    }
}

// 烟花类
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.trails = [];
        this.explosionType = Math.floor(Math.random() * 6); // 0-5种爆炸模式
        this.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088', '#ffffff', '#ffd700', '#ff69b4', '#4ecdc4', '#45b7d1', '#ff6b6b'];
        this.mainColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.createParticles();
    }

    createParticles() {
        let particleCount;
        
        switch(this.explosionType) {
            case 0: // 超级圆形大爆炸
                particleCount = 300;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i;
                    const speed = Math.random() * 6 + 4;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 3 + 1.5;
                    const color = Math.random() > 0.6 ? this.mainColor : this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                
                // 添加外层光环粒子
                const outerCount = 100;
                for (let i = 0; i < outerCount; i++) {
                    const angle = (Math.PI * 2 / outerCount) * i;
                    const speed = Math.random() * 3 + 8;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 2 + 1;
                    this.particles.push(new Particle(this.x, this.y, '#ffffff', velocity, size));
                }
                break;
                
            case 1: // 超大心形爆炸
                particleCount = 250;
                for (let i = 0; i < particleCount; i++) {
                    const t = Math.random() * Math.PI * 2;
                    const scale = Math.random() * 6 + 4;
                    // 心形参数方程
                    const x = 16 * Math.pow(Math.sin(t), 3) * scale / 16;
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale / 16;
                    const velocity = { x, y };
                    const size = Math.random() * 3 + 1.5;
                    const color = Math.random() > 0.5 ? this.mainColor : this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                break;
                
            case 2: // 多重环形爆炸
                particleCount = 350;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i;
                    const radius = Math.random() * 5 + 2;
                    const speedVariation = Math.random() * 3;
                    const velocity = {
                        x: Math.cos(angle) * (radius + speedVariation),
                        y: Math.sin(angle) * (radius + speedVariation)
                    };
                    const size = Math.random() * 2 + 1;
                    const color = i % 2 === 0 ? '#ffffff' : this.mainColor;
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                
                // 添加第二层环
                for (let i = 0; i < 150; i++) {
                    const angle = (Math.PI * 2 / 150) * i;
                    const speed = 8 + Math.random() * 4;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 1.5 + 0.5;
                    this.particles.push(new Particle(this.x, this.y, this.colors[Math.floor(Math.random() * this.colors.length)], velocity, size));
                }
                break;
                
            case 3: // 超级流星雨爆炸
                particleCount = 200;
                for (let i = 0; i < particleCount; i++) {
                    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
                    const speed = Math.random() * 8 + 6;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 3 + 1.5;
                    const x = this.x + (Math.random() - 0.5) * 150;
                    const y = this.y + (Math.random() - 0.5) * 50;
                    this.particles.push(new Particle(x, y, this.mainColor, velocity, size));
                }
                break;
                
            case 4: // 五星形爆炸（新增）
                particleCount = 280;
                for (let i = 0; i < particleCount; i++) {
                    const k = i % 5;
                    const angle = (Math.PI * 2 / particleCount) * i + (k * Math.PI * 2 / 5);
                    const speed = Math.random() * 5 + 3;
                    const distance = 2 + Math.sin(5 * angle) * 3;
                    const velocity = {
                        x: Math.cos(angle) * speed * distance / 4,
                        y: Math.sin(angle) * speed * distance / 4
                    };
                    const size = Math.random() * 2.5 + 1;
                    const color = k % 2 === 0 ? this.mainColor : this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                break;
                
            case 5: // 螺旋爆炸（新增）
                particleCount = 320;
                for (let i = 0; i < particleCount; i++) {
                    const angle = i * 0.1;
                    const radius = i * 0.05;
                    const speed = 2 + Math.random() * 2;
                    const velocity = {
                        x: Math.cos(angle) * radius * speed / 8,
                        y: Math.sin(angle) * radius * speed / 8
                    };
                    const size = Math.random() * 2 + 1;
                    const color = this.colors[(i + Math.floor(Math.random() * this.colors.length)) % this.colors.length];
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                break;
        }
        
        // 添加二级和三级爆炸粒子
        if (Math.random() > 0.2) {
            setTimeout(() => {
                this.createSecondaryExplosion();
            }, 200 + Math.random() * 300);
            
            // 三级爆炸
            if (Math.random() > 0.4) {
                setTimeout(() => {
                    this.createTertiaryExplosion();
                }, 400 + Math.random() * 400);
            }
        }
        
        // 添加冲击波效果
        this.createShockwave();
    }
    
    createSecondaryExplosion() {
        const secondaryCount = 100;
        for (let i = 0; i < secondaryCount; i++) {
            const angle = (Math.PI * 2 / secondaryCount) * i;
            const speed = Math.random() * 3 + 1.5;
            const radius = 40 + Math.random() * 60;
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const size = Math.random() * 1.5 + 0.8;
            this.particles.push(new Particle(x, y, this.colors[Math.floor(Math.random() * this.colors.length)], velocity, size));
        }
    }
    
    createTertiaryExplosion() {
        const tertiaryCount = 80;
        for (let i = 0; i < tertiaryCount; i++) {
            const angle = (Math.PI * 2 / tertiaryCount) * i;
            const speed = Math.random() * 2 + 1;
            const radius = 80 + Math.random() * 80;
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const size = Math.random() * 1 + 0.5;
            this.particles.push(new Particle(x, y, this.colors[Math.floor(Math.random() * this.colors.length)], velocity, size));
        }
    }
    
    createShockwave() {
        const shockwaveCount = 50;
        for (let i = 0; i < shockwaveCount; i++) {
            const angle = (Math.PI * 2 / shockwaveCount) * i;
            const speed = 1 + Math.random() * 1;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const size = 1;
            this.particles.push(new Particle(this.x, this.y, '#ffffff', velocity, size));
        }
    }

    update() {
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        this.trails.forEach((trail, index) => {
            trail.update();
            if (trail.alpha <= 0) {
                this.trails.splice(index, 1);
            }
        });
    }

    draw() {
        this.trails.forEach(trail => {
            trail.draw();
        });
        
        this.particles.forEach(particle => {
            particle.draw();
        });
    }

    isDone() {
        return this.particles.length === 0 && this.trails.length === 0;
    }
}

// 闪烁星星
let stars = [];
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }
    
    update() {
        this.brightness += this.twinkleSpeed;
        if (this.brightness > 1 || this.brightness < 0.3) {
            this.twinkleSpeed *= -1;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.brightness;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
    }
}

let fireworks = [];

// 初始化星星
function initStars() {
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }
}

// 创建随机烟花
function createRandomFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.4;
    fireworks.push(new Firework(x, y));
    
    // 有时候同时发射多个烟花
    if (Math.random() > 0.6) {
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 200;
                const offsetY = (Math.random() - 0.5) * 100;
                fireworks.push(new Firework(x + offsetX, y + offsetY));
            }, i * 200);
        }
    }
}

// 创建背景光斑
const lightSpots = document.getElementById('lightSpots');
function createLightSpots() {
    for (let i = 0; i < 20; i++) {
        const spot = document.createElement('div');
        spot.className = 'light-spot';
        spot.style.width = (Math.random() * 100 + 50) + 'px';
        spot.style.height = spot.style.width;
        spot.style.left = Math.random() * 100 + '%';
        spot.style.top = Math.random() * 100 + '%';
        spot.style.animationDelay = Math.random() * 3 + 's';
        spot.style.animationDuration = (Math.random() * 2 + 2) + 's';
        lightSpots.appendChild(spot);
    }
}

// 创建彩带
const confettiContainer = document.getElementById('confettiContainer');
const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088', '#ffffff', '#ffd700', '#ff69b4', '#4ecdc4', '#45b7d1'];

function createConfetti() {
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.width = (Math.random() * 8 + 4) + 'px';
        confetti.style.height = (Math.random() * 12 + 6) + 'px';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDuration = (Math.random() * 5 + 5) + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
        
        // 移除过期彩带
        setTimeout(() => {
            confetti.remove();
        }, 10000);
    }
}

// 定时创建彩带
setInterval(createConfetti, 800);

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制星星
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    fireworks.forEach((firework, index) => {
        firework.draw();
        firework.update();
        if (firework.isDone()) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// 初始化星星
initStars();
// 定时创建烟花
setInterval(createRandomFirework, 600);
animate();

// 点击创建烟花
canvas.addEventListener('click', (e) => {
    fireworks.push(new Firework(e.clientX, e.clientY));
});

// 浮动祝福文字
const floatingTexts = document.getElementById('floatingTexts');
const blessingTexts = [
    '新年快乐', '身体健康', '万事如意', '恭喜发财', '阖家幸福',
    '吉祥如意', '步步高升', '财源广进', '平安喜乐', '笑口常开',
    '福如东海', '寿比南山', '心想事成', '梦想成真', '幸福美满'
];

const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

function createFloatingText() {
    const text = document.createElement('div');
    text.className = 'floating-text';
    text.textContent = blessingTexts[Math.floor(Math.random() * blessingTexts.length)];
    text.style.left = Math.random() * 100 + '%';
    text.style.color = colors[Math.floor(Math.random() * colors.length)];
    text.style.animationDuration = (Math.random() * 10 + 10) + 's';
    text.style.fontSize = (Math.random() * 1 + 1) + 'rem';
    
    floatingTexts.appendChild(text);
    
    // 动画结束后移除元素
    setTimeout(() => {
        text.remove();
    }, 20000);
}

// 定时创建浮动文字
setInterval(createFloatingText, 800);

// 初始创建一些浮动文字
for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingText, i * 1000);
}

// 初始化背景光斑
createLightSpots();

// 初始创建一些彩带
for (let i = 0; i < 3; i++) {
    setTimeout(createConfetti, i * 1000);
}



// 背景音乐控制
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// 处理自动播放限制
document.addEventListener('DOMContentLoaded', () => {
    // 尝试自动播放
    bgMusic.play().catch(() => {
        // 如果自动播放失败，显示暂停状态
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('paused');
    });
});

// 切换播放/暂停
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🔊';
        musicToggle.classList.remove('paused');
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('paused');
    }
});
