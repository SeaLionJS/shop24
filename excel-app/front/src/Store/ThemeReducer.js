let initialState = localStorage.getItem("THEME");
if (!initialState) initialState = "abstract";


const ThemeReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_THEME":
      localStorage.setItem("THEME", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default ThemeReducer;
