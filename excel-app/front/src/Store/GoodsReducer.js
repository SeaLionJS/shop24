let initialState = [
 
];
//SALES, MANAGER

const GoodsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_GOODS":
      return [...action.payload];
    default:
      return state;
  }
};

export default GoodsReducer;
