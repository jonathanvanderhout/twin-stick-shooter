/**
 * Renders the entire scene.
 *
 * @param {Object} params - The parameters object.
 * @param {CanvasRenderingContext2D} params.ctx - The canvas rendering context.
 * @param {HTMLCanvasElement} params.canvas - The canvas element.
 * @param {number} params.worldWidth - The width of the game world.
 * @param {number} params.worldHeight - The height of the game world.
 * @param {Array} params.walls - Array of wall objects with {x, y, width, height}.
 * @param {Object} params.playerBody - The player's physics body (with translation() and rotation() methods).
 * @param {boolean} params.isDashing - Whether the player is currently dashing.
 * @param {number} params.playerRadius - The radius of the player.
 * @param {Array} params.enemies - Unified array of enemy physics bodies (each with a userData.type property).
 * @param {number} params.enemyRadius - The radius used for enemies.
 * @param {Array} params.bullets - Array of player bullet objects (each with a 'body' property that has translation() and linvel() methods).
 * @param {number} params.bulletRadius - The radius of bullets.
 * @param {function} params.getCameraScale - A function that returns the camera scale.
 * @param {function} params.getCameraOrigin - A function that accepts (playerPos, scale) and returns an {x, y} object.
 * @param {function} params.updateBubbleExplosions - A function to draw bubble explosions.
 * @param {function} params.updateDamageExplosions - A function to draw damage explosions.
 * @param {number} params.time - A number needed for rendering the background.
 */
