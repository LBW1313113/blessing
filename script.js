// 烟花动画实现
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// 预加载爱心图片
const heartImage = new Image();
heartImage.src = 'heart.png';

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
        
        if (heartImage.complete) {
            // 直接绘制爱心图片
            const size = this.size * 20;
            const x = this.x - size / 2;
            const y = this.y - size / 2;
            ctx.drawImage(heartImage, x, y, size, size);
        } else {
            // 图片未加载完成时，绘制圆形粒子
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
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
        this.mainColor = '#ff0000'; // 统一使用红色
        this.createParticles();
    }

    createParticles() {
        let particleCount;
        
        switch(this.explosionType) {
            case 0: // 超级圆形大爆炸
                particleCount = 30;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i;
                    const speed = Math.random() * 6 + 4;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 1.5 + 1;
                    const color = '#ff0000'; // 所有粒子都使用红色
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                
                // 添加外层光环粒子
                const outerCount = 12;
                for (let i = 0; i < outerCount; i++) {
                    const angle = (Math.PI * 2 / outerCount) * i;
                    const speed = Math.random() * 3 + 8;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 1 + 0.5;
                    this.particles.push(new Particle(this.x, this.y, '#ff6666', velocity, size)); // 淡红色
                }
                break;
                
            case 1: // 超大心形爆炸
                particleCount = 25;
                for (let i = 0; i < particleCount; i++) {
                    const t = Math.random() * Math.PI * 2;
                    const scale = Math.random() * 6 + 4;
                    // 心形参数方程
                    const x = 16 * Math.pow(Math.sin(t), 3) * scale / 16;
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale / 16;
                    const velocity = { x, y };
                    const size = Math.random() * 1.5 + 1;
                    const color = '#ff0000'; // 所有粒子都使用红色
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                break;
                
            case 2: // 多重环形爆炸
                particleCount = 35;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i;
                    const radius = Math.random() * 5 + 2;
                    const speedVariation = Math.random() * 3;
                    const velocity = {
                        x: Math.cos(angle) * (radius + speedVariation),
                        y: Math.sin(angle) * (radius + speedVariation)
                    };
                    const size = Math.random() * 1.5 + 0.8;
                    const color = i % 2 === 0 ? '#ff6666' : this.mainColor;
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                
                // 添加第二层环
                for (let i = 0; i < 15; i++) {
                    const angle = (Math.PI * 2 / 15) * i;
                    const speed = 8 + Math.random() * 4;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 1 + 0.5;
                    this.particles.push(new Particle(this.x, this.y, '#ff6666', velocity, size));
                }
                break;
                
            case 3: // 超级流星雨爆炸
                particleCount = 20;
                for (let i = 0; i < particleCount; i++) {
                    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
                    const speed = Math.random() * 8 + 6;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    const size = Math.random() * 1.5 + 1;
                    const x = this.x + (Math.random() - 0.5) * 150;
                    const y = this.y + (Math.random() - 0.5) * 50;
                    this.particles.push(new Particle(x, y, '#ff0000', velocity, size)); // 所有粒子都使用红色
                }
                break;
                
            case 4: // 五星形爆炸（新增）
                particleCount = 28;
                for (let i = 0; i < particleCount; i++) {
                    const k = i % 5;
                    const angle = (Math.PI * 2 / particleCount) * i + (k * Math.PI * 2 / 5);
                    const speed = Math.random() * 5 + 3;
                    const distance = 2 + Math.sin(5 * angle) * 3;
                    const velocity = {
                        x: Math.cos(angle) * speed * distance / 4,
                        y: Math.sin(angle) * speed * distance / 4
                    };
                    const size = Math.random() * 1.5 + 0.8;
                    const color = '#ff0000'; // 所有粒子都使用红色
                    this.particles.push(new Particle(this.x, this.y, color, velocity, size));
                }
                break;
                
            case 5: // 螺旋爆炸（新增）
                particleCount = 32;
                for (let i = 0; i < particleCount; i++) {
                    const angle = i * 0.1;
                    const radius = i * 0.05;
                    const speed = 2 + Math.random() * 2;
                    const velocity = {
                        x: Math.cos(angle) * radius * speed / 8,
                        y: Math.sin(angle) * radius * speed / 8
                    };
                    const size = Math.random() * 1.2 + 0.8;
                    const color = '#ff0000'; // 所有粒子都使用红色
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
        const secondaryCount = 8;
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
            const size = Math.random() * 1 + 0.5;
            this.particles.push(new Particle(x, y, '#ff6666', velocity, size)); // 使用淡红色
        }
    }
    
    createTertiaryExplosion() {
        const tertiaryCount = 6;
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
            const size = Math.random() * 0.8 + 0.4;
            this.particles.push(new Particle(x, y, '#ff6666', velocity, size)); // 使用淡红色
        }
    }
    
    createShockwave() {
        const shockwaveCount = 4;
        for (let i = 0; i < shockwaveCount; i++) {
            const angle = (Math.PI * 2 / shockwaveCount) * i;
            const speed = 1 + Math.random() * 1;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const size = 0.8;
            this.particles.push(new Particle(this.x, this.y, '#ffeeee', velocity, size)); // 极淡红色
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
const MAX_TOTAL_PARTICLES = 400; // 限制屏幕上最大总粒子数

// 初始化星星
function initStars() {
    for (let i = 0; i < 80; i++) {
        stars.push(new Star());
    }
}

// 计算总粒子数
function getTotalParticles() {
    let total = 0;
    fireworks.forEach(firework => {
        total += firework.particles.length + firework.trails.length;
    });
    return total;
}

// 创建随机烟花
function createRandomFirework() {
    // 如果总粒子数超过限制，不创建新烟花
    if (getTotalParticles() > MAX_TOTAL_PARTICLES) {
        return;
    }
    
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.4;
    fireworks.push(new Firework(x, y));
    
    // 有时候同时发射多个烟花
    if (Math.random() > 0.7 && getTotalParticles() < MAX_TOTAL_PARTICLES) {
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (getTotalParticles() < MAX_TOTAL_PARTICLES) {
                    const offsetX = (Math.random() - 0.5) * 200;
                    const offsetY = (Math.random() - 0.5) * 100;
                    fireworks.push(new Firework(x + offsetX, y + offsetY));
                }
            }, i * 200);
        }
    }
}

