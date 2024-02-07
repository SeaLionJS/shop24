let initialState = {page:"SALES", requiredConfirmation: false};
//SALES, MANAGER

const PageReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_PAGE":
      return {page: action.payload, requiredConfirmation: false};
    case "LOCK_PAGE":
      return {page: state.page, requiredConfirmation: true};
    case "UNLOCK_PAGE":
      return {page: state.page, requiredConfirmation: false};
    default:
      return state;
  }
};

export default PageReducer;
