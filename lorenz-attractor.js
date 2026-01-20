// Lorenz Attractor Background Animation
class LorenzAttractor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            this.initialized = false;
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context from canvas');
            this.initialized = false;
            return;
        }
        
        this.initialized = true;
        
        // Lorenz system parameters (classic values)
        this.sigma = 10;
        this.rho = 28;
        this.beta = 8 / 3;
        
        // Time step for numerical integration
        this.dt = 0.01;
        
        // Multiple particles for better visualization
        this.particles = [];
        this.numParticles = 300; // Reduced for better performance
        this.maxTrailLength = 150;
        
        // Initialize particles with slight variations - start near attractor
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 30 + 5, // Start closer to attractor
                y: (Math.random() - 0.5) * 30 + 5,
                z: (Math.random() - 0.5) * 30 + 10,
                trail: [],
                hue: (i * 137.508) % 360 // Golden angle for color distribution
            });
        }
        
        // Scale and translation for 2D projection
        this.scale = 10;
        this.centerX = 0;
        this.centerY = 0;
        this.centerZ = 0;
        
        // Animation
        this.angleX = 0;
        this.angleY = 0;
        this.rotationSpeed = 0.001;
        
        // Resize must happen after particles are initialized
        this.resize();
        
        // Setup resize handler
        window.addEventListener('resize', () => this.resize());
        
        // Start animation
        this.start();
    }
    
    resize() {
        if (!this.canvas || !this.ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Set internal canvas size (for drawing)
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        
        // Scale context to account for device pixel ratio
        this.ctx.scale(dpr, dpr);
        
        // Set display size (CSS pixels) - no need, CSS already handles this
        // Center point in display coordinates
        this.centerX = width / 2;
        this.centerY = height / 2;
    }
    
    // Lorenz differential equations
    dxdt(x, y, z) {
        return this.sigma * (y - x);
    }
    
    dydt(x, y, z) {
        return x * (this.rho - z) - y;
    }
    
    dzdt(x, y, z) {
        return x * y - this.beta * z;
    }
    
    // Runge-Kutta 4th order integration
    rk4(particle) {
        const k1x = this.dxdt(particle.x, particle.y, particle.z);
        const k1y = this.dydt(particle.x, particle.y, particle.z);
        const k1z = this.dzdt(particle.x, particle.y, particle.z);
        
        const k2x = this.dxdt(
            particle.x + k1x * this.dt / 2,
            particle.y + k1y * this.dt / 2,
            particle.z + k1z * this.dt / 2
        );
        const k2y = this.dydt(
            particle.x + k1x * this.dt / 2,
            particle.y + k1y * this.dt / 2,
            particle.z + k1z * this.dt / 2
        );
        const k2z = this.dzdt(
            particle.x + k1x * this.dt / 2,
            particle.y + k1y * this.dt / 2,
            particle.z + k1z * this.dt / 2
        );
        
        const k3x = this.dxdt(
            particle.x + k2x * this.dt / 2,
            particle.y + k2y * this.dt / 2,
            particle.z + k2z * this.dt / 2
        );
        const k3y = this.dydt(
            particle.x + k2x * this.dt / 2,
            particle.y + k2y * this.dt / 2,
            particle.z + k2z * this.dt / 2
        );
        const k3z = this.dzdt(
            particle.x + k2x * this.dt / 2,
            particle.y + k2y * this.dt / 2,
            particle.z + k2z * this.dt / 2
        );
        
        const k4x = this.dxdt(
            particle.x + k3x * this.dt,
            particle.y + k3y * this.dt,
            particle.z + k3z * this.dt
        );
        const k4y = this.dydt(
            particle.x + k3x * this.dt,
            particle.y + k3y * this.dt,
            particle.z + k3z * this.dt
        );
        const k4z = this.dzdt(
            particle.x + k3x * this.dt,
            particle.y + k3y * this.dt,
            particle.z + k3z * this.dt
        );
        
        particle.x += (k1x + 2 * k2x + 2 * k3x + k4x) * this.dt / 6;
        particle.y += (k1y + 2 * k2y + 2 * k3y + k4y) * this.dt / 6;
        particle.z += (k1z + 2 * k2z + 2 * k3z + k4z) * this.dt / 6;
    }
    
    // Project 3D point to 2D screen coordinates
    project3D(x, y, z) {
        // Rotate around Y axis
        let rotX = x * Math.cos(this.angleY) - z * Math.sin(this.angleY);
        let rotZ = x * Math.sin(this.angleY) + z * Math.cos(this.angleY);
        
        // Rotate around X axis
        let rotY = y * Math.cos(this.angleX) - rotZ * Math.sin(this.angleX);
        let finalZ = y * Math.sin(this.angleX) + rotZ * Math.cos(this.angleX);
        
        // Perspective projection
        const perspective = 800;
        const scale = perspective / (perspective + finalZ);
        
        return {
            x: this.centerX + rotX * this.scale * scale,
            y: this.centerY + rotY * this.scale * scale,
            z: finalZ
        };
    }
    
    update() {
        // Update rotation
        this.angleY += this.rotationSpeed;
        
        // Update each particle
        this.particles.forEach(particle => {
            // Integrate Lorenz equations
            this.rk4(particle);
            
            // Project to 2D and add to trail
            const projected = this.project3D(particle.x, particle.y, particle.z);
            particle.trail.push(projected);
            
            // Limit trail length
            if (particle.trail.length > this.maxTrailLength) {
                particle.trail.shift();
            }
        });
    }
    
    draw() {
        // Clear with semi-transparent overlay for trail effect
        this.ctx.fillStyle = 'rgba(49, 28, 35, 0.05)'; // Lighter fade for smoother trails
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles and trails
        this.particles.forEach(particle => {
            if (particle.trail.length < 2) return;
            
            // Draw trail with gradient effect
            this.ctx.beginPath();
            this.ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, 0.25)`;
            this.ctx.lineWidth = 1.5;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            const firstPoint = particle.trail[0];
            this.ctx.moveTo(firstPoint.x, firstPoint.y);
            
            for (let i = 1; i < particle.trail.length; i++) {
                const point = particle.trail[i];
                this.ctx.lineTo(point.x, point.y);
            }
            
            this.ctx.stroke();
            
            // Draw current particle position
            const current = particle.trail[particle.trail.length - 1];
            if (current && current.x >= 0 && current.x <= this.canvas.width && 
                current.y >= 0 && current.y <= this.canvas.height) {
                this.ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, 0.5)`;
                this.ctx.beginPath();
                this.ctx.arc(current.x, current.y, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    animate() {
        if (!this.initialized || !this.canvas || !this.ctx) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.initialized) {
            console.error('Cannot start Lorenz attractor - not initialized');
            return;
        }
        this.animate();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLorenz);
} else {
    // DOM is already ready
    initLorenz();
}

function initLorenz() {
    const canvas = document.getElementById('lorenz-canvas');
    if (canvas) {
        try {
            const attractor = new LorenzAttractor('lorenz-canvas');
            // Verify it initialized
            if (attractor && attractor.canvas) {
                console.log('Lorenz attractor initialized successfully');
            }
        } catch (error) {
            console.error('Error initializing Lorenz attractor:', error);
        }
    } else {
        console.error('Lorenz canvas not found');
        // Retry after a short delay
        setTimeout(initLorenz, 100);
    }
}
