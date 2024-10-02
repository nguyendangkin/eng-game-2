import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const Practice = ({
    vocabulary,
    isVietnameseToEnglish,
    setShowPractice,
    progress,
    updateProgress,
}) => {
    const [currentWord, setCurrentWord] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [remainingWords, setRemainingWords] = useState(vocabulary);
    const [showWordInfo, setShowWordInfo] = useState(false);
    const [newLearnedWords, setNewLearnedWords] = useState([]);

    useEffect(() => {
        if (vocabulary.length > 0) {
            setRemainingWords([...vocabulary]);
            nextWord([...vocabulary]);
        }
    }, [vocabulary]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleSubmit();
            } else if (event.key === "Escape") {
                speakWord();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentWord, userAnswer, isAnswerSubmitted, showWordInfo]);

    const nextWord = (words = remainingWords) => {
        if (words.length === 0) {
            setCurrentWord(null);
            setFeedback("Chúc mừng! Bạn đã hoàn thành tất cả các từ.");
            return;
        }

        const index = Math.floor(Math.random() * words.length);
        setCurrentWord(words[index]);
        setUserAnswer("");
        setFeedback("");
        setIsAnswerSubmitted(false);
        setShowWordInfo(false);
    };

    const checkAnswer = () => {
        const correctAnswer = isVietnameseToEnglish
            ? currentWord.eng
            : currentWord.vi;
        const isCorrect =
            userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();

        if (isCorrect) {
            setFeedback("Đúng!");
            const newRemainingWords = remainingWords.filter(
                (word) => word !== currentWord
            );
            setRemainingWords(newRemainingWords);
            setNewLearnedWords([...newLearnedWords, currentWord]);
            setShowWordInfo(true);
        } else {
            setFeedback("Sai!");
            setShowWordInfo(true);
        }

        setIsAnswerSubmitted(true);
    };

    const handleSubmit = () => {
        if (isAnswerSubmitted) {
            if (showWordInfo) {
                nextWord();
            } else {
                setShowWordInfo(true);
            }
        } else {
            checkAnswer();
        }
    };

    const speakWord = () => {
        const utterance = new SpeechSynthesisUtterance(currentWord.eng);
        utterance.lang = "en-US";
        utterance.rate = 0.75;
        speechSynthesis.speak(utterance);
    };

    const saveProgressToFile = () => {
        const progressToSave = {
            totalWords: progress.totalWords,
            learnedWords: [...progress.learnedWords, ...newLearnedWords],
            isVietnameseToEnglish,
        };
        const blob = new Blob([JSON.stringify(progressToSave)], {
            type: "application/json",
        });
        saveAs(blob, "vocabulary_progress.json");
        updateProgress(newLearnedWords);
        setNewLearnedWords([]);
        setFeedback("Tiến độ đã được lưu vào file.");
    };

    useEffect(() => {
        if (currentWord) {
            setFeedback("");
        }
    }, [currentWord]);

    if (!currentWord) {
        return <div>{feedback}</div>;
    }

    return (
        <div id="practice">
            <h2>{isVietnameseToEnglish ? currentWord.vi : currentWord.eng}</h2>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Câu trả lời của bạn"
                disabled={isAnswerSubmitted}
            />
            <button onClick={handleSubmit}>
                {isAnswerSubmitted
                    ? showWordInfo
                        ? "Tiếp"
                        : "Xem thông tin"
                    : "Gửi"}
            </button>
            <button onClick={speakWord}>Phát âm</button>
            <button onClick={() => setShowPractice(false)}>
                Quay lại Menu
            </button>
            <p
                className={`feedback ${
                    isAnswerSubmitted
                        ? feedback === "Đúng!"
                            ? "correct"
                            : "incorrect"
                        : ""
                }`}
            >
                {feedback}
            </p>
            {isAnswerSubmitted && showWordInfo && (
                <div className="word-info">
                    <p>
                        {currentWord.eng} - {currentWord.vi} ({currentWord.type}
                        )
                        <br />
                        {currentWord.mean}
                        <br />
                        Ví dụ: {currentWord.example_eng} -{" "}
                        {currentWord.example_vi}
                    </p>
                </div>
            )}
            <div id="progress-bar">
                <div
                    id="progress"
                    style={{
                        width: `${
                            ((progress.learnedWords.length +
                                newLearnedWords.length) /
                                progress.totalWords) *
                            100
                        }%`,
                    }}
                ></div>
            </div>
            <button onClick={saveProgressToFile}>Lưu vào file</button>
        </div>
    );
};

export default Practice;
