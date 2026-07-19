import { v4 as uuidv4 } from 'uuid'; 
import Simulation from "@shared/models/Simulation.model";
import { TransitionToRule, State, Condition, TransitionFromRule } from "@shared/types";

export type ConditionUI = Partial<Omit<Condition, "children">> &
                          {_id: string, children?: ConditionUI[], _excludeStateId?: string, _stateId?: string};

export type ToStateRulesUI= { to: string, _id: string , rule: ConditionUI};

export type StateUI= Partial<State> & {
  _id: string,
  rules: ToStateRulesUI[] 
}

export function simulationToStateUIarray(simulationState: Simulation): StateUI[]{
  return Array.from(simulationState.states.values()).map(x=>{
    return {
      _id: uuidv4(),
      ...x,
      rules: toStateRulesConverter(simulationState.rules[x.name])
    };
  });
}

function toStateRulesConverter(rules: TransitionToRule | undefined) : ToStateRulesUI[]{
  if(rules){
    return Object.keys(rules).map(key => ({
      to: key,
      _id: uuidv4(),
      rule: conditionUIconverter(rules[key])
    }));  
  }
  else return []
}

function conditionUIconverter(condition: Condition) : ConditionUI{
  const { children, ...childlessClone } = structuredClone(condition);

  return {
    _id: uuidv4(),
    ...childlessClone,
    ...(children?.length ? {children: children.map(c=>conditionUIconverter(c))}: {})
  }
}

export function convertToStates(states: StateUI[]) : State[]{
  const tempStates : State[]=[]
  for(const state of states){
    if(!state.name || !state.color)
      throw new Error("Incomplete state! "+ JSON.stringify(state));
    
    tempStates.push({name:state.name, color: state.color, weight: (state.weight??0)});
  }
  return tempStates; 
}

export function stateUIarrayToTransitionFromRules(states: StateUI[]): TransitionFromRule{
  const rules:TransitionFromRule={};
  //Not throwing exception on empty as those validation will happen on setRules
  for(const state of states){
    if(state.name){
      if(typeof rules[state.name]!='undefined'){
        throw new Error("Duplicate source state! "+state.name)        
      }
      rules[state.name]=transitionToRulesConverter(state.rules);
    }
  }
  return rules;
}

function transitionToRulesConverter(rules: ToStateRulesUI[]): TransitionToRule{
  const toRules:TransitionToRule={};
  for(const rule of rules){
    if(rule.to){
      if(typeof toRules[rule.to]!='undefined'){
        throw new Error("Duplicate target state! "+rule.to)        
      }
      toRules[rule.to]=conditionConverter(rule.rule);
    }
  }
  return toRules;
}

function conditionConverter(condition: ConditionUI) : Condition{
  const { _id, children, ...rule } = structuredClone(condition);

  /* rule can be partial but we assume it as complete,
     since runtime validation is in further stage */
  if(children){
    const mappedChildren: Condition[] = children.map(cond=>{
      return conditionConverter(cond);
    });
    return {...rule as Condition, children: mappedChildren};
  }
  else{
    return rule as Condition;
  }
}
