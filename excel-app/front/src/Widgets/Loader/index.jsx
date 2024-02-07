import React from "react";
import "./style.css";

export default function Loader({visible, progress,}) {
  return visible ? (
    <>
      {progress && <div className="app-progress">{progress}%</div>}
      <div className="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </>
  ) : null;
}
