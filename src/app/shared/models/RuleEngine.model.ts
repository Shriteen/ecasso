import Grid from "@core/Grid";
import {
  VALID_ADJACENCY,
  VALID_DIRECTIONS,
  type Cell,
  type Condition,
  type NeighbourCount,
  type TransitionFromRule
} from "@shared/types"

export default class RuleEngine{
  grid: Grid<Cell>;
  rules: TransitionFromRule;
  defaultState: string;

  constructor(grid: Grid<Cell>, rules: TransitionFromRule, defaultState: string){
    this.grid=grid;
    this.rules=rules;
    this.defaultState=defaultState;
  }

  applyRulesToCell(cell:Cell, r: number, c: number): Cell{
    const rulesForInputState = this.rules[cell.state]; 
    for(const targetState in rulesForInputState){
      const result = this.applyConditions({...cell, row: r,col:c}, rulesForInputState[targetState])
      if(result){
	return {...cell, state: targetState}
      }
    }

    return cell;
  }

  applyConditions(cell: Cell, rule: Condition): boolean{
    const condition= rule["condition"];
    
    switch(condition){
      case "EQ":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);
	return count==rule["value"];
      }
      case "NEQ":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count!=rule["value"];
      }
      case "LT":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count<rule["value"]!;
      }
      case "LTE":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count<=rule["value"]!;
      }
      case "GT":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count>rule["value"]!;
      }
      case "GTE":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count>=rule["value"]!;
      }
      case "BTWN":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return count>=rule["valueStart"]! && count<=rule["valueEnd"]!;
      }
      case "IN":{
	const count= this.getNeighbourCount(cell,rule["state"]!, rule["adjacency"]!);	
	return rule["values"]!.includes(count as NeighbourCount);
      }
      case "OR":{
	const subConditions= rule["children"]!;
	return subConditions.some((cond)=>this.applyConditions(cell, cond));
      }
      case "AND":{
	const subConditions= rule["children"]!;
	return subConditions.every((cond)=>this.applyConditions(cell, cond));
      }
      case "IS":{
	const n=this.getNeighbour(cell,rule["direction"]!);
	if(rule["state"]=="_ANY")
	  return n!=null && n.state !== this.defaultState;
	else
	  return n!=null && n.state==rule["state"]; 
      }
      case "DUMMY":
	break;
      case undefined:
	break;
      default:
	console.error("Unknown condition", condition);
    }

    return false;
  }

  getNeighbourCount(
    cell: Cell,
    state: string,
    type: (typeof VALID_ADJACENCY)[number]) : number
  {
    if(!type)
      type="MOORE";    
    
    let neighbours: (Cell|null)[];
    
    switch(type){
      case "MOORE":
	neighbours= this.grid.getAll8(cell.row! , cell.col!);
	break;
      case "MANHATTAN":
	neighbours= this.grid.getAdjacent4(cell.row!, cell.col!);
	break;
      case "DIAGONAL":
	neighbours= this.grid.getDiagonal4(cell.row!, cell.col!);
	break;
      default:
	console.log("Unknown neighbour type", type);
	return 0;
    }

    // Special case which means non default
    if(state==="_ANY"){
      return neighbours.filter((c)=> c!=null && c.state!= this.defaultState).length;
    }
    
    return neighbours.filter((c)=>c!=null && c.state==state).length;
  }

  getNeighbour(cell: Cell, direction: (typeof VALID_DIRECTIONS)[number]): (Cell|null){
    switch(direction){
      case "T":
	return this.grid.getTop(cell.row!, cell.col!);
      case "L":
	return this.grid.getLeft(cell.row!, cell.col!);
      case "R":
	return this.grid.getRight(cell.row!, cell.col!);
      case "B":
	return this.grid.getBottom(cell.row!, cell.col!);	
      case "TL":
	return this.grid.getTopLeft(cell.row!, cell.col!);	
      case "TR":
	return this.grid.getTopRight(cell.row!, cell.col!);	
      case "BL":
	return this.grid.getBottomLeft(cell.row!, cell.col!);	
      case "BR":
	return this.grid.getBottomRight(cell.row!, cell.col!);	
      default:
	console.log("Unknown direction", direction);	
    }
    return null;
  }
  
}
