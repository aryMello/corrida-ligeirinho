export class Camera {
  constructor(viewWidth, viewHeight, worldWidth, worldHeight) {
    this.x = 0;
    this.y = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothness = 0.1;
  }
  
  setTarget(x, y) {
    this.targetX = Math.max(
      0, 
      Math.min(x - this.viewWidth / 2, this.worldWidth - this.viewWidth)
    );
    this.targetY = Math.max(
      0, 
      Math.min(y - this.viewHeight / 2, this.worldHeight - this.viewHeight)
    );
  }
  
  update() {
    // Interpolação suave para a posição alvo
    this.x += (this.targetX - this.x) * this.smoothness;
    this.y += (this.targetY - this.y) * this.smoothness;
  }
  
  move(dx, dy) {
    this.targetX = Math.max(
      0, 
      Math.min(this.targetX + dx, this.worldWidth - this.viewWidth)
    );
    this.targetY = Math.max(
      0, 
      Math.min(this.targetY + dy, this.worldHeight - this.viewHeight)
    );
  }
  
  worldToScreen(worldX, worldY) {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }
  
  isVisible(worldX, worldY, margin = 100) {
    const screen = this.worldToScreen(worldX, worldY);
    return screen.x > -margin && 
           screen.x < this.viewWidth + margin &&
           screen.y > -margin && 
           screen.y < this.viewHeight + margin;
  }
}