// 创建背景光斑
const lightSpots = document.getElementById('lightSpots');
function createLightSpots() {
    for (let i = 0; i < 8; i++) {
        const spot = document.createElement('div');
        spot.className = 'light-spot';
        spot.style.width = (Math.random() * 100 + 50) + 'px';
        spot.style.height = spot.style.width;
        spot.style.left = Math.random() * 100 + '%';
        spot.style.top = Math.random() * 70 + '%';
        spot.style.animationDelay = Math.random() * 3 + 's';
        spot.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        // 添加绳子连接吊篮
        const string1 = document.createElement('div');
        string1.className = 'string';
        const string2 = document.createElement('div');
        string2.className = 'string';
        spot.appendChild(string1);
        spot.appendChild(string2);
        
        lightSpots.appendChild(spot);
    }
}

// 创建飘落爱心
const heartContainer = document.getElementById('heartContainer');
const heartSizes = [30, 40, 50, 60, 70, 80];
const heartRotations = [-30, -15, 0, 15, 30, 45];

function createFallingHeart() {
    const count = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.style.left = Math.random() * 100 + '%';
        const size = heartSizes[Math.floor(Math.random() * heartSizes.length)];
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        const rotation = heartRotations[Math.floor(Math.random() * heartRotations.length)];
        heart.style.transform = `rotate(${rotation}deg)`;
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heartContainer.appendChild(heart);
        
        // 移除过期爱心
        setTimeout(() => {
            heart.remove();
        }, 15000);
    }
}

// 创建点击位置淡出爱心
function createClickHearts(x, y) {
    const clickHeartContainer = document.getElementById('clickHeartContainer') || createClickHeartContainer();
    
    // 只生成一个大爱心
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    // 使用更大的尺寸范围
    const clickSizes = [60, 70, 80, 90, 100];
    const size = clickSizes[Math.floor(Math.random() * clickSizes.length)];
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // 随机旋转角度，使爱心方向不一致（-180到180度）
    const rotation = Math.floor(Math.random() * 360) - 180;
    heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
    heart.style.animationDuration = (Math.random() * 1 + 2) + 's';
    clickHeartContainer.appendChild(heart);
    
    // 移除过期爱心
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function createClickHeartContainer() {
    const container = document.createElement('div');
    container.id = 'clickHeartContainer';
    container.className = 'click-heart-container';
    document.body.appendChild(container);
    return container;
}

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

// 浮动祝福文字
const floatingTexts = document.getElementById('floatingTexts');
const blessingTexts = [
    '我爱你', '一生一世', '永浴爱河', '白头偕老', '心心相印',
    '甜蜜爱情', '甜甜蜜蜜', '浪漫告白', '一见钟情', '两情相悦',
    '执子之手', '与子偕老', '天作之合', '情比金坚', '海枯石烂',
    '天长地久', '永结同心', '百年好合', '花好月圆', '情投意合',
    '520', '我爱你一生', '情人节快乐', '爱在心底', '遇见你真好'
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

// 背景音乐控制
const bgMusic = document.getElementById('bgMusic');
let animationStarted = false;
let fireworkInterval;
let heartInterval;
let floatingTextInterval;

// 用户点击页面任意位置开始播放所有动画和音乐
function startAnimation() {
    if (!animationStarted) {
        animationStarted = true;
        
        // 显示祝福语并播放进场动画
        document.querySelector('.greeting').classList.add('animate');
        
        // 初始化星星
        initStars();
        
        // 初始化背景光斑
        createLightSpots();
        
        // 开始动画循环
        animate();
        
        // 定时创建烟花
        fireworkInterval = setInterval(createRandomFirework, 1200);
        
        // 定时创建飘落爱心
        heartInterval = setInterval(createFallingHeart, 1500);
        
        // 定时创建浮动文字
        floatingTextInterval = setInterval(createFloatingText, 1500);
        
        // 初始创建一些浮动文字
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingText, i * 1000);
        }
        
        // 初始创建一些爱心
        for (let i = 0; i < 3; i++) {
            setTimeout(createFallingHeart, i * 1000);
        }
        
        // 播放音乐
        bgMusic.play().then(() => {
            console.log('音乐开始播放');
        }).catch(error => {
            console.log('播放失败:', error);
        });
    }
}

// 点击创建淡出爱心
canvas.addEventListener('click', (e) => {
    if (animationStarted) {
        createClickHearts(e.clientX, e.clientY);
    }
});

// 监听用户第一次点击
document.addEventListener('click', startAnimation, { once: true });

// 同时也支持触摸事件（移动设备）
document.addEventListener('touchstart', startAnimation, { once: true });
