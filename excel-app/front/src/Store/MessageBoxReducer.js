let initialState = {
  visible: false, header:"", text:"", onAccept:()=>{}, onReject:()=>{}, isDefault: false
}

const MessageBoxReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SHOW_MESSAGEBOX":
      return {...action.payload, visible: true, isDefault: false};
    case "SHOW_MESSAGEBOX_DEFAULT":
      return {...action.payload, visible: true, isDefault: true};
    case "HIDE_MESSAGEBOX":
      return {visible: false};

    default:
      return state;
  }
};

export default MessageBoxReducer;