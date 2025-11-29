export class SceneRenderer {
  constructor(ctx, worldWidth, worldHeight) {
    this.ctx = ctx;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }
  
  drawBackground(camera) {
    const ctx = this.ctx;
    const screenHeight = camera.viewHeight;
    const screenWidth = camera.viewWidth;
    
    // Gradiente de céu
    const grad = ctx.createLinearGradient(0, 0, 0, screenHeight);
    grad.addColorStop(0, '#87CEEB');
    grad.addColorStop(1, '#F0E68C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    
    // Grid de referência
    this.drawGrid(camera);
    
    // Montanhas de fundo (com parallax)
    this.drawMountains(camera);
    
    // Cactos decorativos
    this.drawCacti(camera);
  }
  
  drawGrid(camera) {
    const ctx = this.ctx;
    const gridSize = 100;
    const startX = Math.floor(camera.x / gridSize) * gridSize;
    const startY = Math.floor(camera.y / gridSize) * gridSize;
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = startX; x < camera.x + camera.viewWidth; x += gridSize) {
      const screenX = x - camera.x;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, camera.viewHeight);
      ctx.stroke();
    }
    
    for (let y = startY; y < camera.y + camera.viewHeight; y += gridSize) {
      const screenY = y - camera.y;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(camera.viewWidth, screenY);
      ctx.stroke();
    }
  }
  
  drawMountains(camera) {
    const ctx = this.ctx;

    // Ajuste aqui para aumentar ou diminuir
    const mountainWidth = 500;   // antes era 200
    const mountainHeight = 600;  // antes era 150

    ctx.fillStyle = 'rgba(139, 90, 43, 0.3)';

    for (let i = 0; i < 5; i++) {
      const worldX = i * 500;         // distância entre montanhas
      const worldY = this.worldHeight - 50;

      const screen = camera.worldToScreen(worldX, worldY);

      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);                                    // base esquerda
      ctx.lineTo(screen.x + mountainWidth / 2, screen.y - mountainHeight); // topo
      ctx.lineTo(screen.x + mountainWidth, screen.y);                    // base direita
      ctx.fill();
    }
  }


  
  drawCacti(camera) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(34, 139, 34, 0.6)';
    
    for (let i = 0; i < 20; i++) {
      const worldX = (i * 150 + 50) % this.worldWidth;
      const worldY = this.worldHeight - 100;
      
      if (camera.isVisible(worldX, worldY, 50)) {
        const screen = camera.worldToScreen(worldX, worldY);
        
        // Corpo do cacto
        ctx.fillRect(screen.x, screen.y, 20, 60);
        // Braços
        ctx.fillRect(screen.x - 15, screen.y + 20, 15, 20);
        ctx.fillRect(screen.x + 20, screen.y + 15, 15, 25);
      }
    }
  }
}