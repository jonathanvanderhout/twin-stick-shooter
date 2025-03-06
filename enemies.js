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

/**
 * Creates an enemy of the given type at a random location away from the player.
 * Type-specific properties are applied using a mapping of functions.
 * @param {Object} params
 * @param {string} params.type - "enemy", "squid", "triangle", or "boring"
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the enemy's size.
 * @returns {RAPIER.RigidBody|null} The newly created enemy body, or null if type is unknown.
 */
function createEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius }) {
  // Choose a random spawn location at least 500 units away from the player.
  let x, y;
  const playerPos = playerBody.translation();
  do {
    x = Math.random() * (worldWidth - 100) + 50;
    y = Math.random() * (worldHeight - 100) + 50;
  } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 500);

  // Create the enemy body and collider.
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
  const body = physicsWorld.createRigidBody(bodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  const collider = physicsWorld.createCollider(colliderDesc, body);
  collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  // Mapping of type-specific configuration functions.
  const typeConfig = {
    normal: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "enemy" };
      const angle = Math.random() * Math.PI * 2;
      const speed = 100;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
      body.oscillationPhase = Math.random() * Math.PI * 2;
    },
    squid: (body) => {
      body.userData = { type: "squid" };
      body.setLinearDamping(2);
      body.isSquid = true;
      body.nextMoveTime = 0;
      body.targetAngle = body.rotation();
    },
    triangle: (body) => {
      body.userData = { type: "triangle" };
      const pos = body.translation();
      const playerPos2 = playerBody.translation();
      const dx = playerPos2.x - pos.x;
      const dy = playerPos2.y - pos.y;
      const angle = Math.atan2(dy, dx);
      const speed = 0; // Adjust as needed.
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
      body.setRotation(angle, true);
    },
    boring: (body, collider) => {
      collider.setRestitution(0);
      body.userData = { type: "boring" };
      body.setLinvel({ x: 0, y: 0 }, true);
    },
    enemy_bullet: (body, collider) => {
      // For bullet enemies, enforce a small radius (5) and a fast movement.
      collider.setRestitution(0.8);
      body.userData = { type: "enemy_bullet" };
      const angle = Math.random() * Math.PI * 2;
      const bulletSpeed = 800; // Bullet speed, adjust as needed.
      body.setLinvel({ x: Math.cos(angle) * bulletSpeed, y: Math.sin(angle) * bulletSpeed }, true);
    }
  };

  // Execute the type-specific configuration if available.
  if (typeConfig[type]) {
    typeConfig[type](body, collider);
  } else {
    console.error("Unknown enemy type:", type);
    return null;
  }
  return body;
}

/**
 * Spawns a generic enemy by type and pushes it into the unified enemy array.
 * @param {Object} params
 * @param {string} params.type - "enemy", "squid", "triangle", or "boring"
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the enemy's size.
 * @param {Array} params.enemies - Unified enemy array.
 */
export function spawnGenericEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies }) {
  const enemy = createEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius });
  enemies.push(enemy);
}

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
    speed = 200;
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
* @param {Array} enemies - Unified enemy array.
* @param {RAPIER.RigidBody} playerBody
* @param {number} currentTime
* @param {number} dt - Delta time in seconds.
 * @param {RAPIER.World} params.physicsWorld

*/
export function updateAllEnemies(enemies, playerBody, currentTime, dt, physicsWorld) {
 // Process enemy bullets: if they've lived longer than 1 second, mark them for removal.
 for (let i = enemies.length - 1; i >= 0; i--) {
   const enemy = enemies[i];
   if (enemy.userData.type === "enemy_bullet") {
     // If for some reason birthTime isn't set, set it now.
     if (!enemy.birthTime) {
       enemy.birthTime = currentTime;
     }
     if (currentTime - enemy.birthTime > 5000) {
       enemy.userData.shouldRemove = true;
     }
   }
   if (enemy.userData.shouldRemove) {
    // Remove from the array.
    physicsWorld.removeRigidBody(enemy);
    enemies.splice(i, 1);
    continue;
  }
 }

 // Update remaining enemies by type.
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
   // For enemy_bullet, no additional update is needed since they move like player bullets.
 });
}
