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
  // Enable collision events for this collider.
  enemyCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  
  // Tag the enemy body for collision handling.
  enemyBody.userData = { type: "enemy" };

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
  const squidCollider = physicsWorld.createCollider(squidColliderDesc, squidBody);
  // Enable collision events.
  squidCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  
  squidBody.setLinearDamping(2);

  // Custom properties for squid behavior.
  squidBody.isSquid = true;
  squidBody.nextMoveTime = 0;
  squidBody.targetAngle = squidBody.rotation();

  // Tag the squid for collision handling.
  squidBody.userData = { type: "squid" };

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

/**
 * Spawns a triangle enemy at a random location away from the player.
 * This enemy is triangular shaped, moves toward the player with its point forward,
 * and is slightly faster than the player.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the triangle size.
 * @param {Array} params.triangleEnemies
 */
export function spawnTriangleEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, triangleEnemies }) {
  let x, y;
  const playerPos = playerBody.translation();
  do {
    x = Math.random() * (worldWidth - 100) + 50;
    y = Math.random() * (worldHeight - 100) + 50;
  } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 500);

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
  const triBody = physicsWorld.createRigidBody(bodyDesc);
  
  const colliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  const triCollider = physicsWorld.createCollider(colliderDesc, triBody);
  // Enable collision events.
  triCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  // Tag the triangle enemy for collision handling.
  triBody.userData = { type: "triangle" };

  // Set initial velocity: move toward the player.
  const pos = triBody.translation();
  const playerPos2 = playerBody.translation();
  const dx = playerPos2.x - pos.x;
  const dy = playerPos2.y - pos.y;
  const angle = Math.atan2(dy, dx);
  const speed = 0; // You can adjust this as needed.
  triBody.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  // Set rotation to face the movement direction.
  triBody.setRotation(angle, true);

  triangleEnemies.push(triBody);
}

/**
 * Updates triangle enemy movement so that each enemy continuously
 * moves toward the player ship with its tip forward.
 * @param {Array} triangleEnemies
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} dt - Delta time in seconds.
 */
export function updateTriangleEnemies(triangleEnemies, playerBody, dt) {
  const speed = 250; // Slightly faster than player.
  triangleEnemies.forEach(tri => {
    const pos = tri.translation();
    const playerPos = playerBody.translation();
    const dx = playerPos.x - pos.x;
    const dy = playerPos.y - pos.y;
    const angle = Math.atan2(dy, dx);
    tri.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    tri.setRotation(angle, true);
  });
}
