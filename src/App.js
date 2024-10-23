import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Practice from "./Practice";
import ErrorMessage from "./ErrorMessage";
import vocabularyData from "./vocabularys.json";
import "./App.css";
import HeadAdSense from "./HeadAdSense";

const App = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [showPractice, setShowPractice] = useState(false);
    const [isVietnameseToEnglish, setIsVietnameseToEnglish] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [progress, setProgress] = useState({
        totalWords: 0,
        learnedWords: [],
        isVietnameseToEnglish: true,
    });

    useEffect(() => {
        try {
            setVocabulary(vocabularyData);
            setProgress({
                totalWords: vocabularyData.length,
                learnedWords: [],
                isVietnameseToEnglish: true,
            });
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
        setProgress(savedProgress);
        const remainingWords = vocabulary.filter(
            (word) =>
                !savedProgress.learnedWords.some(
                    (learnedWord) => learnedWord.eng === word.eng
                )
        );
        setVocabulary(remainingWords);
        setIsVietnameseToEnglish(savedProgress.isVietnameseToEnglish);
        startPractice(savedProgress.isVietnameseToEnglish);
    };

    const updateProgress = (newLearnedWords) => {
        setProgress((prevProgress) => ({
            ...prevProgress,
            learnedWords: [...prevProgress.learnedWords, ...newLearnedWords],
            isVietnameseToEnglish,
        }));
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
                    progress={progress}
                    updateProgress={updateProgress}
                />
            )}
            <ErrorMessage message={errorMessage} />
        </div>
    );
};

export default App;
