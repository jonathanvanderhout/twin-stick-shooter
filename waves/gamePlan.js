// gamePlan.js

// This configuration object defines enemy wave setups indexed by the second at which they should trigger.
// There are 30 waves, each 10 seconds apart (i.e., at seconds 10, 20, ..., 300).
// Each wave contains an array of enemy spawn instructions.
// Each instruction includes the enemy type (only "normal", "squid", or "triangle"),
// the count to spawn, a placement strategy (e.g., "random", "left_edge", "right_edge"),
// and an optional delay (in milliseconds) to stagger the spawns within that wave.
const gamePlan = {
    "2": {
        "enemies": [
            {
                "type": "normal",
                "count": 3,
                "placement": "random",
                "delay": 0
            },
            {
                "type": "health",
                "count": 100,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "20": {
        "enemies": [
            {
                "type": "gunner",
                "count": 12,
                "placement": "random",
                "delay": 100
            },
            {
                "type": "squid",
                "count": 5,
                "placement": "left_edge",
                "delay": 200
            }
        ]
    },
    "44": {
        "enemies": [
            {
                "type": "triangle",
                "count": 3,
                "placement": "random",
                "delay": 500
            }
        ]
    },
    "40": {
        "enemies": [
            {
                "type": "normal",
                "count": 15,
                "placement": "right_edge",
                "delay": 50
            }
        ]
    },
    "50": {
        "enemies": [
            {
                "type": "squid",
                "count": 10,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "60": {
        "enemies": [
            {
                "type": "normal",
                "count": 20,
                "placement": "random",
                "delay": 100
            }
        ]
    },
    "70": {
        "enemies": [
            {
                "type": "triangle",
                "count": 4,
                "placement": "random",
                "delay": 300
            },
            {
                "type": "squid",
                "count": 8,
                "placement": "left_edge",
                "delay": 150
            }
        ]
    },
    "80": {
        "enemies": [
            {
                "type": "normal",
                "count": 18,
                "placement": "random",
                "delay": 50
            }
        ]
    },
    "90": {
        "enemies": [
            {
                "type": "squid",
                "count": 12,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "100": {
        "enemies": [
            {
                "type": "triangle",
                "count": 5,
                "placement": "random",
                "delay": 400
            }
        ]
    },
    "110": {
        "enemies": [
            {
                "type": "normal",
                "count": 22,
                "placement": "random",
                "delay": 75
            }
        ]
    },
    "120": {
        "enemies": [
            {
                "type": "squid",
                "count": 15,
                "placement": "right_edge",
                "delay": 100
            }
        ]
    },
    "130": {
        "enemies": [
            {
                "type": "triangle",
                "count": 4,
                "placement": "random",
                "delay": 500
            },
            {
                "type": "normal",
                "count": 10,
                "placement": "left_edge",
                "delay": 150
            }
        ]
    },
    "140": {
        "enemies": [
            {
                "type": "squid",
                "count": 18,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "150": {
        "enemies": [
            {
                "type": "normal",
                "count": 25,
                "placement": "random",
                "delay": 50
            }
        ]
    },
    "160": {
        "enemies": [
            {
                "type": "triangle",
                "count": 3,
                "placement": "random",
                "delay": 300
            },
            {
                "type": "squid",
                "count": 10,
                "placement": "right_edge",
                "delay": 200
            }
        ]
    },
    "170": {
        "enemies": [
            {
                "type": "normal",
                "count": 20,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "180": {
        "enemies": [
            {
                "type": "squid",
                "count": 20,
                "placement": "random",
                "delay": 100
            }
        ]
    },
    "190": {
        "enemies": [
            {
                "type": "triangle",
                "count": 6,
                "placement": "random",
                "delay": 250
            }
        ]
    },
    "200": {
        "enemies": [
            {
                "type": "normal",
                "count": 30,
                "placement": "random",
                "delay": 75
            }
        ]
    },
    "210": {
        "enemies": [
            {
                "type": "squid",
                "count": 15,
                "placement": "left_edge",
                "delay": 100
            }
        ]
    },
    "220": {
        "enemies": [
            {
                "type": "triangle",
                "count": 4,
                "placement": "random",
                "delay": 500
            },
            {
                "type": "normal",
                "count": 15,
                "placement": "random",
                "delay": 150
            }
        ]
    },
    "230": {
        "enemies": [
            {
                "type": "squid",
                "count": 20,
                "placement": "random",
                "delay": 0
            }
        ]
    },
    "240": {
        "enemies": [
            {
                "type": "normal",
                "count": 28,
                "placement": "right_edge",
                "delay": 50
            }
        ]
    },
    "250": {
        "enemies": [
            {
                "type": "triangle",
                "count": 7,
                "placement": "random",
                "delay": 300
            }
        ]
    },
    "260": {
        "enemies": [
            {
                "type": "squid",
                "count": 18,
                "placement": "random",
                "delay": 100
            }
        ]
    },
    "270": {
        "enemies": [
            {
                "type": "normal",
                "count": 35,
                "placement": "random",
                "delay": 75
            }
        ]
    },
    "280": {
        "enemies": [
            {
                "type": "squid",
                "count": 25,
                "placement": "random",
                "delay": 100
            }
        ]
    },
    "290": {
        "enemies": [
            {
                "type": "triangle",
                "count": 5,
                "placement": "random",
                "delay": 400
            },
            {
                "type": "normal",
                "count": 20,
                "placement": "left_edge",
                "delay": 150
            }
        ]
    },
    "300": {
        "enemies": [
            {
                "type": "normal",
                "count": 40,
                "placement": "random",
                "delay": 50
            },
            {
                "type": "squid",
                "count": 30,
                "placement": "random",
                "delay": 0
            },
            {
                "type": "triangle",
                "count": 8,
                "placement": "random",
                "delay": 200
            }
        ]

    },
    "310": {
        "enemies": [
            { "type": "normal", "count": 11, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 5, "placement": "random", "delay": 100 }
        ]
    },
    "320": {
        "enemies": [
            { "type": "normal", "count": 12, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 6, "placement": "random", "delay": 100 }
        ]
    },
    "330": {
        "enemies": [
            { "type": "normal", "count": 13, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 6, "placement": "random", "delay": 100 }
        ]
    },
    "340": {
        "enemies": [
            { "type": "normal", "count": 14, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 7, "placement": "random", "delay": 100 }
        ]
    },
    "350": {
        "enemies": [
            { "type": "normal", "count": 15, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 7, "placement": "random", "delay": 100 }
        ]
    },
    "360": {
        "enemies": [
            { "type": "normal", "count": 16, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 8, "placement": "random", "delay": 100 }
        ]
    },
    "370": {
        "enemies": [
            { "type": "normal", "count": 17, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 8, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 1, "placement": "random", "delay": 150 }
        ]
    },
    "380": {
        "enemies": [
            { "type": "normal", "count": 18, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 9, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 1, "placement": "random", "delay": 150 }
        ]
    },
    "390": {
        "enemies": [
            { "type": "normal", "count": 19, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 9, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 1, "placement": "random", "delay": 150 }
        ]
    },
    "400": {
        "enemies": [
            { "type": "normal", "count": 20, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 10, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 1, "placement": "random", "delay": 150 }
        ]
    },
    "410": {
        "enemies": [
            { "type": "normal", "count": 21, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 10, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 2, "placement": "random", "delay": 150 }
        ]
    },
    "420": {
        "enemies": [
            { "type": "normal", "count": 22, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 11, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 2, "placement": "random", "delay": 150 }
        ]
    },
    "430": {
        "enemies": [
            { "type": "normal", "count": 23, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 11, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 2, "placement": "random", "delay": 150 }
        ]
    },
    "440": {
        "enemies": [
            { "type": "normal", "count": 24, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 12, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 2, "placement": "random", "delay": 150 }
        ]
    },
    "450": {
        "enemies": [
            { "type": "normal", "count": 25, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 12, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 3, "placement": "random", "delay": 150 }
        ]
    },
    "460": {
        "enemies": [
            { "type": "normal", "count": 26, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 13, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 3, "placement": "random", "delay": 150 }
        ]
    },
    "470": {
        "enemies": [
            { "type": "normal", "count": 27, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 13, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 3, "placement": "random", "delay": 150 }
        ]
    },
    "480": {
        "enemies": [
            { "type": "normal", "count": 28, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 14, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 3, "placement": "random", "delay": 150 }
        ]
    },
    "490": {
        "enemies": [
            { "type": "normal", "count": 29, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 14, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 4, "placement": "random", "delay": 150 }
        ]
    },
    "500": {
        "enemies": [
            { "type": "normal", "count": 30, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 15, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 4, "placement": "random", "delay": 150 }
        ]
    },
    "510": {
        "enemies": [
            { "type": "normal", "count": 31, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 15, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 4, "placement": "random", "delay": 150 }
        ]
    },
    "520": {
        "enemies": [
            { "type": "normal", "count": 32, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 16, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 5, "placement": "random", "delay": 150 }
        ]
    },
    "530": {
        "enemies": [
            { "type": "normal", "count": 33, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 16, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 5, "placement": "random", "delay": 150 }
        ]
    },
    "540": {
        "enemies": [
            { "type": "normal", "count": 34, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 17, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 5, "placement": "random", "delay": 150 }
        ]
    },
    "550": {
        "enemies": [
            { "type": "normal", "count": 35, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 17, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 6, "placement": "random", "delay": 150 }
        ]
    },
    "560": {
        "enemies": [
            { "type": "normal", "count": 36, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 18, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 6, "placement": "random", "delay": 150 }
        ]
    },
    "570": {
        "enemies": [
            { "type": "normal", "count": 37, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 18, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 6, "placement": "random", "delay": 150 }
        ]
    },
    "580": {
        "enemies": [
            { "type": "normal", "count": 38, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 19, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 7, "placement": "random", "delay": 150 }
        ]
    },
    "590": {
        "enemies": [
            { "type": "normal", "count": 39, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 19, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 7, "placement": "random", "delay": 150 }
        ]
    },
    "600": {
        "enemies": [
            { "type": "normal", "count": 40, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 20, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 7, "placement": "random", "delay": 150 }
        ]
    },
    "610": {
        "enemies": [
            { "type": "normal", "count": 41, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 20, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 8, "placement": "random", "delay": 150 }
        ]
    },
    "620": {
        "enemies": [
            { "type": "normal", "count": 42, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 21, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 8, "placement": "random", "delay": 150 }
        ]
    },
    "630": {
        "enemies": [
            { "type": "normal", "count": 43, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 21, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 8, "placement": "random", "delay": 150 }
        ]
    },
    "640": {
        "enemies": [
            { "type": "normal", "count": 44, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 22, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 9, "placement": "random", "delay": 150 }
        ]
    },
    "650": {
        "enemies": [
            { "type": "normal", "count": 45, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 22, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 9, "placement": "random", "delay": 150 }
        ]
    },
    "660": {
        "enemies": [
            { "type": "normal", "count": 46, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 23, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 9, "placement": "random", "delay": 150 }
        ]
    },
    "670": {
        "enemies": [
            { "type": "normal", "count": 47, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 23, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 9, "placement": "random", "delay": 150 }
        ]
    },
    "680": {
        "enemies": [
            { "type": "normal", "count": 48, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 24, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 10, "placement": "random", "delay": 150 }
        ]
    },
    "690": {
        "enemies": [
            { "type": "normal", "count": 49, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 24, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 10, "placement": "random", "delay": 150 }
        ]
    },
    "700": {
        "enemies": [
            { "type": "normal", "count": 50, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 25, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 10, "placement": "random", "delay": 150 }
        ]
    },
    "710": {
        "enemies": [
            { "type": "normal", "count": 51, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 25, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 11, "placement": "random", "delay": 150 }
        ]
    },
    "720": {
        "enemies": [
            { "type": "normal", "count": 52, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 26, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 11, "placement": "random", "delay": 150 }
        ]
    },
    "730": {
        "enemies": [
            { "type": "normal", "count": 53, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 26, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 11, "placement": "random", "delay": 150 }
        ]
    },
    "740": {
        "enemies": [
            { "type": "normal", "count": 54, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 27, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 12, "placement": "random", "delay": 150 }
        ]
    },
    "750": {
        "enemies": [
            { "type": "normal", "count": 55, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 27, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 12, "placement": "random", "delay": 150 }
        ]
    },
    "760": {
        "enemies": [
            { "type": "normal", "count": 56, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 28, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 12, "placement": "random", "delay": 150 }
        ]
    },
    "770": {
        "enemies": [
            { "type": "normal", "count": 57, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 28, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 13, "placement": "random", "delay": 150 }
        ]
    },
    "780": {
        "enemies": [
            { "type": "normal", "count": 58, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 29, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 13, "placement": "random", "delay": 150 }
        ]
    },
    "790": {
        "enemies": [
            { "type": "normal", "count": 59, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 29, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 13, "placement": "random", "delay": 150 }
        ]
    },
    "800": {
        "enemies": [
            { "type": "normal", "count": 60, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 30, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 14, "placement": "random", "delay": 150 }
        ]
    },
    "810": {
        "enemies": [
            { "type": "normal", "count": 61, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 30, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 14, "placement": "random", "delay": 150 }
        ]
    },
    "820": {
        "enemies": [
            { "type": "normal", "count": 62, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 31, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 14, "placement": "random", "delay": 150 }
        ]
    },
    "830": {
        "enemies": [
            { "type": "normal", "count": 63, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 31, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 15, "placement": "random", "delay": 150 }
        ]
    },
    "840": {
        "enemies": [
            { "type": "normal", "count": 64, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 32, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 15, "placement": "random", "delay": 150 }
        ]
    },
    "850": {
        "enemies": [
            { "type": "normal", "count": 65, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 32, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 15, "placement": "random", "delay": 150 }
        ]
    },
    "860": {
        "enemies": [
            { "type": "normal", "count": 66, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 33, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 16, "placement": "random", "delay": 150 }
        ]
    },
    "870": {
        "enemies": [
            { "type": "normal", "count": 67, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 33, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 16, "placement": "random", "delay": 150 }
        ]
    },
    "880": {
        "enemies": [
            { "type": "normal", "count": 68, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 34, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 16, "placement": "random", "delay": 150 }
        ]
    },
    "890": {
        "enemies": [
            { "type": "normal", "count": 69, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 34, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 16, "placement": "random", "delay": 150 }
        ]
    },
    "900": {
        "enemies": [
            { "type": "normal", "count": 70, "placement": "random", "delay": 50 },
            { "type": "squid", "count": 35, "placement": "random", "delay": 100 },
            { "type": "triangle", "count": 17, "placement": "random", "delay": 150 }
        ]
    }

};

export default gamePlan;
