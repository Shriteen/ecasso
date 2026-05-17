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
  initializer?: (grid: Grid<Cell>)=>void
}


export default class Simulation {
  states: Map<string,State>;
  defaultState: string;
  rules!: TransitionFromRule;
  grid!: Grid<Cell>;
  
  cellSize: number= 10;
  matrixWidth: number=100;
  matrixHeight: number=100;
  initializer?: (grid: Grid<Cell>)=>void;
  
  constructor(states : State[],defaultState: string,rules: TransitionFromRule, options: SimulationParams) {
    this.states= new Map();
    for(const s of states){
      if(!s.name || !s.color)
	throw new Error("Incomplete state! "+JSON.stringify(s));
      
      if(!this.states.has(s.name))
	this.states.set(s.name, s);
      else
	throw new Error("Duplicate state name!");
    }

    if(this.states.has(defaultState))
      this.defaultState=defaultState;
    else
      throw new Error("Unknown state set as default!");

    //Will throw exception if invalid
    this.setRules(rules);
    
    this.cellSize= options.cellSize ?? this.cellSize;
    this.matrixWidth= typeof options.matrixWidth!="undefined" ? Math.trunc(options.matrixWidth) : this.matrixWidth; 
    this.matrixHeight= typeof options.matrixHeight!="undefined" ? Math.trunc(options.matrixHeight) : this.matrixHeight; 
    this.initializer= options.initializer;

    this.reset();
  }

  reset(){
    this.grid = new Grid<Cell>( this.matrixHeight, this.matrixWidth,
      (r,c)=>{return {state: this.defaultState}}
    );

    if(this.initializer){
      this.initializer(this.grid);
    }

    this.tick();
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
	if(rule.state==='_ANY' || this.states.has(rule.state)){
	  return;
	} else
	  throw new Error("validateState: Unknown state "+rule.state);	
      }else
	throw new Error("validateState: state is missing for condition type "+rule.condition);      
    }

    const validateCount= (num : number | undefined, condition: (typeof VALID_CONDITIONS)[number] )=>{
      if(num && !isNaN(num)){
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
	    case "DUMMY":
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
    const engine= new RuleEngine(this.grid, this.rules, this.defaultState);
    this.grid=this.grid.map((cell,r,c,grid)=>engine.applyRulesToCell(cell!, r, c));
  }

  render(ctx: CanvasRenderingContext2D){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    this.grid.forEach((cell,r,c,grid)=>{
      ctx.fillStyle= this.states.get(cell!.state)?.color ??
	this.states.get(this.defaultState)?.color ??
	ctx.fillStyle;
      ctx.fillRect(c*this.cellSize, r*this.cellSize, this.cellSize, this.cellSize);
    });
  }

  setRules(rules: TransitionFromRule, states?: State[], defaultState?: string){
    const backupStateMap= this.states;
    const backupDefaultState= this.defaultState;

    try{
      if(states){		// If states are provided
	this.states= new Map();
	for(const s of states){
	  if(!s.name || !s.color)
	    throw new Error("Incomplete state! "+JSON.stringify(s));

	  if(!this.states.has(s.name))
	    this.states.set(s.name, s);
	  else
	    throw new Error("Duplicate state name!");
	}

	if(defaultState){	// If default state is provided
	  if(this.states.has(defaultState))
	    this.defaultState=defaultState;
	  else
	    throw new Error("Unknown state set as default!");
	}
      }
      
      //Will throw exception if invalid
      this.validateRules(rules);
      this.rules= rules;
      
    }catch(e: any){
      //Restore backup and rethrow
      this.states=backupStateMap;
      this.defaultState=backupDefaultState;
      throw e;
    }
  }

}
