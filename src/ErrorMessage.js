import React from "react";

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div id="error-message" style={{ color: "red" }}>
            {message}
        </div>
    );
};

export default ErrorMessage;
