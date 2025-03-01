// damageEffect.js

// Array to hold active damage explosion effects
const damageExplosions = [];

// Preload damage sound
const damageSound = new Audio("mixkit-arcade-mechanical-bling-210.wav"); // Replace with your damage sound

// Damage effect configuration
const DAMAGE_PARTICLE_COUNT = 25;
const MIN_RADIUS = 4;  // Larger minimum size
const MAX_RADIUS = 15; // Larger maximum size
const EXPLOSION_DURATION = 1000; // Slightly faster than bubbles
const MAX_DISTANCE = 100;

/**
 * Starts a damage explosion animation at the given world coordinates.
 * Also plays the damage sound.
 * @param {number} x - The x-coordinate (in world space) where the explosion should occur.
 * @param {number} y - The y-coordinate (in world space) where the explosion should occur.
 */
export function startDamageExplosion(x, y) {
  const particles = [];
  
  // Create multiple damage particles with random properties
  for (let i = 0; i < DAMAGE_PARTICLE_COUNT; i++) {
    // Random angle for direction
    const angle = Math.random() * Math.PI * 2;
    
    // Random initial speed and size - faster than bubbles
    const speed = 2 + Math.random() * 4;
    const maxSize = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
    
    particles.push({
      x: x,
      y: y,
      angle: angle,
      speed: speed,
      radius: 1, // Start small but bigger than bubbles
      maxRadius: maxSize,
      opacity: 0.9 + Math.random() * 0.1, // More opaque
      distance: 0,
      maxDistance: MAX_DISTANCE * (0.4 + Math.random() * 0.6),
      wobble: {
        amplitude: Math.random() * 3, // More aggressive wobble
        frequency: 0.08 + Math.random() * 0.12,
        offset: Math.random() * Math.PI * 2
      }
    });
  }
  
  damageExplosions.push({
    x: x,
    y: y,
    particles: particles,
    startTime: performance.now(),
    duration: EXPLOSION_DURATION
  });

  // Play damage sound
  const soundClone = damageSound.cloneNode();
  soundClone.volume = 0.2; // Slightly louder than bubbles
  soundClone.play();
}

/**
 * Updates and draws all active damage explosion effects on the provided canvas context.
 * This function converts each explosion's world position to screen coordinates using the
 * provided camera scale and origin.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} scale - The current camera scale.
 * @param {Object} origin - The current camera origin with properties { x, y }.
 */
export function updateDamageExplosions(ctx, scale, origin) {
  const now = performance.now();
  
  // Save current transform
  ctx.save();
  // Apply the same transformation as the game world
  ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);
  
  // Iterate backwards to safely remove finished explosions
  for (let i = damageExplosions.length - 1; i >= 0; i--) {
    const explosion = damageExplosions[i];
    const elapsed = now - explosion.startTime;
    
    if (elapsed >= explosion.duration) {
      // Remove finished explosion
      damageExplosions.splice(i, 1);
      continue;
    }
    
    const progress = elapsed / explosion.duration;
    
    // Update and draw each damage particle
    explosion.particles.forEach(particle => {
      // Calculate current particle properties based on progress
      
      // Update particle position with wobble effect
      const wobbleX = Math.sin(elapsed * particle.wobble.frequency + particle.wobble.offset) * particle.wobble.amplitude;
      const wobbleY = Math.cos(elapsed * particle.wobble.frequency + particle.wobble.offset * 0.7) * particle.wobble.amplitude;
      
      // Move particle outward with decreasing speed over time - more aggressive initial movement
      const currentSpeed = particle.speed * (1 - progress * 0.5);
      
      if (particle.distance < particle.maxDistance) {
        particle.distance += currentSpeed;
        
        particle.x = explosion.x + Math.cos(particle.angle) * particle.distance + wobbleX;
        particle.y = explosion.y + Math.sin(particle.angle) * particle.distance + wobbleY;
      } else {
        // Just apply wobble when max distance is reached
        particle.x = explosion.x + Math.cos(particle.angle) * particle.distance + wobbleX;
        particle.y = explosion.y + Math.sin(particle.angle) * particle.distance + wobbleY;
      }
      
      // Grow particle to its max size quickly, then start shrinking
      if (progress < 0.4) {
        // Growth phase - faster than bubbles
        particle.radius = Math.min(particle.radius + 0.3, particle.maxRadius);
      } else {
        // Shrink phase
        const shrinkProgress = (progress - 0.4) / 0.6;
        particle.radius = particle.maxRadius * (1 - shrinkProgress);
      }
      
      // Reduce opacity over time
      particle.opacity = 0.9 * (1 - progress * 0.7);
      
      // Draw the damage particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      
      // Create gradient for a fiery damage look with reds and oranges
      const gradient = ctx.createRadialGradient(
        particle.x - particle.radius * 0.3, particle.y - particle.radius * 0.3, particle.radius * 0.1,
        particle.x, particle.y, particle.radius
      );
      
      // More "dangerous" looking color scheme
      gradient.addColorStop(0, `rgba(255, 255, 220, ${particle.opacity})`); // Bright center
      gradient.addColorStop(0.3, `rgba(255, 150, 50, ${particle.opacity * 0.9})`); // Orange
      gradient.addColorStop(0.7, `rgba(255, 50, 50, ${particle.opacity * 0.8})`); // Red
      gradient.addColorStop(1, `rgba(150, 0, 0, ${particle.opacity * 0.5})`); // Dark red edge
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add highlight to make particles more intense
      ctx.beginPath();
      ctx.arc(particle.x - particle.radius * 0.2, particle.y - particle.radius * 0.2, particle.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 220, ${particle.opacity * 0.8})`;
      ctx.fill();
    });
  }
  
  // Restore the transform
  ctx.restore();
}