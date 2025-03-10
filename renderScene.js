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
    function drawPlayer(playerBody, type = "player") {
        if (type == "gunner") {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "#FFCB05";

        }
        const pPos = playerBody.translation();
        const angle = playerBody.rotation();
        ctx.save();
        ctx.translate(pPos.x, pPos.y);
        ctx.rotate(angle);
        if (isDashing && type == "player") {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#5CDBFF";
            ctx.beginPath();
            ctx.arc(0, 0, playerRadius * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
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

    // --- Define Helper Functions for Stylized Enemy Assets ---
    const assetSize = 60;
    const halfSize = assetSize / 2;
    const bgColor = "rgba(124,252,0,0.5)";

    function drawAssetBackground(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, halfSize, 0, 2 * Math.PI);
        ctx.fillStyle = bgColor;
        ctx.fill();
    }

    function drawHealthAsset(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#FF4858"; // bright red
        ctx.strokeStyle = "#CC3C4A"; // complementary darker red
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(-5, -15);
        ctx.lineTo(5, -15);
        ctx.lineTo(5, -5);
        ctx.lineTo(15, -5);
        ctx.lineTo(15, 5);
        ctx.lineTo(5, 5);
        ctx.lineTo(5, 15);
        ctx.lineTo(-5, 15);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-15, 5);
        ctx.lineTo(-15, -5);
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function drawDashUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#5CDBFF"; // bright blue
        const width = 40, height = 8, radius = 4;
        ctx.beginPath();
        ctx.moveTo(-width / 2 + radius, -height / 2);
        ctx.lineTo(width / 2 - radius, -height / 2);
        ctx.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        ctx.lineTo(width / 2, height / 2 - radius);
        ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        ctx.lineTo(-width / 2 + radius, height / 2);
        ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        ctx.lineTo(-width / 2, -height / 2 + radius);
        ctx.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawMultiBulletUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#FFCB05"; // bright yellow
        function drawCapsule(cx, cy, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(cx - w / 2 + r, cy - h / 2);
            ctx.lineTo(cx + w / 2 - r, cy - h / 2);
            ctx.quadraticCurveTo(cx + w / 2, cy - h / 2, cx + w / 2, cy - h / 2 + r);
            ctx.lineTo(cx + w / 2, cy + h / 2 - r);
            ctx.quadraticCurveTo(cx + w / 2, cy + h / 2, cx + w / 2 - r, cy + h / 2);
            ctx.lineTo(cx - w / 2 + r, cy + h / 2);
            ctx.quadraticCurveTo(cx - w / 2, cy + h / 2, cx - w / 2, cy + h / 2 - r);
            ctx.lineTo(cx - w / 2, cy - h / 2 + r);
            ctx.quadraticCurveTo(cx - w / 2, cy - h / 2, cx - w / 2 + r, cy - h / 2);
            ctx.closePath();
            ctx.fill();
        }
        drawCapsule(-15, 0, 12, 6, 3);
        drawCapsule(0, 0, 12, 6, 3);
        drawCapsule(15, 0, 12, 6, 3);
        ctx.restore();
    }

    function drawBulletSpeedUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#0099CC"; // deep blue
        const shaftWidth = 30, shaftHeight = 6, radius = 3;
        ctx.beginPath();
        ctx.moveTo(-shaftWidth / 2 + radius, -shaftHeight / 2);
        ctx.lineTo(shaftWidth / 2 - radius, -shaftHeight / 2);
        ctx.quadraticCurveTo(shaftWidth / 2, -shaftHeight / 2, shaftWidth / 2, -shaftHeight / 2 + radius);
        ctx.lineTo(shaftWidth / 2, shaftHeight / 2 - radius);
        ctx.quadraticCurveTo(shaftWidth / 2, shaftHeight / 2, shaftWidth / 2 - radius, shaftHeight / 2);
        ctx.lineTo(-shaftWidth / 2 + radius, shaftHeight / 2);
        ctx.quadraticCurveTo(-shaftWidth / 2, shaftHeight / 2, -shaftWidth / 2, shaftHeight / 2 - radius);
        ctx.lineTo(-shaftWidth / 2, -shaftHeight / 2 + radius);
        ctx.quadraticCurveTo(-shaftWidth / 2, -shaftHeight / 2, -shaftWidth / 2 + radius, -shaftHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(shaftWidth / 2, 0);
        ctx.lineTo(shaftWidth / 2 + 10, -8);
        ctx.lineTo(shaftWidth / 2 + 10, 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawFireRateUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = "#8A2BE2"; // vivid purple
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-15, -8);
        ctx.lineTo(15, -8);
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.moveTo(-15, 8);
        ctx.lineTo(15, 8);
        ctx.stroke();
        ctx.restore();
    }

    function drawBulletUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = "#FFCB05"; // bright yellow
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(15, 15);
        ctx.moveTo(-15, 15);
        ctx.lineTo(15, -15);
        ctx.stroke();
        ctx.restore();
    }

    function drawPowerGlowUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = "#5CDBFF"; // bright cyan-blue
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-7, -7);
        ctx.lineTo(7, 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-7, 7);
        ctx.lineTo(7, -7);
        ctx.stroke();
        ctx.restore();
    }

    function drawSpecialUpgrade(x, y) {
        drawAssetBackground(x, y);
        ctx.save();
        ctx.translate(x, y);
        function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let step = Math.PI / spikes;
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                let xOuter = cx + Math.cos(rot) * outerRadius;
                let yOuter = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(xOuter, yOuter);
                rot += step;
                let xInner = cx + Math.cos(rot) * innerRadius;
                let yInner = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(xInner, yInner);
                rot += step;
            }
            ctx.closePath();
            ctx.fillStyle = "#FFCB05"; // golden yellow
            ctx.fill();
            ctx.strokeStyle = "#E6B800"; // darker yellow border
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        drawStar(0, 0, 5, 15, 7);
        ctx.restore();
    }

    // --- Draw Unified Enemies ---
    enemies.forEach(enemy => {
        const type = enemy.userData.type;
        const pos = enemy.translation();

        // Draw a health bar if enemy.health > 1.
        if (enemy.userData.health > 1) {
            const rawRadius = enemyRadius;
            const effectiveRadius = Math.max(rawRadius, 10);
            const health = enemy.userData.health || 1;
            const damage = enemy.userData.damageAccumulated || 0;
            const healthPercent = Math.max(0, (health - damage) / health);
            const barWidth = effectiveRadius * 2;
            const barHeight = 5;
            const barX = pos.x - barWidth / 2;
            const barY = pos.y - effectiveRadius - 10;

            ctx.save();
            ctx.fillStyle = "#555";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = "#0F0";
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            ctx.restore();
        }

        switch (type) {
            case "gunner":
                // Draw gunner like the player.
                drawPlayer(enemy, type);
                break;
            case "normal":
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
                break;
            case "squid":
                // Squid enemy.
                const squidAngle = enemy.rotation();
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(squidAngle);
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
                break;
            case "triangle":
                // Triangle enemy drawn as a torpedo.
                const triAngle = enemy.rotation();
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(triAngle);
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
                break;
            case "enemy_bullet":
                // Bullet enemy drawn like the player's bullet.
                const bulletVel = enemy.linvel();
                const bulletAngle = Math.atan2(bulletVel.y, bulletVel.x);
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
                break;
            // New asset types drawn using the stylized functions.
            case "health":
                drawHealthAsset(pos.x, pos.y);
                break;
            case "dash":
                drawDashUpgrade(pos.x, pos.y);
                break;
            case "multiBullet":
                drawMultiBulletUpgrade(pos.x, pos.y);
                break;
            case "bulletSpeed":
                drawBulletSpeedUpgrade(pos.x, pos.y);
                break;
            case "fireRate":
                drawFireRateUpgrade(pos.x, pos.y);
                break;
            case "bulletUpgrade":
                drawBulletUpgrade(pos.x, pos.y);
                break;
            case "powerGlow":
                drawPowerGlowUpgrade(pos.x, pos.y);
                break;
            case "special":
                drawSpecialUpgrade(pos.x, pos.y);
                break;
            default:
                break;
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

/* Optionally, you can keep your ocean background functions here if needed.
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
*/
