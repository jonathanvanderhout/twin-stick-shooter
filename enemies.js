import * as RAPIER from "https://cdn.skypack.dev/@dimforge/rapier2d-compat";

// Helper to normalize an angle between -π and π.
function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Spawns a regular enemy (type "enemy") at a random location away from the player.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius
 * @param {Array} params.enemies - Unified enemy array.
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
  enemyCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  
  // Tag the enemy for collision handling.
  enemyBody.userData = { type: "enemy" };

  const angle = Math.random() * Math.PI * 2;
  const speed = 100;
  enemyBody.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  enemyBody.oscillationPhase = Math.random() * Math.PI * 2;

  enemies.push(enemyBody);
}

/**
 * Spawns a squid enemy (type "squid") at a random location away from the player.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the squid's radius.
 * @param {Array} params.enemies - Unified enemy array.
 */
export function spawnSquid({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
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
  squidCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  
  squidBody.setLinearDamping(2);
  squidBody.isSquid = true;
  squidBody.nextMoveTime = 0;
  squidBody.targetAngle = squidBody.rotation();
  squidBody.userData = { type: "squid" };

  enemies.push(squidBody);
}

/**
 * Spawns a triangle enemy (type "triangle") at a random location away from the player.
 * This enemy moves toward the player with its tip forward.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the triangle size.
 * @param {Array} params.enemies - Unified enemy array.
 */
export function spawnTriangleEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
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
  triCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  triBody.userData = { type: "triangle" };

  const pos = triBody.translation();
  const playerPos2 = playerBody.translation();
  const dx = playerPos2.x - pos.x;
  const dy = playerPos2.y - pos.y;
  const angle = Math.atan2(dy, dx);
  const speed = 0; // Adjust as needed.
  triBody.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  triBody.setRotation(angle, true);

  enemies.push(triBody);
}

/**
 * Spawns a basic enemy (type "boring") at a random location away from the player.
 * This enemy remains stationary.
 * @param {Object} params
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius
 * @param {Array} params.enemies - Unified enemy array.
 */
export function spawnBasicEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
  let x, y;
  const playerPos = playerBody.translation();
  do {
    x = Math.random() * (worldWidth - 100) + 50;
    y = Math.random() * (worldHeight - 100) + 50;
  } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 500);

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
  const boringEnemy = physicsWorld.createRigidBody(bodyDesc);
  
  const colliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  const collider = physicsWorld.createCollider(colliderDesc, boringEnemy);
  
  collider.setRestitution(0);
  collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  
  boringEnemy.userData = { type: "boring" };

  boringEnemy.setLinvel({ x: 0, y: 0 }, true);

  enemies.push(boringEnemy);
}

/**
 * Generic function for spawning an enemy of a given type.
 * @param {Object} params
 * @param {string} params.type - "normal", "squid", "triangle", or "boring"
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius
 * @param {Array} params.enemies - Unified enemy array.
 */
export function spawnGenericEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
  if (type === "normal") {
    spawnEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies });
  } else if (type === "squid") {
    spawnSquid({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies });
  } else if (type === "triangle") {
    spawnTriangleEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies });
  } else if (type === "boring") {
    spawnBasicEnemy({ physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies });
  } else {
    console.error("Unknown enemy type:", type);
  }
}

/* --- New Per-Enemy Update Functions --- */

/**
 * Updates a regular enemy (type "enemy").
 * For a boring enemy (type "boring"), no update is performed.
 * @param {RAPIER.RigidBody} enemy
 */
export function updateRegularEnemy(enemy) {
  if (enemy.userData.type !== "enemy") return;
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
}

/**
 * Updates a squid enemy (type "squid").
 * @param {RAPIER.RigidBody} squid
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime
 * @param {number} dt - Delta time in seconds.
 */
export function updateSquid(squid, playerBody, currentTime, dt) {
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
}

/**
 * Updates a triangle enemy (type "triangle").
 * @param {RAPIER.RigidBody} tri
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} dt - Delta time in seconds.
 */
export function updateTriangleEnemy(tri, playerBody, dt) {
  const speed = 250;
  const pos = tri.translation();
  const playerPos = playerBody.translation();
  const dx = playerPos.x - pos.x;
  const dy = playerPos.y - pos.y;
  const angle = Math.atan2(dy, dx);
  tri.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  tri.setRotation(angle, true);
}

/**
 * Updates a basic enemy (type "boring").
 * @param {RAPIER.RigidBody} enemy
 */
export function updateBasicEnemy(enemy) {
  // Basic enemy remains stationary; no update required.
}

/**
 * Updates all enemies in a single pass by checking their type.
 * @param {Array} enemies - Unified enemy array.
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime
 * @param {number} dt - Delta time in seconds.
 */
export function updateAllEnemies(enemies, playerBody, currentTime, dt) {
  enemies.forEach(enemy => {
    const type = enemy.userData.type;
    if (type === "enemy") {
      updateRegularEnemy(enemy);
    } else if (type === "squid") {
      updateSquid(enemy, playerBody, currentTime, dt);
    } else if (type === "triangle") {
      updateTriangleEnemy(enemy, playerBody, dt);
    } else if (type === "boring") {
      updateBasicEnemy(enemy);
    }
  });
}
