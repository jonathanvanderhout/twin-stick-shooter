import * as RAPIER from "https://cdn.skypack.dev/@dimforge/rapier2d-compat";

// Helper to normalize an angle between -π and π.
function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Creates an enemy of the given type at a spawn location.
 * For most enemy types, if x and y are not provided, a random location at least 500 units away
 * from the player is chosen. For enemy_bullets (and similar future cases), an optional angle can be provided.
 *
 * @param {Object} params
 * @param {string} params.type - "enemy", "squid", "triangle", "boring", "gunner", or "enemy_bullet"
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the enemy's size.
 * @param {number} [params.angle] - Optional angle (in radians). Currently used for enemy_bullets.
 * @param {number} [params.x] - Optional spawn x coordinate.
 * @param {number} [params.y] - Optional spawn y coordinate.
 * @returns {RAPIER.RigidBody|null} The newly created enemy body, or null if type is unknown.
 */
function createEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, angle, x, y }) {
  let spawnX, spawnY;
  if (typeof x === "number" && typeof y === "number") {
    spawnX = x;
    spawnY = y;
  } else {
    // Choose a random spawn location at least 500 units away from the player.
    const playerPos = playerBody.translation();
    do {
      spawnX = Math.random() * (worldWidth - 100) + 50;
      spawnY = Math.random() * (worldHeight - 100) + 50;
    } while (Math.hypot(spawnX - playerPos.x, spawnY - playerPos.y) < 500);
  }

  // Create the enemy body and collider.
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(spawnX, spawnY);
  const body = physicsWorld.createRigidBody(bodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.ball(enemyRadius);
  const collider = physicsWorld.createCollider(colliderDesc, body);
  collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  // Mapping of type-specific configuration functions.
  const typeConfig = {
    normal: (body, collider) => {
      collider.setRestitution(0.8);
      // Default enemy health is 1.
      body.userData = { type: "enemy", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 100;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
      body.oscillationPhase = Math.random() * Math.PI * 2;
    },
    squid: (body) => {
      body.userData = { type: "squid", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      body.setLinearDamping(2);
      body.isSquid = true;
      body.nextMoveTime = 0;
      body.targetAngle = body.rotation();
    },
    triangle: (body) => {
      body.userData = { type: "triangle", radius: enemyRadius, health: 1, damageAccumulated: 0 };
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
      body.userData = { type: "boring", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      body.setLinvel({ x: 0, y: 0 }, true);
    },
    enemy_bullet: (body, collider) => {
      collider.setRestitution(0.8);
      // For enemy bullets, default health is 1.
      body.userData = { type: "enemy_bullet", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const bulletAngle = (typeof angle === "number") ? angle : (Math.random() * Math.PI * 2);
      const bulletSpeed = 800; // Bullet speed.
      body.setLinvel({ x: Math.cos(bulletAngle) * bulletSpeed, y: Math.sin(bulletAngle) * bulletSpeed }, true);
    },
    gunner: (body) => {
      // Gunner has a higher health value.
      body.userData = { type: "gunner", radius: enemyRadius, health: 10, damageAccumulated: 0 };
      const pos = body.translation();
      const playerPos = playerBody.translation();
      const dx = playerPos.x - pos.x;
      const dy = playerPos.y - pos.y;
      const angle = Math.atan2(dy, dx);
      body.setRotation(angle, true);
      // Gunner starts stationary; movement and bullet firing will be handled in its update.
      body.setLinvel({ x: 0, y: 0 }, true);
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
 * @param {string} params.type - "enemy", "squid", "triangle", "boring", "gunner", or "enemy_bullet"
 * @param {RAPIER.World} params.physicsWorld
 * @param {RAPIER.RigidBody} params.playerBody
 * @param {number} params.worldWidth
 * @param {number} params.worldHeight
 * @param {number} params.enemyRadius - Used as the enemy's size.
 * @param {Array} params.enemies - Unified enemy array.
 * @param {number} [params.angle] - Optional angle (for enemy_bullet).
 * @param {number} [params.x] - Optional spawn x coordinate.
 * @param {number} [params.y] - Optional spawn y coordinate.
 */
export function spawnGenericEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, enemies, angle, x, y }) {
  const enemy = createEnemy({ type, physicsWorld, playerBody, worldWidth, worldHeight, enemyRadius, angle, x, y });
  enemies.push(enemy);
}

// (The rest of the update functions remain unchanged.)


/**
 * Updates a regular enemy (type "enemy").
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
 * Updates a gunner enemy (type "gunner").
 * The gunner always points toward the player.
 * On alternating seconds it stands still; otherwise it moves toward the player.
 * While updating its movement, the gunner spawns 5 bullets per second directly in front of it,
 * each bullet directed in the angle the gunner is pointing.
 *
 * @param {RAPIER.RigidBody} gunner
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime - Current time in milliseconds.
 * @param {number} dt - Delta time in seconds.
 * @param {RAPIER.World} physicsWorld
 * @param {Array} enemies - Unified enemy array.
 * @param {number} worldWidth
 * @param {number} worldHeight
 */
export function updateGunnerEnemy(gunner, playerBody, currentTime, dt, physicsWorld, enemies, worldWidth, worldHeight) {
  const pos = gunner.translation();
  const playerPos = playerBody.translation();
  const dx = playerPos.x - pos.x;
  const dy = playerPos.y - pos.y;
  const angle = Math.atan2(dy, dx);
  // Always update the gunner to point toward the player.
  gunner.setRotation(angle, true);

  // Determine behavior based on alternating seconds.
  const second = Math.floor(currentTime / 1000) % 2;
  if (second === 0) {
    // Paused: stand still.
    gunner.setLinvel({ x: 0, y: 0 }, true);

    // Fire bullets at a rate of 5 per second only when paused.
    if (gunner.bulletTimer === undefined) {
      gunner.bulletTimer = 0;
    }
    gunner.bulletTimer += dt;
    const bulletInterval = 0.2; // 5 bullets per second

    while (gunner.bulletTimer >= bulletInterval) {
      gunner.bulletTimer -= bulletInterval;
      const gunnerRadius = gunner.userData.radius || 20;
      const bulletOffset = gunnerRadius + 5; 
      const bulletX = pos.x + Math.cos(angle) * bulletOffset;
      const bulletY = pos.y + Math.sin(angle) * bulletOffset;
      const bullet = createEnemy({
        type: "enemy_bullet",
        physicsWorld,
        playerBody, // required parameter (not used for bullet behavior)
        worldWidth,
        worldHeight,
        enemyRadius: 5, // bullet size
        angle: angle,
        x: bulletX,
        y: bulletY
      });
      enemies.push(bullet);
    }
  } else {
    // Moving toward the player.
    const speed = 250;
    gunner.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  }
}


/**
 * Updates all enemies.
 * @param {Array} enemies - Unified enemy array.
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime
 * @param {number} dt - Delta time in seconds.
 * @param {RAPIER.World} physicsWorld
 * @param {number} worldWidth
 * @param {number} worldHeight
 */
export function updateAllEnemies(enemies, playerBody, currentTime, dt, physicsWorld, worldWidth, worldHeight) {
  // Process enemy bullets: remove those that have existed longer than 5 seconds.
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (enemy.userData.type === "enemy_bullet") {
      if (!enemy.birthTime) {
        enemy.birthTime = currentTime;
      }
      if (currentTime - enemy.birthTime > 1000) {
        enemy.userData.shouldRemove = true;
      }
    }
    if (enemy.userData.shouldRemove) {
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
    } else if (type === "gunner") {
      updateGunnerEnemy(enemy, playerBody, currentTime, dt, physicsWorld, enemies, worldWidth, worldHeight);
    }
    // enemy_bullet needs no extra update.
  });
}
