import Grid from '@core/Grid';
import {
  VALID_CONDITIONS,
  VALID_DIRECTIONS,
  VALID_ADJACENCY,
  type State,
  type TransitionFromRule,
  type TransitionToRule,
  type Condition,
  type Cell
} from '@shared/types'
import RuleEngine from "./RuleEngine.model";

export interface SimulationParams{
  cellSize?: number,
  matrixWidth?: number,
  matrixHeight?: number,
}


export default class Simulation {
  states: Map<string,State>;
  rules!: TransitionFromRule;
  grid!: Grid<Cell>;
  
  cellSize: number= 10;
  matrixWidth: number=100;
  matrixHeight: number=100;
  
  constructor(states : State[],rules: TransitionFromRule, options: SimulationParams) {
    this.states= new Map();
    if(states.length==0){
      throw new Error("There are no states!");
    }
    
    for(const s of states){
      if(!s.name || !s.color)
	throw new Error("Incomplete state! "+JSON.stringify(s));
      
      if(!this.states.has(s.name))
	this.states.set(s.name, s);
      else
	throw new Error("Duplicate state name!");
    }

    
    //Will throw exception if invalid
    this.setRules(rules);
    
    this.cellSize= options.cellSize ?? this.cellSize;
    this.matrixWidth= typeof options.matrixWidth!="undefined" ? Math.trunc(options.matrixWidth) : this.matrixWidth; 
    this.matrixHeight= typeof options.matrixHeight!="undefined" ? Math.trunc(options.matrixHeight) : this.matrixHeight; 

    this.reset();
  }

  reset(){
    const distribution = this.getNormalizedInitialWeight();

    this.grid = new Grid<Cell>( this.matrixHeight, this.matrixWidth,
      (r,c)=>{
	return {state: this.returnStateDistributionBased(distribution) };
      }
    );
  }
  
  validateRules(rules: TransitionFromRule){
    //Since used in indirect recursion, need ahead declaration
    let validateCondition : (rule: Condition)=>void;
    
    const validateComposite= (rule: Condition)=>{
      if(Array.isArray(rule.children)){
	for(const c of rule.children)
	  validateCondition(c);
      }else
	throw new Error("validateComposite: children is either missing or not an array!");
    }

    const validateState= (rule: Condition)=>{
      //Assumes is being called only when mandatory
      if(rule.state){
	if(this.states.has(rule.state)){
	  return;
	} else
	  throw new Error("validateState: Unknown state "+rule.state);	
      }else
	throw new Error("validateState: state is missing for condition type "+rule.condition);      
    }

    const validateCount= (num : number | undefined, condition: (typeof VALID_CONDITIONS)[number] )=>{
      if(typeof num != 'undefined' && num!=null && !isNaN(num)){
	if(Number.isInteger(num) && num>=0 && num<=8)
	  return;
	else
	  throw new Error(num+" is not integer between 0 and 8 ");
      }else
	throw new Error("Value missing or not a number for "+condition);
    }    

    const validateIn= (rule: Condition)=>{
      if(Array.isArray(rule.values)){
	for(const num of rule.values)
	  validateCount(num, rule.condition);
      }else
	throw new Error("validateIn: values is either missing or not an array!");
    }

    const validateAdjacency= (rule: Condition)=>{
      //if not present it defaults to MOORE, hence valid
      if(!rule.adjacency)
	return;
      
      if(VALID_ADJACENCY.includes(rule.adjacency)){
	return;
      }else
	throw new Error("validateAdjacency: Unknown adjacency "+rule.adjacency);
    }

    const validateDirection= (rule: Condition)=>{
      if(rule.direction){
	if(VALID_DIRECTIONS.includes(rule.direction))
	  return;
	else
	  throw new Error("validateDirection: Unknown direction "+rule.direction);
      }else
	throw new Error("validateDirection: Missing direction!");
    }

    const validateProbability= (rule: Condition)=>{
      if(rule.probability){
	if(rule.probability >= 0 && rule.probability<=1)
	  return;
	else
	  throw new Error("validateProbability: Probability should be between 0 and 1");
      }else
	throw new Error("validateProbability: Missing probability!");
    }
    
    validateCondition= (rule: Condition)=>{
      if(rule.condition){
	if(VALID_CONDITIONS.includes(rule.condition)){
	  switch(rule.condition){
	    case "AND":
	    case "OR":
	      validateComposite(rule);
	      break;
	    case "EQ":
	    case "NEQ":
	    case "LT":
	    case "LTE":
	    case "GT":
	    case "GTE":
	      validateState(rule);
	      validateAdjacency(rule);
	      validateCount(rule.value, rule.condition);
	      break;
	    case "BTWN":
	      validateState(rule);
	      validateAdjacency(rule);
	      validateCount(rule.valueStart, rule.condition);
	      validateCount(rule.valueEnd, rule.condition);
	      break;
	    case "IN":
	      validateState(rule);
	      validateAdjacency(rule);
	      validateIn(rule);
	      break;
	    case "IS":
	      validateState(rule);
	      validateDirection(rule);
	      break;
	    case "RAND":
	      validateProbability(rule);
	      break;
	    case "DUMMY":
	    case "TRUE":
	      break;
	  }
	}else
	  throw new Error("validateCondition: Unknown condition "+rule.condition+" - Valid conditions are "+ VALID_CONDITIONS);
      }else
	throw new Error("validateCondition: Condition missing!");
      
    }
    
    const validateToRule= (rules: TransitionToRule)=>{
      for(const state in rules){
	if(this.states.has(state))
	  validateCondition(rules[state]);
	else
	  throw new Error("validateToRule: Unknown state "+state);
      }
    }
    
    
    const validateFromRule= (rules: TransitionFromRule)=>{
      for(const state in rules){
	if(this.states.has(state))
	  validateToRule(rules[state]);
	else
	  throw new Error("validateFromRule: Unknown state "+state);
      }
    }

    validateFromRule(rules);
  }

