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
 * @param {Array} params.enemies - Array of enemy physics bodies.
 * @param {number} params.enemyRadius - The radius used for enemies.
 * @param {Array} params.squids - Array of squid enemy bodies.
 * @param {Array} params.triangleEnemies - Array of triangle enemy bodies.
 * @param {Array} params.bullets - Array of bullet objects (each with a 'body' property that has translation() and linvel() methods).
 * @param {number} params.bulletRadius 
 * @param {function} params.getCameraScale - A function that returns the camera scale.
 * @param {function} params.getCameraOrigin - A function that accepts (playerPos, scale) and returns an {x, y} object.
 * @param {function} params.updateBubbleExplosions - A function to draw bubble explosions.
 * @param {function} params.updateDamageExplosions - A function to draw damage explosions.
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
    squids,
    triangleEnemies,
    bullets,
    bulletRadius,
    getCameraScale,
    getCameraOrigin,
    updateBubbleExplosions,
    updateDamageExplosions
}) {
    // Get the player's current position from its physics body.
    const playerPos = playerBody.translation();
    const scale = getCameraScale();
    const origin = getCameraOrigin(playerPos, scale);

    // Clear the canvas and set up the transform.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    function drawPlayer() {
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
    drawPlayer();

    // --- Draw Regular Enemies ---
    ctx.fillStyle = "#FF4858";
    enemies.forEach(enemy => {
        const pos = enemy.translation();
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
    });

    // --- Draw Squid Enemies ---
    squids.forEach(squid => {
        const pos = squid.translation();
        const angle = squid.rotation();
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        ctx.fillStyle = "#8A2BE2";
        ctx.beginPath();
        ctx.arc(0, 0, enemyRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        const dotX = enemyRadius * 0.7;
        ctx.arc(dotX, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // --- Draw Triangle Enemies ---
    triangleEnemies.forEach(tri => {
        const pos = tri.translation();
        const angle = tri.rotation();
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        ctx.beginPath();
        const size = enemyRadius;
        ctx.moveTo(size, 0);
        ctx.lineTo(-size, -size * 0.7);
        ctx.lineTo(-size, size * 0.7);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.restore();
    });

    // --- Draw Bullets ---
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
