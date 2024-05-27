import React, {useState, useEffect} from "react";

const PopupError = ({ isOpen, message }) => {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
      setShow(isOpen);
      if (isOpen) {
        const timer = setTimeout(() => {
          setShow(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);
  

    const overlayStyle = {
        display: show ? 'block' : 'none',
        visibility: show ? 'visible' : 'hidden',
      };

  
    return (
        <div className="resulterror" style={overlayStyle}>
        <div className="resulterror-content">
          <div className="messageerror">
             <p>{message}</p>
          </div>
        </div>
      </div>
    );
  };

export default PopupError;