import { PhongLighting } from './PhongLighting.js';

export class SpeedyGonzales {
  constructor(worldWidth, worldHeight) {
    this.x = 200;
    this.y = worldHeight / 2;
    this.vx = 3;
    this.vy = 0;
    this.angle = 0;
    this.scale = 1;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.targetX = Math.random() * worldWidth;
    this.targetY = Math.random() * worldHeight;
    this.animationFrame = 0;
    this.caught = false;
  }
  
  update() {
    if (this.caught) {
      this.vx *= 0.95;
      this.vy *= 0.95;
      return;
    }
    
    // Calcular direção para o alvo
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Escolher novo alvo se chegou perto
    if (dist < 50) {
      this.targetX = Math.random() * this.worldWidth;
      this.targetY = Math.random() * this.worldHeight;
    }
    
    // Aplicar aceleração em direção ao alvo
    const speed = 4;
    this.vx += (dx / dist) * 0.5;
    this.vy += (dy / dist) * 0.5;
    
    // Limitar velocidade máxima
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > speed) {
      this.vx = (this.vx / currentSpeed) * speed;
      this.vy = (this.vy / currentSpeed) * speed;
    }
    
    // Atualizar posição
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce nas bordas
    if (this.x < 0 || this.x > this.worldWidth) this.vx *= -1;
    if (this.y < 0 || this.y > this.worldHeight) this.vy *= -1;
    
    // Manter dentro dos limites
    this.x = Math.max(0, Math.min(this.x, this.worldWidth));
    this.y = Math.max(0, Math.min(this.y, this.worldHeight));
    
    // Atualizar ângulo baseado na direção
    this.angle = Math.atan2(this.vy, this.vx);
    
    // Avançar frame de animação
    this.animationFrame += currentSpeed * 0.1;
  }
  
  draw(ctx, camera, light) {
    const screen = camera.worldToScreen(this.x, this.y);
    
    // Verificar visibilidade
    if (!camera.isVisible(this.x, this.y)) {
      return;
    }
    
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(this.angle);
    
    const bounce = Math.sin(this.animationFrame) * 3;
    
    // Configuração de iluminação
    const bodyNormal = { x: 0, y: 0, z: 1 };
    const lightDir = { 
      x: -light.direction.x, 
      y: -light.direction.y, 
      z: -light.direction.z 
    };
    const viewDir = { x: 0, y: 0, z: 1 };
    
    // Corpo
    const bodyColor = PhongLighting.calculate(
      { r: 139, g: 69, b: 19 },
      bodyNormal,
      lightDir,
      viewDir,
      light
    );
    ctx.fillStyle = `rgb(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b})`;
    ctx.beginPath();
    ctx.ellipse(0, bounce, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    const headColor = PhongLighting.calculate(
      { r: 160, g: 82, b: 45 },
      bodyNormal,
      lightDir,
      viewDir,
      light
    );
    ctx.fillStyle = `rgb(${headColor.r}, ${headColor.g}, ${headColor.b})`;
    ctx.beginPath();
    ctx.ellipse(25, bounce - 5, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sombrero
    const hatColor = PhongLighting.calculate(
      { r: 255, g: 215, b: 0 },
      bodyNormal,
      lightDir,
      viewDir,
      light
    );
    ctx.fillStyle = `rgb(${hatColor.r}, ${hatColor.g}, ${hatColor.b})`;
    ctx.beginPath();
    ctx.ellipse(30, bounce - 25, 30, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgb(${hatColor.r * 0.9}, ${hatColor.g * 0.9}, ${hatColor.b * 0.9})`;
    ctx.beginPath();
    ctx.ellipse(30, bounce - 30, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Orelhas
    ctx.fillStyle = `rgb(${headColor.r}, ${headColor.g}, ${headColor.b})`;
    ctx.beginPath();
    ctx.ellipse(35, bounce - 15, 8, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(38, bounce - 18, 8, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Olho
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(30, bounce - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bigode
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, bounce);
    ctx.lineTo(45, bounce - 3);
    ctx.moveTo(28, bounce + 3);
    ctx.lineTo(45, bounce + 3);
    ctx.stroke();
    
    // Pernas animadas
    const legOffset = Math.sin(this.animationFrame) * 10;
    ctx.fillStyle = `rgb(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b})`;
    ctx.fillRect(-10, bounce + 15, 6, 12 + legOffset);
    ctx.fillRect(-20, bounce + 15, 6, 12 - legOffset);
    
    // Cauda
    ctx.strokeStyle = `rgb(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, bounce);
    ctx.quadraticCurveTo(-45, bounce - 10, -40, bounce - 20);
    ctx.stroke();
    
    ctx.restore();
  }
  
  containsPoint(worldX, worldY) {
    const dx = worldX - this.x;
    const dy = worldY - this.y;
    return Math.sqrt(dx * dx + dy * dy) < 40;
  }
  
  catch() {
    this.caught = true;
  }
  
  reset(worldWidth, worldHeight) {
    this.x = 200;
    this.y = worldHeight / 2;
    this.vx = 3;
    this.vy = 0;
    this.targetX = Math.random() * worldWidth;
    this.targetY = Math.random() * worldHeight;
    this.caught = false;
    this.animationFrame = 0;
  }
}