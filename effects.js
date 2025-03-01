// effects.js

// Array to hold active explosion effects.
const explosions = [];

// Preload explosion sound
const explosionSound = new Audio("mixkit-water-bubble-1317.wav"); // Ensure this file exists

/**
 * Starts an explosion animation at the given world coordinates.
 * Also plays the explosion sound.
 * @param {number} x - The x-coordinate (in world space) where the explosion should occur.
 * @param {number} y - The y-coordinate (in world space) where the explosion should occur.
 */
export function startExplosion(x, y) {
  explosions.push({
    x, // world coordinate
    y, // world coordinate
    startTime: performance.now(),
    duration: 500, // Duration in milliseconds.
    maxRadius: 50  // Maximum explosion radius.
  });

  // Play explosion sound (cloning allows overlapping sounds)
  const soundClone = explosionSound.cloneNode();
  soundClone.volume = 0.7; // Adjust volume as needed
  soundClone.play();
}

/**
 * Updates and draws all active explosion effects on the provided canvas context.
 * This function converts each explosion’s world position to screen coordinates using the
 * provided camera scale and origin.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} scale - The current camera scale.
 * @param {Object} origin - The current camera origin with properties { x, y }.
 */
export function updateExplosions(ctx, scale, origin) {
  const now = performance.now();

  // Save current transform so we can draw explosions in world space.
  ctx.save();
  // Apply the same transformation as the game world.
  ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);

  // Iterate over explosions backwards to safely remove finished ones.
  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    const elapsed = now - explosion.startTime;
    const progress = elapsed / explosion.duration;

    if (progress >= 1) {
      // Remove finished explosion.
      explosions.splice(i, 1);
      continue;
    }

    // Calculate explosion radius and opacity.
    const radius = progress * explosion.maxRadius;
    const opacity = 1 - progress;

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 100, 0, ${opacity})`;
    ctx.fill();
  }

  // Restore the transform so further drawing uses the correct coordinate system.
  ctx.restore();
}
