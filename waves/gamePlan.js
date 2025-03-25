// gamePlan.js

// This configuration object defines enemy wave setups indexed by the second at which they should trigger.
// There are 30 waves, each 10 seconds apart (i.e., at seconds 10, 20, ..., 300).
// Each wave contains an array of enemy spawn instructions.
// Each instruction includes the enemy type (only "normal", "squid", or "triangle"),
// the count to spawn, a placement strategy (e.g., "random", "left_edge", "right_edge"),
// and an optional delay (in milliseconds) to stagger the spawns within that wave.
const gamePlan_full = {
    "walls": [
      {
        "x": 960,
        "y": 10,
        "width": 1880,
        "height": 20,
        "roomId": 1
      },
      {
        "x": 960,
        "y": 1070,
        "width": 1880,
        "height": 20,
        "roomId": 1
      },
      {
        "x": 10,
        "y": 540,
        "width": 20,
        "height": 1040,
        "roomId": 1
      },
      {
        "x": 1910,
        "y": 267.5,
        "width": 20,
        "height": 495,
        "roomId": 1
      },
      {
        "x": 1910,
        "y": 812.5,
        "width": 20,
        "height": 495,
        "roomId": 1
      },
      {
        "x": 2980,
        "y": 10,
        "width": 1880,
        "height": 20,
        "roomId": 2
      },
      {
        "x": 2980,
        "y": 1070,
        "width": 1880,
        "height": 20,
        "roomId": 2
      },
      {
        "x": 2030,
        "y": 267.5,
        "width": 20,
        "height": 495,
        "roomId": 2
      },
      {
        "x": 2030,
        "y": 812.5,
        "width": 20,
        "height": 495,
        "roomId": 2
      },
      {
        "x": 3930,
        "y": 267.5,
        "width": 20,
        "height": 495,
        "roomId": 2
      },
      {
        "x": 3930,
        "y": 812.5,
        "width": 20,
        "height": 495,
        "roomId": 2
      },
      {
        "x": 5000,
        "y": 10,
        "width": 1880,
        "height": 20,
        "roomId": 3
      },
      {
        "x": 4517.5,
        "y": 1070,
        "width": 915,
        "height": 20,
        "roomId": 3
      },
      {
        "x": 5482.5,
        "y": 1070,
        "width": 915,
        "height": 20,
        "roomId": 3
      },
      {
        "x": 4050,
        "y": 267.5,
        "width": 20,
        "height": 495,
        "roomId": 3
      },
      {
        "x": 4050,
        "y": 812.5,
        "width": 20,
        "height": 495,
        "roomId": 3
      },
      {
        "x": 5950,
        "y": 540,
        "width": 20,
        "height": 1040,
        "roomId": 3
      },
      {
        "x": 4517.5,
        "y": 1190,
        "width": 915,
        "height": 20,
        "roomId": 4
      },
      {
        "x": 5482.5,
        "y": 1190,
        "width": 915,
        "height": 20,
        "roomId": 4
      },
      {
        "x": 4517.5,
        "y": 2250,
        "width": 915,
        "height": 20,
        "roomId": 4
      },
      {
        "x": 5482.5,
        "y": 2250,
        "width": 915,
        "height": 20,
        "roomId": 4
      },
      {
        "x": 4050,
        "y": 1720,
        "width": 20,
        "height": 1040,
        "roomId": 4
      },
      {
        "x": 5950,
        "y": 1720,
        "width": 20,
        "height": 1040,
        "roomId": 4
      },
      {
        "x": 4517.5,
        "y": 2370,
        "width": 915,
        "height": 20,
        "roomId": 5
      },
      {
        "x": 5482.5,
        "y": 2370,
        "width": 915,
        "height": 20,
        "roomId": 5
      },
      {
        "x": 5000,
        "y": 3430,
        "width": 1880,
        "height": 20,
        "roomId": 5
      },
      {
        "x": 4050,
        "y": 2900,
        "width": 20,
        "height": 1040,
        "roomId": 5
      },
      {
        "x": 5950,
        "y": 2627.5,
        "width": 20,
        "height": 495,
        "roomId": 5
      },
      {
        "x": 5950,
        "y": 3172.5,
        "width": 20,
        "height": 495,
        "roomId": 5
      },
      {
        "x": 7020,
        "y": 2370,
        "width": 1880,
        "height": 20,
        "roomId": 6
      },
      {
        "x": 7020,
        "y": 3430,
        "width": 1880,
        "height": 20,
        "roomId": 6
      },
      {
        "x": 6070,
        "y": 2627.5,
        "width": 20,
        "height": 495,
        "roomId": 6
      },
      {
        "x": 6070,
        "y": 3172.5,
        "width": 20,
        "height": 495,
        "roomId": 6
      },
      {
        "x": 7970,
        "y": 2627.5,
        "width": 20,
        "height": 495,
        "roomId": 6
      },
      {
        "x": 7970,
        "y": 3172.5,
        "width": 20,
        "height": 495,
        "roomId": 6
      },
      {
        "x": 8752,
        "y": 2532,
        "width": 1304,
        "height": 20,
        "roomId": 7
      },
      {
        "x": 8752,
        "y": 3268,
        "width": 1304,
        "height": 20,
        "roomId": 7
      },
      {
        "x": 8090,
        "y": 2708.5,
        "width": 20,
        "height": 333,
        "roomId": 7
      },
      {
        "x": 8090,
        "y": 3091.5,
        "width": 20,
        "height": 333,
        "roomId": 7
      },
      {
        "x": 9414,
        "y": 2708.5,
        "width": 20,
        "height": 333,
        "roomId": 7
      },
      {
        "x": 9414,
        "y": 3091.5,
        "width": 20,
        "height": 333,
        "roomId": 7
      },
      {
        "x": 10964,
        "y": 2100,
        "width": 2840,
        "height": 20,
        "roomId": 8
      },
      {
        "x": 10964,
        "y": 3700,
        "width": 2840,
        "height": 20,
        "roomId": 8
      },
      {
        "x": 9534,
        "y": 2492.5,
        "width": 20,
        "height": 765,
        "roomId": 8
      },
      {
        "x": 9534,
        "y": 3307.5,
        "width": 20,
        "height": 765,
        "roomId": 8
      },
      {
        "x": 12394,
        "y": 2900,
        "width": 20,
        "height": 1580,
        "roomId": 8
      },
      {
        "x": 1970,
        "y": 505,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          1,
          2
        ]
      },
      {
        "x": 1970,
        "y": 575,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          1,
          2
        ]
      },
      {
        "x": 3990,
        "y": 505,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          2,
          3
        ]
      },
      {
        "x": 3990,
        "y": 575,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          2,
          3
        ]
      },
      {
        "x": 4965,
        "y": 1130,
        "width": 20,
        "height": 100,
        "tunnelRooms": [
          3,
          4
        ]
      },
      {
        "x": 5035,
        "y": 1130,
        "width": 20,
        "height": 100,
        "tunnelRooms": [
          3,
          4
        ]
      },
      {
        "x": 4965,
        "y": 2310,
        "width": 20,
        "height": 100,
        "tunnelRooms": [
          4,
          5
        ]
      },
      {
        "x": 5035,
        "y": 2310,
        "width": 20,
        "height": 100,
        "tunnelRooms": [
          4,
          5
        ]
      },
      {
        "x": 6010,
        "y": 2865,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          5,
          6
        ]
      },
      {
        "x": 6010,
        "y": 2935,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          5,
          6
        ]
      },
      {
        "x": 8030,
        "y": 2865,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          6,
          7
        ]
      },
      {
        "x": 8030,
        "y": 2935,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          6,
          7
        ]
      },
      {
        "x": 9474,
        "y": 2865,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          7,
          8
        ]
      },
      {
        "x": 9474,
        "y": 2935,
        "width": 100,
        "height": 20,
        "tunnelRooms": [
          7,
          8
        ]
      }
    ],
    "waves": [
      {
        "number": 1,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 458.11795309910593,
            "y": 275.62143950767717,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 1
          },
          {
            "type": "gunner",
            "x": 1110.259633494493,
            "y": 275.62143950767717,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 1
          },
          {
            "type": "gunner",
            "x": 1530.0289909903745,
            "y": 867.7960688322241,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 1
          },
          {
            "type": "gunner",
            "x": 563.0602924730762,
            "y": 717.8784411551237,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 1
          }
        ]
      },
      {
        "number": 2,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 2541.972977810802,
            "y": 245.63791397225714,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 2
          },
          {
            "type": "gunner",
            "x": 3216.6023023577545,
            "y": 238.1420325884021,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 2
          },
          {
            "type": "gunner",
            "x": 2482.0059267399624,
            "y": 860.3001874483692,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 2
          },
          {
            "type": "gunner",
            "x": 3636.3716598536357,
            "y": 807.829017761384,
            "delay": 0,
            "placement": "right_edge",
            "count": 1,
            "roomId": 2
          }
        ]
      },
      {
        "number": 3,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 4325.992747168298,
            "y": 238.1420325884021,
            "delay": 0,
            "placement": "left_edge",
            "count": 1,
            "roomId": 3
          },
          {
            "type": "gunner",
            "x": 5360.424378140292,
            "y": 260.62967673996724,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 3
          },
          {
            "type": "gunner",
            "x": 4348.480391319863,
            "y": 845.3084246806591,
            "delay": 0,
            "placement": "left_edge",
            "count": 1,
            "roomId": 3
          },
          {
            "type": "gunner",
            "x": 5360.424378140292,
            "y": 837.8125432968039,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 3
          }
        ]
      },
      {
        "number": 4,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 4580.852714219369,
            "y": 1429.987172621351,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 4
          },
          {
            "type": "gunner",
            "x": 5570.309056888233,
            "y": 1459.970698156771,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 4
          },
          {
            "type": "gunner",
            "x": 4520.885663148529,
            "y": 1999.6741577943328,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 4
          },
          {
            "type": "gunner",
            "x": 5480.358480281971,
            "y": 1999.6741577943328,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 4
          }
        ]
      },
      {
        "number": 5,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 4468.414493461543,
            "y": 2659.311719573575,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 5
          },
          {
            "type": "gunner",
            "x": 5615.284345191362,
            "y": 2659.311719573575,
            "delay": 0,
            "placement": "right_edge",
            "count": 1,
            "roomId": 5
          },
          {
            "type": "gunner",
            "x": 4535.877425916239,
            "y": 3199.0151792111365,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 5
          },
          {
            "type": "gunner",
            "x": 5397.903785059567,
            "y": 3288.9657558173967,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 5
          }
        ]
      },
      {
        "number": 6,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 6469.814822950835,
            "y": 2674.3034823412845,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 6
          },
          {
            "type": "gunner",
            "x": 7189.419435800917,
            "y": 2689.295245108995,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 6
          },
          {
            "type": "gunner",
            "x": 6454.823060183126,
            "y": 3176.527535059571,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 6
          },
          {
            "type": "gunner",
            "x": 7339.337063478018,
            "y": 3199.0151792111365,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 6
          }
        ]
      },
      {
        "number": 7,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 8403.75221998543,
            "y": 2779.245821715255,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 7
          },
          {
            "type": "gunner",
            "x": 8793.538051945892,
            "y": 2809.2293472506753,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 7
          },
          {
            "type": "gunner",
            "x": 9085.877425916238,
            "y": 3124.0563653725862,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 7
          },
          {
            "type": "gunner",
            "x": 8463.71927105627,
            "y": 3124.0563653725862,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 7
          }
        ]
      },
      {
        "number": 8,
        "seconds": 10,
        "enemies": [
          {
            "type": "gunner",
            "x": 9865.44908983716,
            "y": 2449.427040825634,
            "delay": 0,
            "placement": "left_edge",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10877.39307665759,
            "y": 2419.4435152902142,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10442.631956393998,
            "y": 2599.3446685027343,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10442.631956393998,
            "y": 2599.3446685027343,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10352.681379787737,
            "y": 2576.8570243511695,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10352.681379787737,
            "y": 2576.8570243511695,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          },
          {
            "type": "gunner",
            "x": 10337.689617020027,
            "y": 2576.8570243511695,
            "delay": 0,
            "placement": "random",
            "count": 1,
            "roomId": 8
          }
        ]
      }
    ]
  }
const gamePlan = {
    "2": {
    "enemies":[]
    }
  }

var hah = {
    "2": {
        "enemies": [
            {
                "type": "mimic",
                "count": 10,
                "placement": "random",
                "delay": 0
            },
            {
                "type": "gunner",
                "count": 5,
                "placement": "random",
                "delay": 0
            },
            // {
            //     "type": "triangle",
            //     "count": 20,
            //     "placement": "random",
            //     "delay": 2000
            // }
        ]
    },
    // "20": {
    //     "enemies": [
    //         {
    //             "type": "gunner",
    //             "count": 1,
    //             "placement": "random",
    //             "delay": 100
    //         },
    //         {
    //             "type": "squid",
    //             "count": 5,
    //             "placement": "left_edge",
    //             "delay": 200
    //         }
    //     ]
    // },
    // "44": {
    //     "enemies": [
    //         {
    //             "type": "triangle",
    //             "count": 3,
    //             "placement": "random",
    //             "delay": 500
    //         }
    //     ]
    // },
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

export default gamePlan_full;
