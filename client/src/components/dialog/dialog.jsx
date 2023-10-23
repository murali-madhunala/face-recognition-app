import React from "react";

import { useDialogPolyfill } from "./useDialogPolyfill";

export function Modal({ closeOnOutsideClick, onRequestClose, open, ...props }) {
  const dialogRef = React.useRef(null);
  const lastActiveElement = React.useRef(null);
  const firstRender = React.useRef(true);

  useDialogPolyfill(dialogRef);

  React.useEffect(() => {
    // prevents calling imperative methods on mount since the polyfill will throw an error since we are not using the `open` attribute
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      const dialogNode = dialogRef.current;
      if (open) {
        lastActiveElement.current = document.activeElement;
        dialogNode.showModal();
      } else {
        dialogNode.close();
        lastActiveElement?.current?.focus();
      }
    }
  }, [open]);

  React.useEffect(() => {
    const dialogNode = dialogRef.current;
    const handleCancel = event => {
      event.preventDefault();
      onRequestClose();
    };
    dialogNode.addEventListener("cancel", handleCancel);
    return () => {
      dialogNode.removeEventListener("cancel", handleCancel);
    };
  }, [onRequestClose]);

  function handleOutsideClick(event) {
    const dialogNode = dialogRef.current;
    if (closeOnOutsideClick && event.target === dialogNode) {
      onRequestClose();
    }
  }

  return (
    <dialog ref={dialogRef} style={{ padding: 0 }} onClick={handleOutsideClick}>
      <div {...props} />
    </dialog>
  );
}
