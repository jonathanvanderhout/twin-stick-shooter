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
 * @param {string} params.type - "normal", "squid", "triangle", "boring", "gunner", "enemy_bullet",
 *                                "health", "dash", "multiBullet", "bulletSpeed", "fireRate", "bulletUpgrade",
 *                                "powerGlow", "special", or "mimic"
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
      body.userData = { type: "normal", radius: enemyRadius, health: 1, damageAccumulated: 0 };
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
      body.userData = { type: "triangle", radius: enemyRadius, health: 5, damageAccumulated: 0 };
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
    },
    // New asset types.
    health: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "health", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 100;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
      body.oscillationPhase = Math.random() * Math.PI * 2;
    },
    dash: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "dash", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 150;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    },
    multiBullet: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "multiBullet", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 120;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    },
    bulletSpeed: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "bulletSpeed", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 180;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    },
    fireRate: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "fireRate", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      body.setLinvel({ x: 0, y: 0 }, true);
    },
    bulletUpgrade: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "bulletUpgrade", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 100;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    },
    powerGlow: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "powerGlow", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      const angle = Math.random() * Math.PI * 2;
      const speed = 80;
      body.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
    },
    special: (body, collider) => {
      collider.setRestitution(0.8);
      body.userData = { type: "special", radius: enemyRadius, health: 1, damageAccumulated: 0 };
      body.setLinvel({ x: 0, y: 0 }, true);
    },
    // New mimic enemy type.
    mimic: (body, collider) => {
      collider.setRestitution(0.8);
      
      // Compute player's position and determine which wall is farthest.
      const playerPos = playerBody.translation();
      const offset = 50; // offset from the wall boundaries
      let spawnX, spawnY, travelAngle;
      
      // Distances from the player's position to each boundary.
      const dLeft = playerPos.x;
      const dRight = worldWidth - playerPos.x;
      const dTop = playerPos.y;
      const dBottom = worldHeight - playerPos.y;
      
      // Find the maximum distance.
      const maxDistance = Math.max(dLeft, dRight, dTop, dBottom);
      
      // Choose the spawn side and set a travel direction accordingly.
      if (maxDistance === dLeft) {
        // Spawn on the left wall, travel right.
        spawnX = offset;
        spawnY = Math.random() * (worldHeight - 2 * offset) + offset;
        travelAngle = 0; // 0 radians: rightwards.
      } else if (maxDistance === dRight) {
        // Spawn on the right wall, travel left.
        spawnX = worldWidth - offset;
        spawnY = Math.random() * (worldHeight - 2 * offset) + offset;
        travelAngle = Math.PI; // π radians: leftwards.
      } else if (maxDistance === dTop) {
        // Spawn on the top wall, travel down.
        spawnY = offset;
        spawnX = Math.random() * (worldWidth - 2 * offset) + offset;
        travelAngle = Math.PI / 2; // π/2 radians: downward.
      } else { // dBottom is maximum.
        // Spawn on the bottom wall, travel up.
        spawnY = worldHeight - offset;
        spawnX = Math.random() * (worldWidth - 2 * offset) + offset;
        travelAngle = -Math.PI / 2; // -π/2 radians: upward.
      }
      
      // Override the enemy's spawn location.
      body.setTranslation({ x: spawnX, y: spawnY }, true);
      
      // Store the travel direction in userData.
      body.userData = {
        type: "mimic",
        radius: enemyRadius,
        health: 5,
        damageAccumulated: 0,
        travelAngle: travelAngle
      };
      
      // Set the initial velocity so the mimic moves in the chosen direction.
      const mimicSpeed = 200; // Adjust as needed.
      body.setLinvel({
        x: Math.cos(travelAngle) * mimicSpeed,
        y: Math.sin(travelAngle) * mimicSpeed
      }, true);
      
      // Optionally, add some damping.
      body.setLinearDamping(1);
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
 * @param {string} params.type - See createEnemy for accepted types.
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
  if (enemy) {
    enemies.push(enemy);
  }
}

// (The rest of the update functions remain unchanged.)

/**
 * Updates a regular enemy (type "normal").
 * @param {RAPIER.RigidBody} enemy
 */
export function updateRegularEnemy(enemy) {
  if (enemy.userData.type !== "normal") return;
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
  gunner.setRotation(angle, true);

  const second = Math.floor(currentTime / 1000) % 2;
  if (second === 0) {
    gunner.setLinvel({ x: 0, y: 0 }, true);
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
        enemyRadius: 5,
        angle: angle,
        x: bulletX,
        y: bulletY
      });
      enemies.push(bullet);
    }
  } else {
    const speed = 250;
    gunner.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
  }
}

/**
 * Updates a mimic enemy (type "mimic").
 * Mimic behaves like the player character but with a twist:
 * it fires bullets in the direction the player is moving while moving in the exact opposite direction.
 *
 * @param {RAPIER.RigidBody} mimic
 * @param {RAPIER.RigidBody} playerBody
 * @param {number} currentTime - Current time in milliseconds.
 * @param {number} dt - Delta time in seconds.
 * @param {RAPIER.World} physicsWorld
 * @param {Array} enemies - Unified enemy array.
 * @param {number} worldWidth
 * @param {number} worldHeight
 */
