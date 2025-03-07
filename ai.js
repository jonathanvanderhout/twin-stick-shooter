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
 * @param {number} options.worldWidth - The game world width.
 * @param {number} options.worldHeight - The game world height.
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
    // Dash is disabled.
    setIsShooting,
    worldWidth,
    worldHeight
  } = options;

  const playerPos = playerBody.translation();

  // --- Find Closest Shootable Enemy ---
  let targetEnemy = null;
  let minDist = Infinity;
  const shootableTypes = new Set(["enemy", "squid", "triangle", "boring", "gunner"]);
  enemies.forEach(enemy => {
    if (!shootableTypes.has(enemy.userData.type)) return;
    const pos = enemy.translation();
    const d = Math.hypot(pos.x - playerPos.x, pos.y - playerPos.y);
    if (d < minDist) {
      minDist = d;
      targetEnemy = enemy;
    }
  });

  // --- Intelligent Enemy Bullet Avoidance ---
  let bulletList = enemies.filter(e => e.userData.type === "enemy_bullet");
  bulletList.sort((a, b) => {
    const posA = a.translation(), posB = b.translation();
    const dA = Math.hypot(posA.x - playerPos.x, posA.y - playerPos.y);
    const dB = Math.hypot(posB.x - playerPos.x, posB.y - playerPos.y);
    return dA - dB;
  });
  bulletList = bulletList.slice(0, 10);
  let bulletAvoidance = { x: 0, y: 0 };
  const predictTime = 0.5; // seconds ahead to predict
  let bulletCount = 0;
  bulletList.forEach(bullet => {
    const bPos = bullet.translation();
    const bVel = bullet.linvel();
    const predictedPos = {
      x: bPos.x + bVel.x * predictTime,
      y: bPos.y + bVel.y * predictTime
    };
    const diffX = playerPos.x - predictedPos.x;
    const diffY = playerPos.y - predictedPos.y;
    const d = Math.hypot(diffX, diffY);
    if (d > 0) {
      // Inverse-square weight
      bulletAvoidance.x += (diffX / d) / d;
      bulletAvoidance.y += (diffY / d) / d;
      bulletCount++;
    }
  });
  if (bulletCount > 0) {
    bulletAvoidance.x /= bulletCount;
    bulletAvoidance.y /= bulletCount;
    const mag = Math.hypot(bulletAvoidance.x, bulletAvoidance.y);
    if (mag > 0) {
      bulletAvoidance.x /= mag;
      bulletAvoidance.y /= mag;
    }
  }
  const bulletAvoidanceWeight = 20.0;

  // --- Wall Avoidance Vector ---
  let wallVector = { x: 0, y: 0 };
  const center = { x: worldWidth / 2, y: worldHeight / 2 };
  const toCenter = { x: playerPos.x - center.x, y: playerPos.y - center.y };
  const distFromCenter = Math.hypot(toCenter.x, toCenter.y);
  const desiredMinCenterDist = 300;
  if (distFromCenter < desiredMinCenterDist && distFromCenter > 0) {
    wallVector.x += (desiredMinCenterDist - distFromCenter) * (toCenter.x / distFromCenter);
    wallVector.y += (desiredMinCenterDist - distFromCenter) * (toCenter.y / distFromCenter);
  }
  const edgeThreshold = 100;
  if (playerPos.x < edgeThreshold) {
    wallVector.x += (edgeThreshold - playerPos.x);
  } else if (playerPos.x > worldWidth - edgeThreshold) {
    wallVector.x -= (playerPos.x - (worldWidth - edgeThreshold));
  }
  if (playerPos.y < edgeThreshold) {
    wallVector.y += (edgeThreshold - playerPos.y);
  } else if (playerPos.y > worldHeight - edgeThreshold) {
    wallVector.y -= (playerPos.y - (worldHeight - edgeThreshold));
  }
  const wallMag = Math.hypot(wallVector.x, wallVector.y);
  if (wallMag > 0) {
    wallVector.x /= wallMag;
    wallVector.y /= wallMag;
  }
  const wallWeight = 0.3;

  // --- Target Pursuit Vector ---
  let targetVector = { x: 0, y: 0 };
  if (targetEnemy) {
    const ePos = targetEnemy.translation();
    const eVel = targetEnemy.linvel();
    const dx = ePos.x - playerPos.x;
    const dy = ePos.y - playerPos.y;
    const distance = Math.hypot(dx, dy);
    const t = (distance / bulletSpeed) * aiLeadFactor;
    const predictedX = ePos.x + eVel.x * t;
    const predictedY = ePos.y + eVel.y * t;
    targetVector.x = predictedX - playerPos.x;
    targetVector.y = predictedY - playerPos.y;
    const targetMag = Math.hypot(targetVector.x, targetVector.y);
    if (targetMag > 0) {
      targetVector.x /= targetMag;
      targetVector.y /= targetMag;
    }
  }

  // --- Enemy Avoidance Vector (New) ---
  // If the target enemy is too close, push away to avoid collision.
  let enemyAvoidance = { x: 0, y: 0 };
  const enemyAvoidanceThreshold = 150; // if target is closer than this, avoid it
  if (targetEnemy && minDist < enemyAvoidanceThreshold) {
    const ePos = targetEnemy.translation();
    enemyAvoidance.x = playerPos.x - ePos.x;
    enemyAvoidance.y = playerPos.y - ePos.y;
    const enemyMag = Math.hypot(enemyAvoidance.x, enemyAvoidance.y);
    if (enemyMag > 0) {
      enemyAvoidance.x /= enemyMag;
      enemyAvoidance.y /= enemyMag;
    }
  }
  const enemyAvoidanceWeight = 10.0;

  // --- Combine Movement Influences ---
  // The final desired direction is the sum of:
  // • Target pursuit
  // • Intelligent bullet avoidance
  // • Wall avoidance
  // • Enemy avoidance (if target is too close)
  let desiredDirection = { x: 0, y: 0 };
  desiredDirection.x = targetVector.x +
                        bulletAvoidance.x * bulletAvoidanceWeight +
                        wallVector.x * wallWeight +
                        enemyAvoidance.x * enemyAvoidanceWeight;
  desiredDirection.y = targetVector.y +
                        bulletAvoidance.y * bulletAvoidanceWeight +
                        wallVector.y * wallWeight +
                        enemyAvoidance.y * enemyAvoidanceWeight;
  const desiredMag = Math.hypot(desiredDirection.x, desiredDirection.y);
  if (desiredMag > 0) {
    desiredDirection.x /= desiredMag;
    desiredDirection.y /= desiredMag;
  }

  // --- Quantize Movement to 8 Directions ---
  let angle = Math.atan2(desiredDirection.y, desiredDirection.x);
  const quantizedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  const quantizedDirection = { x: Math.cos(quantizedAngle), y: Math.sin(quantizedAngle) };

  // --- Apply Movement ---
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

  // --- Aiming: Only aim at a shootable enemy ---
  if (targetEnemy) {
    const ePos = targetEnemy.translation();
    const eVel = targetEnemy.linvel();
    const dx = ePos.x - playerPos.x;
    const dy = ePos.y - playerPos.y;
    const distance = Math.hypot(dx, dy);
    const t = (distance / bulletSpeed) * aiLeadFactor;
    const predictedX = ePos.x + eVel.x * t;
    const predictedY = ePos.y + eVel.y * t;
    const targetAngle = Math.atan2(predictedY - playerPos.y, predictedX - playerPos.x);
    const currentAngle = playerBody.rotation();
    const angleDiff = Math.atan2(Math.sin(targetAngle - currentAngle), Math.cos(targetAngle - currentAngle));
    const angularPushFactor = 10;
    playerBody.setAngvel(angleDiff * angularPushFactor, true);
  }

  // --- Always Shoot when AI is Active ---
  setIsShooting(true);
}
