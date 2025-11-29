import { Camera } from './Camera.js';
import { SpeedyGonzales } from './Ligeirinho.js';
import { SceneRenderer } from './SceneRenderer.js';

class Application {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Constantes do mundo
    this.SCREEN_WIDTH = 800;
    this.SCREEN_HEIGHT = 600;
    this.WORLD_WIDTH = 1600;
    this.WORLD_HEIGHT = 1200;
    
    // Configurar canvas
    this.canvas.width = this.SCREEN_WIDTH;
    this.canvas.height = this.SCREEN_HEIGHT;
    
    // Inicializar componentes
    this.camera = new Camera(
      this.SCREEN_WIDTH, 
      this.SCREEN_HEIGHT, 
      this.WORLD_WIDTH, 
      this.WORLD_HEIGHT
    );
    
    this.speedy = new SpeedyGonzales(this.WORLD_WIDTH, this.WORLD_HEIGHT);
    this.renderer = new SceneRenderer(this.ctx, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    
    // Configuração de iluminação
    this.light = {
      direction: { x: -0.5, y: -0.5, z: -1 },
      color: { r: 1, g: 1, b: 0.9 },
      ambient: 0.3,
      diffuse: 0.6,
      specular: 0.3,
      shininess: 32
    };
    
    // Estado da aplicação
    this.keys = {};
    this.fps = 0;
    this.frameCount = 0;
    this.fpsTime = 0;
    this.lastTime = 0;
    this.controlsVisible = true;
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Iniciar animação
    this.animate(0);
  }
  
  setupEventListeners() {
    // Teclado — USAR SOMENTE event.code
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;

      // Reset com R
      if (e.code === 'KeyR') {
        this.resetSpeedy();
      }
    });
    
    // Mouse - capturar Speedy
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldX = screenX + this.camera.x;
      const worldY = screenY + this.camera.y;
      
      if (this.speedy.containsPoint(worldX, worldY)) {
        this.speedy.catch();
        this.showCatchModal();
      }
    });
    
    // Botão de reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSpeedy();
      });
    }
  }
  
  showCatchModal() {
    const modal = document.getElementById('catchModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }
  
  hideCatchModal() {
    const modal = document.getElementById('catchModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  resetSpeedy() {
    this.speedy.reset(this.WORLD_WIDTH, this.WORLD_HEIGHT);
    this.hideCatchModal();
  }
  
  update() {
    // Atualizar Speedy
    this.speedy.update();
    
    // Controles da câmera
    const moveSpeed = 10;

    // Arrow keys
    if (this.keys['ArrowLeft']) this.camera.move(-moveSpeed, 0);
    if (this.keys['ArrowRight']) this.camera.move(moveSpeed, 0);
    if (this.keys['ArrowUp']) this.camera.move(0, -moveSpeed);
    if (this.keys['ArrowDown']) this.camera.move(0, moveSpeed);

    // WSAD (agora funciona!)
    if (this.keys['KeyA']) this.camera.move(-moveSpeed, 0);
    if (this.keys['KeyD']) this.camera.move(moveSpeed, 0);
    if (this.keys['KeyW']) this.camera.move(0, -moveSpeed);
    if (this.keys['KeyS']) this.camera.move(0, moveSpeed);
        
    // Seguir Speedy com F
    if (this.keys['KeyF']) {
      this.camera.setTarget(this.speedy.x, this.speedy.y);
    }
    
    // Atualizar câmera
    this.camera.update();
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    this.renderer.drawBackground(this.camera);
    this.speedy.draw(this.ctx, this.camera, this.light);
  }
  
  animate(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Calcular FPS
    this.frameCount++;
    this.fpsTime += deltaTime;
    if (this.fpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = 0;
    }
    
    // Atualizar e renderizar
    this.update();
    this.render();
    
    requestAnimationFrame((time) => this.animate(time));
  }
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new Application();
});
