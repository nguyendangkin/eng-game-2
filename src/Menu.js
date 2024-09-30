import React, { useRef } from "react";

const Menu = ({ startPractice, loadProgress }) => {
    const fileInputRef = useRef(null); // Reference cho input file

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            loadProgress(e.target.result); // Gọi hàm loadProgress từ App
        };
        reader.readAsText(file);
    };

    const loadProgressFromFile = () => {
        fileInputRef.current.click(); // Tự động mở file input
    };

    return (
        <div id="menu">
            <button onClick={() => startPractice(false)}>
                Tiếng Anh sang Tiếng Việt
            </button>
            <button onClick={() => startPractice(true)}>
                Tiếng Việt sang Tiếng Anh
            </button>
            <button onClick={loadProgressFromFile}>Tải tiến độ</button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: "none" }} // Ẩn input file
            />
        </div>
    );
};

export default Menu;
