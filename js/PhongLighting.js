import { VectorMath } from './VectorMath.js';

export const PhongLighting = {
  calculate(baseColor, normal, lightDir, viewDir, light) {
    const ambient = light.ambient;
    const N = VectorMath.normalize(normal);
    const L = VectorMath.normalize(lightDir);
    const V = VectorMath.normalize(viewDir);
    
    // Componente difusa (Lambertian)
    const NdotL = Math.max(0, VectorMath.dot(N, L));
    const diffuse = NdotL * light.diffuse;
    
    // Componente especular (Blinn-Phong)
    const H = VectorMath.normalize(VectorMath.add(L, V));
    const NdotH = Math.max(0, VectorMath.dot(N, H));
    const specular = Math.pow(NdotH, light.shininess) * light.specular;
    
    // Combinar todas as componentes
    const intensity = ambient + diffuse + specular;
    
    return {
      r: Math.min(255, baseColor.r * intensity * light.color.r),
      g: Math.min(255, baseColor.g * intensity * light.color.g),
      b: Math.min(255, baseColor.b * intensity * light.color.b)
    };
  }
};