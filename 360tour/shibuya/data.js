var APP_DATA = {
  "scenes": [
    {
      "id": "0-entrance",
      "name": "Entrance",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1701,
      "initialViewParameters": {
        "yaw": 2.5962897758498222,
        "pitch": 0.23885034994493992,
        "fov": 1.3108730938557924
      },
      "linkHotspots": [
        {
          "yaw": 2.4639368136452404,
          "pitch": 0.7403527219636121,
          "rotation": 0,
          "target": "1-center"
        },
        {
          "yaw": 2.818123970085157,
          "pitch": 0.5124293772743354,
          "rotation": 0,
          "target": "2-living"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-center",
      "name": "Center",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3072,
      "initialViewParameters": {
        "yaw": 0.7872534155006541,
        "pitch": 0.17089751538831877,
        "fov": 1.3108730938557924
      },
      "linkHotspots": [
        {
          "yaw": 0.770881159344885,
          "pitch": 0.7601343291665543,
          "rotation": 0,
          "target": "2-living"
        },
        {
          "yaw": -2.924925534214392,
          "pitch": 0.6118502134027679,
          "rotation": 0,
          "target": "0-entrance"
        },
        {
          "yaw": -2.087037279414572,
          "pitch": 0.5683917885009429,
          "rotation": 0,
          "target": "3-kitchen"
        },
        {
          "yaw": -2.155488550250949,
          "pitch": 0.19223429732356934,
          "rotation": 0,
          "target": "4-bathroom"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-living",
      "name": "Living",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3200,
      "initialViewParameters": {
        "yaw": 0.04096180897537316,
        "pitch": 0.351844747421147,
        "fov": 1.3108730938557924
      },
      "linkHotspots": [
        {
          "yaw": -1.1116730164606246,
          "pitch": 0.7360855595949705,
          "rotation": 0,
          "target": "1-center"
        },
        {
          "yaw": -1.5025817024410077,
          "pitch": 0.3998401681787698,
          "rotation": 0,
          "target": "0-entrance"
        },
        {
          "yaw": -1.053719658994817,
          "pitch": 0.3751220384416172,
          "rotation": 0,
          "target": "3-kitchen"
        },
        {
          "yaw": -1.0768220313357393,
          "pitch": 0.06422176834692728,
          "rotation": 0,
          "target": "4-bathroom"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-kitchen",
      "name": "Kitchen",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3072,
      "initialViewParameters": {
        "yaw": 0.02350607755900569,
        "pitch": 0.39282096699110447,
        "fov": 1.3108730938557924
      },
      "linkHotspots": [
        {
          "yaw": 1.4183032975417582,
          "pitch": 0.2626896381145958,
          "rotation": 0,
          "target": "4-bathroom"
        },
        {
          "yaw": -1.3819150946526317,
          "pitch": 0.6278090317634053,
          "rotation": 0,
          "target": "1-center"
        },
        {
          "yaw": -1.4442060161747676,
          "pitch": 0.3755234128144007,
          "rotation": 0,
          "target": "2-living"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "4-bathroom",
      "name": "Bathroom",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3072,
      "initialViewParameters": {
        "yaw": 1.6181566290615077,
        "pitch": 0.1763627826516192,
        "fov": 1.3108730938557924
      },
      "linkHotspots": [
        {
          "yaw": 1.6327837766916753,
          "pitch": 1.0062493644656847,
          "rotation": 12.566370614359176,
          "target": "3-kitchen"
        },
        {
          "yaw": 1.584787933216779,
          "pitch": 0.561339916343135,
          "rotation": 0,
          "target": "1-center"
        },
        {
          "yaw": 1.510200665651242,
          "pitch": 0.3929733886818312,
          "rotation": 18.84955592153877,
          "target": "2-living"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
