const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_TECHNOLOGY":
      return {
        ...state,
        tech: action.text
      };
  
    default:
      return state;
  }
}