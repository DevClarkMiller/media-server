import { act } from "react";

export const INITIAL_STATE = [];

export const createURLReducer = (state, action) =>{
    switch(action.type){
        case "ADD_URL":
            state.push(action.payload)
            return state;   
        case "REMOVE_URL":
            state = state.filter((item) =>(
                //Removes the item from the state array based off of a given property
                item[action.payload.propname] !== action.payload.value
            ));      
            return state = INITIAL_STATE
        default:
            return state;
    }
}