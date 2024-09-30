import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Practice from "./Practice";
import ErrorMessage from "./ErrorMessage";
import vocabularyData from "./vocabularys.json";
import "./App.css";

const App = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [showPractice, setShowPractice] = useState(false);
    const [isVietnameseToEnglish, setIsVietnameseToEnglish] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        try {
            setVocabulary(vocabularyData);
        } catch (error) {
            console.error("Lỗi khi đọc file từ vựng:", error);
            setErrorMessage(
                "Không thể đọc file từ vựng. Vui lòng kiểm tra lại file vocabularys.json."
            );
        }
    }, []);

    const startPractice = (viToEn) => {
        setIsVietnameseToEnglish(viToEn);
        setShowPractice(true);
    };

    const loadProgressFromFile = (fileContent) => {
        const savedProgress = JSON.parse(fileContent);
        setVocabulary(savedProgress.remainingWords);
        startPractice(isVietnameseToEnglish); // Start practice with the current mode
    };

    return (
        <div className="App">
            <h1>Ứng dụng học từ vựng</h1>
            {!showPractice ? (
                <Menu
                    startPractice={startPractice}
                    loadProgress={loadProgressFromFile}
                />
            ) : (
                <Practice
                    vocabulary={vocabulary}
                    isVietnameseToEnglish={isVietnameseToEnglish}
                    setShowPractice={setShowPractice}
                />
            )}
            <ErrorMessage message={errorMessage} />
        </div>
    );
};

export default App;
