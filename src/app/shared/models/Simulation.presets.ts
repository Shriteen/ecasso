import {
  type State,
  type TransitionFromRule
} from '@shared/types';
import { SimulationParams } from './Simulation.model';

export type Preset = {
  name: string,
  states: State[];
  rules: TransitionFromRule,
  options: SimulationParams
};

const PRESETS = {
  //Blank is truly simple with single state and dummy rule
  "blank": {
    name: "Untitled",
    states: [{name:"default", color:"white", weight: 100}],
    rules: {
      default: {
	default:{
	  condition: "DUMMY",
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },
  
  //Conway’s Game of Life - The classic B3/S23
  "conway": {
    name: "Conway’s Game of Life (Classic)",
    states: [{name:"alive", color:"black", weight: 10},{name: "dead", color:"white", weight: 90}],
    rules: {
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 2
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 3
	    }
	  ]
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 3
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //HighLife B36/S23
  "highlife": {
    name: "HighLife",
    states: [{name:"alive", color:"black", weight: 10},{name: "dead", color:"white", weight: 90}],
    rules: {
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 2
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 3
	    }
	  ]
	}
      },
      dead: {
	alive: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 3
	    },
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 6
	    }
	  ]
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Seeds - explosive growth, no stable life B2/S never
  seeds: {
    name: "Seeds",
    states: [{name:"alive", color:"black", weight: 1},{name: "dead", color:"white", weight: 99}],
    rules: {
      alive: {
	dead: {
	  condition: "TRUE"
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 2
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  // Day & Night - symmetric chaotic crystallization B3678/S34678
  dayNight: {
    name: "Day & Night",
    states: [{name:"alive", color:"black", weight: 10},{name: "dead", color:"white", weight: 90}],
    rules: {
      alive: {
	dead: {
	  state: "alive",	  
	  condition: "IN",
	  values: [0,1,2,5]	  
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "IN",
	  values: [3,4,7,8] 
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Morley - glider-rich, structured chaos B368/S245
  morley: {
    name: "Morley",
    states: [{name:"alive", color:"black", weight: 25},{name: "dead", color:"white", weight: 80}],
    rules: {
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 2
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 5
	    },
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 3
	    }
	  ]
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "IN",
	  values: [3,6,8] 
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },
  
  //Life Without Death - irreversible growth, fractal expansion, B3/S012345678
  lifeWODeath: {
    name: "Life Without Death",
    states: [{name:"alive", color:"black", weight: 2},{name: "dead", color:"white", weight: 98}],
    rules: {
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 3
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //2x2 - block-based moving structures B36/S125
  twoByTwo: {
    name: "2x2",
    states: [{name:"alive", color:"black", weight: 10},{name: "dead", color:"white", weight: 90}],
    rules: {
      alive: {
	dead: {
	  state: "alive",
	  condition: "IN",
	  values: [0,3,4,6,7,8]
	}
      },
      dead: {
	alive: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 3
	    },
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 6
	    }
	  ] 
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Diamoeba - amoeba-like blobs, slow evolution B35678/S5678
  diamoeba: {
    name: "Diamoeba",
    states: [{name:"alive", color:"black", weight: 47.5},{name: "dead", color:"white", weight: 52.5}],
    rules: {
      alive: {
	dead: {
	  state: "alive",
	  condition: "LT",
	  value: 5
	}
      },
      dead: {
	alive: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 3
	    },
	    {
	      state: "alive",
	      condition: "GTE",
	      value: 5
	    }
	  ] 
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Anneal - diffusion-like smoothing dynamics B4678/S35678
  anneal : {
    name: "Anneal",
    states: [{name:"alive", color:"black", weight: 50},{name: "dead", color:"white", weight: 50}],
    rules: {
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 4
	    },
	    {
	      state: "alive",
	      condition: "LTE",
	      value: 2
	    }
	  ]
	}
      },
      dead: {
	alive: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "EQ",
	      value: 4
	    },
	    {
	      state: "alive",
	      condition: "GTE",
	      value: 6
	    }
	  ] 
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Replicator - diagonal replication, tiling growth B1357/S1357
  replicator : {
    name: "Replicator",
    states: [{name:"alive", color:"black", weight: 0.1},{name: "dead", color:"white", weight: 99.9}],
    rules: {
      alive: {
	dead: {
	  state: "alive",
	  condition: "IN",
	  values: [0,2,4,6,8]
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "IN",
	  values: [1,3,5,7]
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Brian's Brain - wave propagation, neural firing patterns
  //States: 3 (0 ready, 1 firing, 2 refractory) - Rule: 0 → 1 if exactly 2 ready neighbors,1 → 2 always, 2 → 0 always
  brain: {
    name: "Brian's Brain",
    states: [{name:"ready", color:"white", weight: 80},{name: "firing", color:"black", weight: 20},{name: "refractory", color:"blue", weight: 0}],
    rules: {
      ready: {
	firing: {
	  state: "firing",
	  condition: "EQ",
	  value: 2
	}
      },
      firing: {
	refractory: {
	  condition: "TRUE"
	}
      },
      refractory: {
	ready: {
	  condition: "TRUE"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Star Wars 
  //States: n (0,1, 2 ...) - Rule: 0 → 1 if exactly 2 "1" neighbors,1 survives if 3,4,5 neighbours in "1" state else 2 , 2 → 3 always, 3 → 0 always
  starwars: {
    name: "Star Wars",
    states: [
      {name:"dead", color:"black", weight: 95},
      {name: "alive", color:"yellow", weight: 5},
      {name: "ageing 1", color:"orange", weight: 0},
      {name: "ageing 2", color:"red", weight: 0}
    ],
    rules: {
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 2
	}
      },
      alive: {
	"ageing 1": {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 3
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 5
	    }
	  ]
	}
      },
      "ageing 1": {
	"ageing 2": {
	  condition: "TRUE"
	}
      },
      "ageing 2": {
	dead: {
	  condition: "TRUE"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Lines, States: (0,1,2,3) - B458/S012345
  lines: {
    name: "Lines",
    states: [
      {name:"dead", color:"white", weight: 90},
      {name: "alive", color:"#000e52", weight: 10},
      {name: "ageing 1", color:"#3584e4", weight: 0},
      {name: "ageing 2", color:"cyan", weight: 0}
    ],
    rules: {
      dead: {
	alive: {
	  state: "alive",
	  condition: "IN",
	  values: [4,5,8]
	}
      },
      alive: {
	"ageing 1": {
	  state: "alive",
	  condition: "GT",
	  value: 5
	}
      },
      "ageing 1": {
	"ageing 2": {
	  condition: "TRUE"
	}
      },
      "ageing 2": {
	dead: {
	  condition: "TRUE"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //9:43 at Knight, States: (0,1,2,3,4) - B34578/S237/4
  knight: {
    name: "9:43 at Knight",
    states: [
      {name:"dead", color:"white", weight: 91},
      {name: "alive", color:"#137f3b", weight: 9},
      {name: "ageing 1", color:"#2ec27e", weight: 0},
      {name: "ageing 2", color:"#00ff00", weight: 0},
      {name: "ageing 3", color:"#a6ff96", weight: 0}
    ],
    rules: {
      dead: {
	alive: {
	  state: "alive",
	  condition: "IN",
	  values: [3,4,5,7,8]
	}
      },
      alive: {
	"ageing 1": {
	  state: "alive",
	  condition: "IN",
	  values: [0,1,4,5,6,8]
	}
      },
      "ageing 1": {
	"ageing 2": {
	  condition: "TRUE"
	}
      },
      "ageing 2": {
	"ageing 3": {
	  condition: "TRUE"
	}
      },
      "ageing 3": {
	dead: {
	  condition: "TRUE"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Greenberg–Hastings, States: [0,1 (excited),2,3],
  //Rules: 0 → 1 if ≥1 excited neighbour, 1 → 2,2 → 3 → ... → 0
  greenbergHastings: {
    name: "Greenberg–Hastings",
    states: [
      {name:"resting", color:"white", weight: 99},
      {name: "excited", color:"#32ab5f", weight: 1},
      {name: "refractory", color:"#1be846", weight: 0},
      {name: "ageing", color:"#9ef510", weight: 0}
    ],
    rules: {
      resting: {
	excited: {
	  state: "excited",
	  condition: "GTE",
	  value: 1
	}
      },
      excited: {
	refractory: {
	  condition: "TRUE"
	}
      },
      refractory: {
	ageing: {
	  condition: "TRUE"
	}
      },
      ageing: {
	resting: {
	  condition: "TRUE"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Von-Neumann Life - B2/S23
  "vonNeumann": {
    name: "Von-Neumann Life",
    states: [{name:"alive", color:"black", weight: 40},{name: "dead", color:"white", weight: 60}],
    rules: {
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 2,
	      adjacency: "MANHATTAN"
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 3,
	      adjacency: "MANHATTAN"
	    }
	  ]
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 2,
	  adjacency: "MANHATTAN"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Maze - Diagonal neighbours B2/S012
  maze: {
    name: "Maze",
    states: [{name:"alive", color:"black", weight: 25},{name: "dead", color:"white", weight: 75}],
    rules: {
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 2,
	  adjacency: "DIAGONAL"
	}
      },
      alive: {
	dead: {
	  state: "alive",
	  condition: "GT",
	  value: 2,
	  adjacency: "DIAGONAL"
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Waterfall
  waterfall: {
    name: "Waterfall",
    states: [
      {name:"Drop", color:"cyan", weight: 0.1},
      {name: "Darkness", color:"#241f31", weight: 90},
      {name: "Trail", color:"#127687", weight: 0},
      {name: "Dirt", color:"#63452c", weight: 10},
      {name: "Stone", color:"#5e5c64", weight: 1}
    ],
    rules: {
      Drop: {
	Trail: {
	  condition: "TRUE"
	}
      },
      Darkness: {
	Drop: {
	  condition: "OR",
	  children: [
            {
              state: "Drop",
              condition: "IS",
              direction: "T",
            },
            {
              condition: "AND",
              children: [
		{
		  condition: "IS",
		  direction: "L",
		  state: "Dirt"
		},
		{
		  condition: "IS",
		  direction: "TL",
		  state: "Drop"
		}
              ]
            },
            {
              condition: "AND",
              children: [
		{
		  condition: "IS",
		  direction: "R",
		  state: "Dirt"
		},
		{
		  condition: "IS",
		  direction: "TR",
		  state: "Drop"
		}
              ]
            }
	  ]
	}
      },
      Trail: {
	Darkness: {
	  condition: "TRUE"
	}
      },
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Colors
  colors: {
    name: "Colors",
    states: [
      { name: "Red", color: "#e01b24", weight: 1 },
      { name: "Orange", color: "#ff7800", weight: 0 },
      { name: "Yellow", color: "#f6d32d", weight: 0 },
      { name: "Green", color: "#33d17a", weight: 0 },
      { name: "Blue", color: "#16d5ff", weight: 0 },
      { name: "Indigo", color: "#0b199e", weight: 0 },
      { name: "Violet", color: "#5b25ce", weight: 0 }
    ],
    rules: {
      Red: {
        Orange: {
          condition: "RAND",
          adjacency: "MOORE",
          probability: 0.8
        }
      },
      Orange: {
        Yellow: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      },
      Yellow: {
        Green: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      },
      Green: {
        Blue: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      },
      Blue: {
        Indigo: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      },
      Indigo: {
        Violet: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      },
      Violet: {
        Red: {
          adjacency: "MOORE",
          condition: "RAND",
          probability: 0.8
        }
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //Immigration - Conway's Game of life with factions
  immigration: {
    name: "Immigration",
    states: [{name:"default",color:"#ffffff",weight:80}, {name:"Red",color:"#ed333b",weight:10}, {name:"Blue",color:"#3584e4",weight:10}],
    rules: {
      default: {
	Red: {
	  condition: "AND",
	  children: [
	    { condition: "EQ", adjacency: "MOORE", state: "default", value: 5 },
	    { condition: "MAJOR", adjacency: "MOORE", state: "Red", exclude: true, excludeState: "default" }
	  ]
	},
	Blue: {
	  condition: "AND",
	  children: [
	    { condition: "EQ", adjacency: "MOORE", state: "default", value: 5 },
	    { condition: "MAJOR", adjacency: "MOORE", state: "Blue", exclude: true, excludeState: "default" }
	  ]
	}
      },
      Red: {
	default: {
	  condition: "OR",
	  children: [
	    { condition: "GT", adjacency: "MOORE", state: "default", value: 6 },
	    { condition: "LT", adjacency: "MOORE", state: "default", value: 5 }
	  ]
	}
      },
      Blue: {
	default: {
	  condition: "OR",
	  children: [
	    { condition: "GT", adjacency: "MOORE", state: "default", value: 6 },
	    { condition: "LT", adjacency: "MOORE", state: "default", value: 5 }
	  ]
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  //QuadLife - Conway's Game of life with 4 factions
  quadlife: {
    name: "QuadLife",
    states: [
      {name:"default", color:"#ffffff", weight:60},
      {name:"Red", color:"#e01b24", weight:10},
      {name:"Green", color:"#33d17a", weight:10},
      {name:"Blue", color:"#3584e4", weight:10},
      {name:"Yellow", color:"#f6d32d", weight:10}
    ],
    rules: {
      default: {
	Red: {
	  condition: "AND",
	  children: [
            { condition:"EQ", adjacency:"MOORE", state:"default", value:5 },
            {
              condition:"OR",
              children:[
		{ condition:"MAJOR", adjacency:"MOORE", state:"Red" , exclude:true, excludeState:"default"},
		{
		  condition:"AND",
		  children:[
                    { condition:"EQ", adjacency:"MOORE", state:"Green", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Blue", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Yellow", value:1 }
		  ]
		}
              ]
            }
	  ]
	},
	Green: {
	  condition: "AND",
	  children: [
            { condition:"EQ", adjacency:"MOORE", state:"default", value:5},
            {
              condition:"OR",
              children:[
		{ condition:"MAJOR", adjacency:"MOORE", state:"Green" , exclude:true, excludeState:"default"},
		{
		  condition:"AND",
		  children:[
                    { condition:"EQ", adjacency:"MOORE", state:"Red", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Blue", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Yellow", value:1 }
		  ]
		}
              ]
            }
	  ]
	},
	Blue: {
	  condition: "AND",
	  children: [
            { condition:"EQ", adjacency:"MOORE", state:"default", value:5 },
            {
              condition:"OR",
              children:[
		{ condition:"MAJOR", adjacency:"MOORE", state:"Blue", exclude:true, excludeState:"default" },
		{
		  condition:"AND",
		  children:[
                    { condition:"EQ", adjacency:"MOORE", state:"Red", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Green", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Yellow", value:1 }
		  ]
		}
              ]
            }
	  ]
	},
	Yellow: {
	  condition: "AND",
	  children: [
            { condition:"EQ", adjacency:"MOORE", state:"default", value:5 },
            {
              condition:"OR",
              children:[
		{ condition:"MAJOR", adjacency:"MOORE", state:"Yellow",exclude:true, excludeState:"default" },
		{
		  condition:"AND",
		  children:[
                    { condition:"EQ", adjacency:"MOORE", state:"Red", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Green", value:1 },
                    { condition:"EQ", adjacency:"MOORE", state:"Blue", value:1 }
		  ]
		}
              ]
            }
	  ]
	}
      },
      Red: {
	default: {
	  condition:"OR",
	  children:[
            { condition:"GT", adjacency:"MOORE", state:"default", value:6 },
            { condition:"LT", adjacency:"MOORE", state:"default", value:5 }
	  ]
	}
      },
      Green: {
	default: {
	  condition:"OR",
	  children:[
            { condition:"GT", adjacency:"MOORE", state:"default", value:6 },
            { condition:"LT", adjacency:"MOORE", state:"default", value:5 }
	  ]
	}
      },
      Blue: {
	default: {
	  condition:"OR",
	  children:[
            { condition:"GT", adjacency:"MOORE", state:"default", value:6 },
            { condition:"LT", adjacency:"MOORE", state:"default", value:5 }
	  ]
	}
      },
      Yellow: {
	default: {
	  condition:"OR",
	  children:[
            { condition:"GT", adjacency:"MOORE", state:"default", value:6 },
            { condition:"LT", adjacency:"MOORE", state:"default", value:5 }
	  ]
	}
      }
    },
    options: {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
  },

  
} as const satisfies Record<string, Preset>;

export type SimulationPresetName = keyof typeof PRESETS;

export const SIMULATION_PRESET_NAMES = (Object.entries(PRESETS) as [string, Preset][]).map(([key, value])=>{
  return {enum:key, displayValue: value.name };
}) ;

export function getSimulationPreset(name: string) {
  if (name in PRESETS) {
    return structuredClone(PRESETS[name as SimulationPresetName]);
  }

  throw new Error(`Invalid preset name: ${name}`);
}