export function renderScene({
    ctx,
    canvas,
    worldWidth,
    worldHeight,
    walls,
    playerBody,
    isDashing,
    playerRadius,
    enemies,
    enemyRadius,
    bullets,
    bulletRadius,
    getCameraScale,
    getCameraOrigin,
    updateBubbleExplosions,
    updateDamageExplosions,
    time
}) {
    // Get the player's current position from its physics body.
    const playerPos = playerBody.translation();
    const scale = getCameraScale();
    const origin = getCameraOrigin(playerPos, scale);

    // Clear the canvas and set up the transform.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // drawOceanBackground(ctx, canvas, time)

    ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);

    // Draw the grid.
    ctx.beginPath();
    ctx.strokeStyle = "rgba(92, 219, 255, 0.2)";
    ctx.lineWidth = 1 / scale;
    const gridSize = 50;
    for (let x = 0; x <= worldWidth; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, worldHeight);
    }
    for (let y = 0; y <= worldHeight; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(worldWidth, y);
    }
    ctx.stroke();

    // Draw the walls.
    ctx.fillStyle = "#143642";
    walls.forEach(w => {
        ctx.fillRect(w.x - w.width / 2, w.y - w.height / 2, w.width, w.height);
    });

    // --- Draw the Player ---
    function drawPlayer(playerBody) {
        const pPos = playerBody.translation();
        const angle = playerBody.rotation();
        ctx.save();
        ctx.translate(pPos.x, pPos.y);
        ctx.rotate(angle);
        if (isDashing) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#5CDBFF";
            ctx.beginPath();
            ctx.arc(0, 0, playerRadius * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.fillStyle = "#FFCB05";
        ctx.beginPath();
        ctx.arc(0, 0, playerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#E6B800";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-playerRadius * 1.8, -playerRadius * 0.2, -playerRadius * 0.8, -playerRadius * 0.8);
        ctx.quadraticCurveTo(-playerRadius * 0.4, -playerRadius * 0.4, 0, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-playerRadius * 1.8, playerRadius * 0.2, -playerRadius * 0.8, playerRadius * 0.8);
        ctx.quadraticCurveTo(-playerRadius * 0.4, playerRadius * 0.4, 0, 0);
        ctx.fill();
        ctx.fillStyle = "#E6B800";
        ctx.beginPath();
        ctx.moveTo(-playerRadius * 0.8, 0);
        ctx.lineTo(-playerRadius * 1.4, -playerRadius * 0.3);
        ctx.lineTo(-playerRadius * 1.6, 0);
        ctx.lineTo(-playerRadius * 1.4, playerRadius * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#5DADE2";
        ctx.beginPath();
        ctx.arc(playerRadius * 0.4, 0, playerRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#333333";
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * playerRadius * 0.7, Math.sin(a) * playerRadius * 0.7, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.strokeStyle = "#FFCB05";
        ctx.lineWidth = 6 / scale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const turretAngle = 0;
        ctx.lineTo(Math.cos(turretAngle) * (playerRadius + 10), Math.sin(turretAngle) * (playerRadius + 10));
        ctx.stroke();
        ctx.fillStyle = "#333333";
        ctx.beginPath();
        ctx.arc(playerRadius + 10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    drawPlayer(playerBody);

    // --- Draw Unified Enemies ---
    enemies.forEach(enemy => {
        const type = enemy.userData.type;
        const pos = enemy.translation();

        if(enemy.userData.health > 1){
            const rawRadius = enemyRadius;
            const effectiveRadius = Math.max(rawRadius, 10); // Ensure a minimum size for health bars.
            const health = enemy.userData.health || 1;
            const damage = enemy.userData.damageAccumulated || 0;
            const healthPercent = Math.max(0, (health - damage) / health);
            const barWidth = effectiveRadius * 2;
            const barHeight = 5;
            const barX = pos.x - barWidth / 2;
            const barY = pos.y - effectiveRadius - 10; // 10px above enemy.
    
            ctx.save();
            // Background bar.
            ctx.fillStyle = "#555";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            // Health portion in green.
            ctx.fillStyle = "#0F0";
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            // Optional border.
            // ctx.strokeStyle = "#000";
            // ctx.strokeRect(barX, barY, barWidth, barHeight);
            ctx.restore();
        }
        
        if (type == "gunner") {
            drawPlayer(enemy)

        }
        else if (type === "enemy") {
            // Regular enemy (hexagon shape)
            const vel = enemy.linvel();
            const enemyAngle = Math.atan2(vel.y, vel.x);
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(enemyAngle);
            const primaryColor = "#FF4858";
            const secondaryColor = "#CC3C4A";
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            const hexRadius = enemyRadius * 1.2;
            ctx.moveTo(hexRadius, 0);
            for (let i = 1; i <= 6; i++) {
                const a = (Math.PI / 3) * i;
                ctx.lineTo(hexRadius * Math.cos(a), hexRadius * Math.sin(a));
            }
            ctx.fill();
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.moveTo(-hexRadius, 0);
            ctx.lineTo(-hexRadius * 1.6, -hexRadius * 0.5);
            ctx.lineTo(-hexRadius * 2, 0);
            ctx.lineTo(-hexRadius * 1.6, hexRadius * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.moveTo(-hexRadius * 0.5, -hexRadius * 0.8);
            ctx.lineTo(0, -hexRadius * 1.4);
            ctx.lineTo(hexRadius * 0.5, -hexRadius * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-hexRadius * 0.5, hexRadius * 0.8);
            ctx.lineTo(0, hexRadius * 1.4);
            ctx.lineTo(hexRadius * 0.5, hexRadius * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -hexRadius * 0.6);
            ctx.lineTo(hexRadius * 0.4, 0);
            ctx.lineTo(0, hexRadius * 0.6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(hexRadius * 0.6, -hexRadius * 0.3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(hexRadius * 0.6, hexRadius * 0.3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(hexRadius * 0.6, -hexRadius * 0.3, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(hexRadius * 0.6, hexRadius * 0.3, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(hexRadius * 0.3, -hexRadius * 0.5);
            ctx.lineTo(hexRadius * 0.3, hexRadius * 0.5);
            ctx.stroke();
            ctx.restore();
        } else if (type === "squid") {
            // Squid enemy
            const angle = enemy.rotation();
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);
            ctx.fillStyle = "#8A2BE2";
            ctx.beginPath();
            ctx.arc(0, 0, enemyRadius, 0, Math.PI * 2);
            ctx.fill();
            const tentacleCount = 8;
            const tentacleLength = enemyRadius * 0.6;
            const tentacleWidth = enemyRadius * 0.25;
            for (let i = 0; i < tentacleCount; i++) {
                const tentacleAngle = (i * Math.PI * 2 / tentacleCount);
                const startX = Math.cos(tentacleAngle) * enemyRadius;
                const startY = Math.sin(tentacleAngle) * enemyRadius;
                const endX = Math.cos(tentacleAngle) * (enemyRadius + tentacleLength);
                const endY = Math.sin(tentacleAngle) * (enemyRadius + tentacleLength);
                ctx.fillStyle = "#7B24C4";
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineWidth = tentacleWidth;
                ctx.lineCap = "round";
                ctx.stroke();
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            const eyeDistance = enemyRadius * 0.5;
            ctx.arc(eyeDistance, 0, enemyRadius * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(eyeDistance, 0, enemyRadius * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#6A1B9A";
            ctx.lineWidth = enemyRadius * 0.1;
            ctx.beginPath();
            ctx.arc(0, 0, enemyRadius * 0.95, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (type === "triangle") {
            // Triangle enemy (drawn as a torpedo)
            const angle = enemy.rotation();
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);
            const torpedoLength = enemyRadius * 2;
            const torpedoWidth = enemyRadius * 0.7;
            ctx.beginPath();
            ctx.moveTo(torpedoLength, 0);
            ctx.quadraticCurveTo(torpedoLength * 0.5, -torpedoWidth, -torpedoLength * 0.5, -torpedoWidth);
            ctx.lineTo(-torpedoLength * 0.5, torpedoWidth);
            ctx.quadraticCurveTo(torpedoLength * 0.5, torpedoWidth, torpedoLength, 0);
            ctx.closePath();
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
            ctx.restore();
        } else if (type === "enemy_bullet") {
            // Bullet enemy drawn like the player's bullet
            const vel = enemy.linvel();
            const bulletAngle = Math.atan2(vel.y, vel.x);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, bulletRadius, 0, Math.PI * 2);
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 0, 0, 0.51)";
            ctx.lineWidth = bulletRadius / scale;
            const trailLength = 10;
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(
                pos.x - Math.cos(bulletAngle) * trailLength,
                pos.y - Math.sin(bulletAngle) * trailLength
            );
            ctx.stroke();
        }
    });

    // --- Draw Player Bullets ---
    ctx.fillStyle = "#5CDBFF";
    bullets.forEach(bullet => {
        const pos = bullet.body.translation();
        const vel = bullet.body.linvel();
        const bulletAngle = Math.atan2(vel.y, vel.x);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, bulletRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(92, 219, 255, 0.6)";
        ctx.lineWidth = bulletRadius / scale;
        const trailLength = 10;
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(
            pos.x - Math.cos(bulletAngle) * trailLength,
            pos.y - Math.sin(bulletAngle) * trailLength
        );
        ctx.stroke();
    });

    // Draw explosion effects.
    updateBubbleExplosions(ctx, scale, getCameraOrigin(playerPos, scale));
    updateDamageExplosions(ctx, scale, getCameraOrigin(playerPos, scale));

    // Reset transform for HUD.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawOceanBackground(ctx, canvas, time) {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#000B14');
    bgGradient.addColorStop(1, '#001A2C');

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    drawLightRays(ctx, width, height, time);
}

function drawLightRays(ctx, width, height, time) {
    const rayCount = 5;
    const baseSpeed = 0.0002;

    for (let i = 0; i < rayCount; i++) {
        const rayWidth = width * 0.2 + Math.sin(time * 0.001 + i) * width * 0.05;
        const xPosition = ((time * baseSpeed * (0.5 + i * 0.1)) % 1.5 - 0.25) * width;
        const rayGradient = ctx.createLinearGradient(xPosition, 0, xPosition + rayWidth, 0);
        rayGradient.addColorStop(0, 'rgba(0, 40, 80, 0)');
        rayGradient.addColorStop(0.5, 'rgba(30, 100, 150, 0.04)');
        rayGradient.addColorStop(1, 'rgba(0, 40, 80, 0)');
        ctx.fillStyle = rayGradient;
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.moveTo(xPosition, 0);
        ctx.lineTo(xPosition + rayWidth, 0);
        ctx.lineTo(xPosition + rayWidth * 1.2, height);
        ctx.lineTo(xPosition - rayWidth * 0.2, height);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}
