export const VALID_CONDITIONS = ["AND","OR","EQ","NEQ","LT","LTE","GT","GTE","BTWN","IN","IS","DUMMY","TRUE","RAND","MAJOR"] as const;
export const VALID_DIRECTIONS = ["T","B","L","R","TL","TR","BL","BR"] as const;
export const VALID_ADJACENCY = ["MOORE","MANHATTAN","DIAGONAL"] as const;


export interface State{
  name: string;
  color: string;
  weight: number;
}

export interface TransitionFromRule{
  [key: string]: TransitionToRule;
}

export interface TransitionToRule{
  [key: string]: Condition;
}


export type NeighbourCount = 0|1|2|3|4|5|6|7|8;

/* Ideally should be declared as multiple types which clearly define
which case can have which optional properties are needed in which
case. But since the shape of objects is going to be dynamic and not
available at compile time, it shouldn't matter. */
export interface Condition{
  condition: (typeof VALID_CONDITIONS)[number];
  children?: Condition[]; //Applicable for AND,OR
  state?: string; //Applicable to non-composite conditions
  direction?: (typeof VALID_DIRECTIONS)[number]; //Applicable for IS
  adjacency?: (typeof VALID_ADJACENCY)[number]; //Applicable for count based; MOORE is default is not given
  value?: NeighbourCount; // All relational
  valueStart?: NeighbourCount; // Applicable for BTWN
  valueEnd?: NeighbourCount; // Applicable for BTWN
  values?: NeighbourCount[]; //Applicable for IN
  probability?: number; //Applicable for RAND
  exclude?: boolean; //Applicable for MAJOR
  excludeState?: string; //Applicable for MAJOR 
}

export interface Cell{
  state: string,
  row?: number,
  col?: number,
}
