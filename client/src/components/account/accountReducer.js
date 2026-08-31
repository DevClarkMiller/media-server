export const INITIAL_STATE = {
    firstname: "",
    lastname: "",
    email: "",
    password: ""
}

export const accountReducer = (state, action) =>{
    switch(action.type){
        case "CHANGE_INPUT":
            return{
                ...state,
                [action.payload.name]:action.payload.value
            }
        case "RESET_FIELDS":
            return state = INITIAL_STATE
        default:
            return state;
    }
}