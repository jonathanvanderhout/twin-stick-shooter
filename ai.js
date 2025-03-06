// ai.js

/**
 * Runs the AI control logic.
 * @param {Object} options - All dependencies and state needed by the AI.
 * @param {number} options.dt - Delta time since last update.
 * @param {Object} options.playerBody - The player’s physics body.
 * @param {Array} options.enemies - Array of enemy physics bodies.
 * @param {number} options.bulletSpeed - The speed of bullets.
 * @param {number} options.aiLeadFactor - Factor to adjust enemy lead in aiming.
 * @param {number} options.maxPlayerSpeed - Maximum player movement speed.
 * @param {Function} options.getCameraScale - Function that returns the current camera scale.
 * @param {Function} options.getCameraOrigin - Function that returns the camera origin given a position and scale.
 * @param {number} options.lastMouseX - The last recorded mouse X coordinate.
 * @param {number} options.lastMouseY - The last recorded mouse Y coordinate.
 * @param {boolean} options.isDashing - Current dash state.
 * @param {boolean} options.dashTriggered - Whether a dash was triggered.
 * @param {Function} options.setIsDashing - Callback to update the dash state.
 * @param {Function} options.setDashTriggered - Callback to update the dash trigger flag.
 * @param {Function} options.setIsShooting - Callback to update the shooting flag.
 */
export function updateAI(options) {
    const {
      dt,
      playerBody,
      enemies,
      bulletSpeed,
      aiLeadFactor,
      maxPlayerSpeed,
      getCameraScale,
      getCameraOrigin,
      lastMouseX,
      lastMouseY,
      isDashing,
      dashTriggered,
      setIsDashing,
      setDashTriggered,
      setIsShooting,
    } = options;
  
    const playerPos = playerBody.translation();
  
    // --- Dash Logic (Overrides normal AI if triggered) ---
    if (dashTriggered) {
      setIsDashing(true);
      setTimeout(() => { setIsDashing(false); }, 1000);
      const scale = getCameraScale();
      const origin = getCameraOrigin(playerPos, scale);
      const worldMouseX = (lastMouseX - origin.x) / scale;
      const worldMouseY = (lastMouseY - origin.y) / scale;
      const dx = worldMouseX - playerPos.x;
      const dy = worldMouseY - playerPos.y;
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const normX = dx / len;
        const normY = dy / len;
        const dashSpeed = 5000;
        playerBody.setLinvel({ x: normX * dashSpeed, y: normY * dashSpeed }, true);
      }
      setDashTriggered(false);
      return;
    }
  
    // --- Find Closest Enemy ---
    let targetEnemy = null;
    let minDist = Infinity;
    enemies.forEach(enemy => {
      const enemyPos = enemy.translation();
      const dx = enemyPos.x - playerPos.x;
      const dy = enemyPos.y - playerPos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        minDist = dist;
        targetEnemy = enemy;
      }
    });
  
    // --- Movement Decision ---
    // Build a repulsion vector if enemies get too close.
    let repulsion = { x: 0, y: 0 };
    const safeDistance = 200; // Distance threshold for repulsion
    enemies.forEach(enemy => {
      const enemyPos = enemy.translation();
      const dx = enemyPos.x - playerPos.x;
      const dy = enemyPos.y - playerPos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < safeDistance) {
        const strength = (safeDistance - dist) / safeDistance;
        repulsion.x -= (dx / dist) * strength;
        repulsion.y -= (dy / dist) * strength;
      }
    });
    const repulsionMag = Math.hypot(repulsion.x, repulsion.y);
    if (repulsionMag > 0) {
      repulsion.x /= repulsionMag;
      repulsion.y /= repulsionMag;
    }
  
    let desiredDirection = { x: 0, y: 0 };
    if (repulsionMag > 0) {
      // When enemies are too close, move away.
      desiredDirection = repulsion;
    } else if (targetEnemy) {
      // Otherwise, aim toward the predicted position of the closest enemy.
      const enemyPos = targetEnemy.translation();
      const enemyVel = targetEnemy.linvel();
      const dx = enemyPos.x - playerPos.x;
      const dy = enemyPos.y - playerPos.y;
      const distance = Math.hypot(dx, dy);
      const t = (distance / bulletSpeed) * aiLeadFactor;
      const predictedX = enemyPos.x + enemyVel.x * t;
      const predictedY = enemyPos.y + enemyVel.y * t;
      const dirX = predictedX - playerPos.x;
      const dirY = predictedY - playerPos.y;
      const len = Math.hypot(dirX, dirY);
      if (len > 0) {
        desiredDirection.x = dirX / len;
        desiredDirection.y = dirY / len;
      }
    }
    
    // --- Quantize Movement to 8 Directions ---
    let angle = Math.atan2(desiredDirection.y, desiredDirection.x);
    const quantizedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    const quantizedDirection = { x: Math.cos(quantizedAngle), y: Math.sin(quantizedAngle) };
  
    // Smoothly adjust player velocity toward the target velocity.
    const targetVel = { 
      x: quantizedDirection.x * maxPlayerSpeed, 
      y: quantizedDirection.y * maxPlayerSpeed 
    };
    const currentVel = playerBody.linvel();
    const movementLerp = 0.2;
    const newVel = {
      x: currentVel.x + (targetVel.x - currentVel.x) * movementLerp,
      y: currentVel.y + (targetVel.y - currentVel.y) * movementLerp,
    };
    playerBody.setLinvel(newVel, true);
  
    // --- Aggressive Dash Trigger ---
    const dashThreshold = 25; // Dash when enemy is dangerously close.
    if (minDist < dashThreshold && !isDashing) {
      setDashTriggered(true);
    }
  
    // --- Aiming ---
    if (targetEnemy) {
      const enemyPos = targetEnemy.translation();
      const enemyVel = targetEnemy.linvel();
      const dx = enemyPos.x - playerPos.x;
      const dy = enemyPos.y - playerPos.y;
      const distance = Math.hypot(dx, dy);
      const t = (distance / bulletSpeed) * aiLeadFactor;
      const predictedX = enemyPos.x + enemyVel.x * t;
      const predictedY = enemyPos.y + enemyVel.y * t;
      const targetAngle = Math.atan2(predictedY - playerPos.y, predictedX - playerPos.x);
      const currentAngle = playerBody.rotation();
      const angleDiff = Math.atan2(Math.sin(targetAngle - currentAngle), Math.cos(targetAngle - currentAngle));
      const angularPushFactor = 10;
      playerBody.setAngvel(angleDiff * angularPushFactor, true);
    }
  
    // --- Always Shoot when AI is Active ---
    setIsShooting(true);
  }
  