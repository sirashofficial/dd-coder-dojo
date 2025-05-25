class MatrixEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.drops = [];
    this.characters = '01';
    this.interval = 50;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Initial drops
    for (let i = 0; i < this.columns; i++) this.drops[i] = 1;
    
    // Start animation
    setInterval(() => this.draw(), this.interval);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / 20);
  }

  draw() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#06b6d4';
    this.ctx.font = '15px monospace';

    this.drops.forEach((drop, i) => {
      const char = this.characters.charAt(
        Math.floor(Math.random() * this.characters.length)
      );
      
      this.ctx.fillText(char, i * 20, drop * 20);
      
      if (drop * 20 > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new MatrixEffect('matrixCanvas');
});
