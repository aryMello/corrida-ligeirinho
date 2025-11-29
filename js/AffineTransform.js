export const AffineTransform = {
  // Criar matriz de translação
  translate(x, y) {
    return [
      [1, 0, x],
      [0, 1, y],
      [0, 0, 1]
    ];
  },
  
  // Criar matriz de rotação
  rotate(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1]
    ];
  },
  
  // Criar matriz de escala
  scale(sx, sy) {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1]
    ];
  },
  
  // Multiplicar duas matrizes 3x3
  multiply(m1, m2) {
    const result = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          result[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }
    
    return result;
  },
  
  // Aplicar transformação a um ponto
  applyToPoint(matrix, point) {
    const x = matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2];
    const y = matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2];
    return { x, y };
  },
  
  // Compor múltiplas transformações
  compose(...transforms) {
    return transforms.reduce(
      (acc, t) => this.multiply(acc, t),
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    );
  }
};