  tick(){
    const engine= new RuleEngine(this.grid, this.rules);
    this.grid=this.grid.map((cell,r,c,grid)=>engine.applyRulesToCell(cell!, r, c));
  }

  render(ctx: CanvasRenderingContext2D){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    this.grid.forEach((cell,r,c,grid)=>{
      ctx.fillStyle= this.states.get(cell!.state)?.color ?? ctx.fillStyle;
      ctx.fillRect(c*this.cellSize, r*this.cellSize, this.cellSize, this.cellSize);
    });
  }

  setRules(rules: TransitionFromRule, states?: State[]){
    const backupStateMap= this.states;

    try{
      if(states){		// If states are provided
	if(states.length==0){
	  throw new Error("There are no states!");
	}

	this.states= new Map();
	for(const s of states){
	  if(!s.name || !s.color)
	    throw new Error("Incomplete state! "+JSON.stringify(s));

	  if(!this.states.has(s.name))
	    this.states.set(s.name, s);
	  else
	    throw new Error("Duplicate state name!");
	}
      }
      
      //Will throw exception if invalid
      this.validateRules(rules);
      this.rules= rules;
      
    }catch(e: any){
      //Restore backup and rethrow
      this.states=backupStateMap;
      throw e;
    }
  }

  static hydrateFrom(partialSimulation : Partial<Simulation>){
    if(partialSimulation.states &&
      partialSimulation.rules && partialSimulation.grid){
      const hydrated= new Simulation(
	Array.from(partialSimulation.states.values()),
	partialSimulation.rules,
	{
	  cellSize: partialSimulation.cellSize,
	  matrixWidth: partialSimulation.matrixWidth,
	  matrixHeight: partialSimulation.matrixHeight,
	}
      )

      hydrated.grid= Grid.fromJSON(partialSimulation.grid);


      return hydrated;
    }else{
      throw new Error("Incomplete stored data! "+ partialSimulation);
    } 
  }

  private getNormalizedInitialWeight(){
    const statesCopy : (State & {normalizedWeight?: number} & {cumulativeWeight?: number})[] =
      Array.from(this.states.values(), value => structuredClone(value));

    //If empty just return
    if(statesCopy.length==0)
      return statesCopy;
    
    let sum = statesCopy.reduce<number>(
      (total,state)=>total+(Math.abs(state.weight)||0),
      0
    );

    if(sum===0){
      //If all 0, we consider all equal probability 
      statesCopy.forEach(state=>{state.normalizedWeight= 1/statesCopy.length})
    }
    else{
      //Normalize the weights
      const factor= 1/sum;
      statesCopy.forEach(state=>{state.normalizedWeight= (state.weight||0)*factor})
    }

    //Compute cumulative sum
    statesCopy.reduce((sum, obj) => {
      sum =sum+ (obj.normalizedWeight||0);
      obj.cumulativeWeight = sum;
      return sum;
    }, 0);
    
    return statesCopy;
  }

  returnStateDistributionBased(
    states : (State & {normalizedWeight?: number} & {cumulativeWeight?: number})[]
  ): string{
    const random = Math.random();

    for(let i=0; i<states.length; i++ ){
      if((states[i]?.normalizedWeight??0) > 0 &&
	random >= (states[i-1]?.cumulativeWeight??0) &&
	random <(states[i]?.cumulativeWeight ?? 1))
	{
	  return states[i].name;
	}
    }
    
    //Return last as fallback
    return states[states.length-1].name;
  }

}
