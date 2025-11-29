export const VectorMath = {
  normalize(v) {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + (v.z || 0) * (v.z || 0));
    return len > 0 ? { x: v.x / len, y: v.y / len, z: (v.z || 0) / len } : v;
  },
  
  dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + (v1.z || 0) * (v2.z || 0);
  },
  
  scale(v, s) {
    return { x: v.x * s, y: v.y * s, z: (v.z || 0) * s };
  },
  
  add(v1, v2) {
    return { 
      x: v1.x + v2.x, 
      y: v1.y + v2.y, 
      z: (v1.z || 0) + (v2.z || 0) 
    };
  }
};