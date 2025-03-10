const gamePlan = {};
const totalTime = 300; // total time in seconds (final wave at 300 seconds)

// Waves come every 10 seconds (including time 0)
for (let t = 0; t <= totalTime; t += 10) {
  const progress = t / totalTime; // normalized progress: 0 at start, 1 at final wave
  
  // Calculate counts using quadratic interpolation:
  // "Normal" enemies decrease from 10 to 0.
  const normalCount = Math.round(10 * Math.pow(1 - progress, 2));
  // "Gunner" enemies increase from 0 to 10.
  const gunnerCount = Math.round(10 * Math.pow(progress, 2));
  // "Triangle" enemies fill in so total is always 10.
  const triangleCount = 10 - normalCount - gunnerCount;
  
  gamePlan[t.toString()] = {
    waveTime: t, // wave starting time (in seconds)
    enemies: [
      { type: "normal", count: normalCount, placement: "random", delay: 50 },
      { type: "triangle", count: triangleCount, placement: "right_edge", delay: 150 },
      { type: "gunner", count: gunnerCount, placement: "top_edge", delay: 200 },
      { type: "health", count: 2, placement: "top_edge", delay: 200 },
      { type: "dash", count: 2, placement: "top_edge", delay: 200 }
    ]
  };
}

export default gamePlan;