// Helper to compare angles within a tolerance.

export function updateMimicEnemy(mimic, playerBody, currentTime, dt, physicsWorld, enemies, worldWidth, worldHeight) {
  const radius = mimic.userData.radius || 20;
  const pos = mimic.translation();
  const vel = mimic.linvel();
  
  // Determine direction by checking velocity
  let isMovingRight = vel.x > 0;
  let isMovingLeft = vel.x < 0;
  let isMovingDown = vel.y > 0;
  let isMovingUp = vel.y < 0;
  
  // First spawn behavior - if not moving, give initial direction
  if (Math.abs(vel.x) < 0.1 && Math.abs(vel.y) < 0.1) {
    // If this is a new mimic, use its stored travel angle to set direction
    if (mimic.userData.travelAngle !== undefined) {
      const angle = mimic.userData.travelAngle;
      if (approxEqual(angle, 0)) isMovingRight = true;
      else if (approxEqual(angle, Math.PI)) isMovingLeft = true;
      else if (approxEqual(angle, Math.PI/2)) isMovingDown = true;
      else if (approxEqual(angle, -Math.PI/2)) isMovingUp = true;
    } else {
      // Default to right if no direction
      isMovingRight = true;
    }
  }
  
  // Check wall collisions and reverse direction
  const buffer = radius + 5;
  
  // Handle horizontal movement and collisions
  if (isMovingRight && pos.x >= worldWidth - buffer) {
    isMovingRight = false;
    isMovingLeft = true;
    // Nudge away from wall
    mimic.setTranslation({ x: worldWidth - buffer, y: pos.y }, true);
  } else if (isMovingLeft && pos.x <= buffer) {
    isMovingLeft = false;
    isMovingRight = true;
    // Nudge away from wall
    mimic.setTranslation({ x: buffer, y: pos.y }, true);
  }
  
  // Handle vertical movement and collisions
  if (isMovingDown && pos.y >= worldHeight - buffer) {
    isMovingDown = false;
    isMovingUp = true;
    // Nudge away from wall
    mimic.setTranslation({ x: pos.x, y: worldHeight - buffer }, true);
  } else if (isMovingUp && pos.y <= buffer) {
    isMovingUp = false;
    isMovingDown = true;
    // Nudge away from wall
    mimic.setTranslation({ x: pos.x, y: buffer }, true);
  }
  
  // Calculate new angle and velocity based on direction
  let newAngle;
  if (isMovingRight) newAngle = 0;
  else if (isMovingLeft) newAngle = Math.PI;
  else if (isMovingDown) newAngle = Math.PI/2;
  else if (isMovingUp) newAngle = -Math.PI/2;
  
  // Store the angle for future reference
  mimic.userData.travelAngle = newAngle;
  
  // Set rotation to match direction
  mimic.setRotation(newAngle, true);
  
  // Apply velocity
  const mimicSpeed = 200;
  mimic.setLinvel({
    x: Math.cos(newAngle) * mimicSpeed,
    y: Math.sin(newAngle) * mimicSpeed
  }, true);
  
  // Fire bullets
  if (mimic.bulletTimer === undefined) mimic.bulletTimer = 0;
  mimic.bulletTimer += dt;
  const bulletInterval = 0.1;
  
  while (mimic.bulletTimer >= bulletInterval) {
    mimic.bulletTimer -= bulletInterval;
    const bulletOffset = radius + 5;
    const bulletX = pos.x + Math.cos(newAngle) * bulletOffset;
    const bulletY = pos.y + Math.sin(newAngle) * bulletOffset;
    
    const bullet = createEnemy({
      type: "enemy_bullet",
      physicsWorld,
      playerBody,
      worldWidth,
      worldHeight,
      enemyRadius: 5,
      angle: newAngle,
      x: bulletX,
      y: bulletY
    });
    
    enemies.push(bullet);
  }
}

// Helper function for angle comparison
function approxEqual(a, b, tol = 0.1) {
  return Math.abs(normalizeAngle(a - b)) < tol;
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
  // Process enemy bullets: remove those that have existed longer than 1 second.
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
    if (type === "normal") {
      updateRegularEnemy(enemy);
    } else if (type === "squid") {
      updateSquid(enemy, playerBody, currentTime, dt);
    } else if (type === "triangle") {
      updateTriangleEnemy(enemy, playerBody, dt);
    } else if (type === "boring") {
      updateBasicEnemy(enemy);
    } else if (type === "gunner") {
      updateGunnerEnemy(enemy, playerBody, currentTime, dt, physicsWorld, enemies, worldWidth, worldHeight);
    } else if (type === "mimic") {
      updateMimicEnemy(enemy, playerBody, currentTime, dt, physicsWorld, enemies, worldWidth, worldHeight);
    }
    // Note: New asset types currently have no dedicated update function unless added.
  });
}
