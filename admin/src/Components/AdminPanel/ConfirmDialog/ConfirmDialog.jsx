import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn cancel-btn">
            No
          </button>
          <button onClick={onConfirm} className="btn confirm-btn">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
