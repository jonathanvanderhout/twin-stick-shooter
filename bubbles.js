// bubbles.js

// Array to hold active bubble explosion effects
const bubbleExplosions = [];

// Preload bubble sound
const bubbleSound = new Audio("mixkit-water-bubble-1317.wav"); // Using your existing sound

// Bubble configuration
const BUBBLE_COUNT = 20;
const MIN_RADIUS = 2;
const MAX_RADIUS = 8;
const EXPLOSION_DURATION = 1200;
const MAX_DISTANCE = 80;

/**
 * Starts a bubble explosion animation at the given world coordinates.
 * Also plays the bubble sound.
 * @param {number} x - The x-coordinate (in world space) where the explosion should occur.
 * @param {number} y - The y-coordinate (in world space) where the explosion should occur.
 */
export function startBubbleExplosion(x, y) {
  const bubbles = [];
  
  // Create multiple bubbles with random properties
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    // Random angle for direction
    const angle = Math.random() * Math.PI * 2;
    
    // Random initial speed and size
    const speed = 1 + Math.random() * 3;
    const maxSize = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
    
    bubbles.push({
      x: x,
      y: y,
      angle: angle,
      speed: speed,
      radius: 0.5, // Start small
      maxRadius: maxSize,
      opacity: 0.8 + Math.random() * 0.2,
      distance: 0,
      maxDistance: MAX_DISTANCE * (0.3 + Math.random() * 0.7),
      wobble: {
        amplitude: Math.random() * 2,
        frequency: 0.05 + Math.random() * 0.1,
        offset: Math.random() * Math.PI * 2
      }
    });
  }
  
  bubbleExplosions.push({
    x: x,
    y: y,
    bubbles: bubbles,
    startTime: performance.now(),
    duration: EXPLOSION_DURATION
  });

  // Play bubble sound (cloning allows overlapping sounds)
  const soundClone = bubbleSound.cloneNode();
  soundClone.volume = 0.7; // Adjust volume as needed
  soundClone.play();
}

/**
 * Updates and draws all active bubble explosion effects on the provided canvas context.
 * This function converts each explosion's world position to screen coordinates using the
 * provided camera scale and origin.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} scale - The current camera scale.
 * @param {Object} origin - The current camera origin with properties { x, y }.
 */
export function updateBubbleExplosions(ctx, scale, origin) {
  const now = performance.now();
  
  // Save current transform so we can draw explosions in world space.
  ctx.save();
  // Apply the same transformation as the game world.
  ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);
  
  // Iterate backwards to safely remove finished explosions
  for (let i = bubbleExplosions.length - 1; i >= 0; i--) {
    const explosion = bubbleExplosions[i];
    const elapsed = now - explosion.startTime;
    
    if (elapsed >= explosion.duration) {
      // Remove finished explosion
      bubbleExplosions.splice(i, 1);
      continue;
    }
    
    const progress = elapsed / explosion.duration;
    
    // Update and draw each bubble
    explosion.bubbles.forEach(bubble => {
      // Calculate current bubble properties based on progress
      
      // Update bubble position with wobble effect
      const wobbleX = Math.sin(elapsed * bubble.wobble.frequency + bubble.wobble.offset) * bubble.wobble.amplitude;
      const wobbleY = Math.cos(elapsed * bubble.wobble.frequency + bubble.wobble.offset * 0.7) * bubble.wobble.amplitude;
      
      // Move bubble outward with decreasing speed over time
      const currentSpeed = bubble.speed * (1 - progress * 0.7);
      
      if (bubble.distance < bubble.maxDistance) {
        bubble.distance += currentSpeed;
        
        bubble.x = explosion.x + Math.cos(bubble.angle) * bubble.distance + wobbleX;
        bubble.y = explosion.y + Math.sin(bubble.angle) * bubble.distance + wobbleY - (bubble.distance * 0.2); // Slight upward bias
      } else {
        // Just apply wobble and upward drift when max distance is reached
        bubble.x = explosion.x + Math.cos(bubble.angle) * bubble.distance + wobbleX;
        bubble.y = explosion.y + Math.sin(bubble.angle) * bubble.distance + wobbleY - (elapsed * 0.02); // Slight upward drift
      }
      
      // Grow bubble to its max size, then start shrinking near the end
      if (progress < 0.7) {
        // Growth phase
        bubble.radius = Math.min(bubble.radius + 0.1, bubble.maxRadius);
      } else {
        // Shrink phase
        const shrinkProgress = (progress - 0.7) / 0.3;
        bubble.radius = bubble.maxRadius * (1 - shrinkProgress);
      }
      
      // Reduce opacity over time
      bubble.opacity = bubble.opacity * (1 - progress * 0.3);
      
      // Draw the bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      
      // Create gradient for more realistic bubble look
      const gradient = ctx.createRadialGradient(
        bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.1,
        bubble.x, bubble.y, bubble.radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity})`);
      gradient.addColorStop(0.2, `rgba(200, 230, 255, ${bubble.opacity * 0.9})`);
      gradient.addColorStop(1, `rgba(150, 200, 255, ${bubble.opacity * 0.6})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add highlight to make bubbles more realistic
      ctx.beginPath();
      ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.7})`;
      ctx.fill();
    });
  }
  
  // Restore the transform so further drawing uses the correct coordinate system.
  ctx.restore();
}