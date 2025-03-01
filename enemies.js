import * as RAPIER from "https://cdn.skypack.dev/@dimforge/rapier2d-compat";

// Helper to normalize an angle between -π and π.
function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Spawns a regular enemy at a random location away from the player.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius
 * @param {Array} params.enemies
 */
export function spawnEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
  let x, y;
  const playerPos = playerBody.translation();

  do {
    x = Math.random() * (worldWidth - 100) + 50;
    y = Math.random() * (worldHeight - 100) + 50;
  } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 500);

  const enemyBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
  const enemyBody = physicsWorld.createRigidBody(enemyBodyDesc);
  const enemyColliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  const enemyCollider = physicsWorld.createCollider(enemyColliderDesc, enemyBody);
  enemyCollider.setRestitution(0.8);

  const angle = Math.random() * Math.PI * 2;
  const speed = 100;
  enemyBody.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  enemyBody.oscillationPhase = Math.random() * Math.PI * 2;

  enemies.push(enemyBody);
}

/**
 * Updates enemy movement by applying oscillating velocity.
 * @param {Array} enemies
 */
export function updateEnemies(enemies) {
  enemies.forEach(enemy => {
    const vel = enemy.linvel();
    let speed = Math.hypot(vel.x, vel.y);
    if (speed > 0) {
      const currentAngle = Math.atan2(vel.y, vel.x);
      enemy.oscillationPhase += 0.5;
      const oscillation = Math.sin(enemy.oscillationPhase) * 0.2;
      const newAngle = currentAngle + oscillation;
      speed = 100;
      enemy.setLinvel({ x: Math.cos(newAngle) * speed, y: Math.sin(newAngle) * speed }, true);
    }
  });
}

/**
 * Spawns a squid enemy at a random location away from the player.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the squid's radius.
 * @param {Array} params.squids
 */
export function spawnSquid({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, squids }) {
  let x, y;
  const playerPos = playerBody.translation();
  do {
    x = Math.random() * (worldWidth - 100) + 50;
    y = Math.random() * (worldHeight - 100) + 50;
  } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 500);

  const squidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
  const squidBody = physicsWorld.createRigidBody(squidBodyDesc);
  const squidColliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  physicsWorld.createCollider(squidColliderDesc, squidBody);
  squidBody.setLinearDamping(2);

  // Custom properties for squid behavior.
  squidBody.isSquid = true;
  squidBody.nextMoveTime = 0;
  squidBody.targetAngle = squidBody.rotation();

  squids.push(squidBody);
}

/**
 * Updates squid movement. If a squid’s speed is low, it will rotate toward a target
 * angle (a blend between a random angle and the angle toward the player) and then get propelled.
 * @param {Array} squids
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime
 * @param {number} dt - Delta time in seconds.
 */
export function updateSquids(squids, playerBody, currentTime, dt) {
  squids.forEach(squid => {
    squid.setAngvel(0, true);
    const sqVel = squid.linvel();
    const speed = Math.hypot(sqVel.x, sqVel.y);

    if (speed < 20) {
      if (!squid.nextMoveTime || squid.nextMoveTime === 0) {
        const squidPos = squid.translation();
        const playerPos = playerBody.translation();
        const angleToPlayer = Math.atan2(playerPos.y - squidPos.y, playerPos.x - squidPos.x);
        const randomAngle = Math.random() * Math.PI * 2;
        const bias = 0.7;
        squid.targetAngle = randomAngle + normalizeAngle(angleToPlayer - randomAngle) * bias;
        squid.nextMoveTime = currentTime + 500;
      }
      if (currentTime < squid.nextMoveTime) {
        const currentAngle = squid.rotation();
        let angleDiff = normalizeAngle(squid.targetAngle - currentAngle);
        const rotationSpeed = 5;
        const maxRotation = rotationSpeed * dt;
        const newAngle = (Math.abs(angleDiff) > maxRotation)
          ? currentAngle + Math.sign(angleDiff) * maxRotation
          : squid.targetAngle;
        squid.setRotation(newAngle, true);
      }
      if (currentTime >= squid.nextMoveTime) {
        const squidSpeed = 500;
        squid.setLinvel({
          x: Math.cos(squid.targetAngle) * squidSpeed,
          y: Math.sin(squid.targetAngle) * squidSpeed
        }, true);
        squid.nextMoveTime = 0;
      }
    }
  });
}
