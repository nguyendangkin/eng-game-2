import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const Practice = ({ vocabulary, isVietnameseToEnglish, setShowPractice }) => {
    const [currentWord, setCurrentWord] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [remainingWords, setRemainingWords] = useState([...vocabulary]);
    const [correctWords, setCorrectWords] = useState(0);

    useEffect(() => {
        if (vocabulary.length > 0) {
            setRemainingWords([...vocabulary]);
            nextWord([...vocabulary]); // Chỉ gọi nextWord khi vocabulary có từ
        }
    }, [vocabulary]);

    useEffect(() => {
        // Thêm sự kiện bàn phím
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
    }, [currentWord, userAnswer, isAnswerSubmitted]); // Sử dụng dependency chính xác

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
            setCorrectWords(correctWords + 1);
        } else {
            setFeedback("Sai!");
        }

        setIsAnswerSubmitted(true);
    };

    const handleSubmit = () => {
        if (isAnswerSubmitted) {
            nextWord(); // Gọi nextWord khi đã gửi câu trả lời
        } else {
            checkAnswer();
        }
    };

    const speakWord = () => {
        const utterance = new SpeechSynthesisUtterance(currentWord.eng);
        utterance.lang = "en-US";
        utterance.rate = 0.75; // Điều chỉnh tốc độ phát âm
        speechSynthesis.speak(utterance);
    };

    const saveProgressToFile = () => {
        const progress = {
            remainingWords,
            correctWords,
        };
        const blob = new Blob([JSON.stringify(progress)], {
            type: "application/json",
        });
        saveAs(blob, "vocabulary_progress.json");
        setFeedback("Tiến độ đã được lưu vào file.");
    };

    useEffect(() => {
        if (currentWord) {
            setFeedback(""); // Reset feedback khi có từ mới
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
            />
            <button onClick={handleSubmit}>
                {isAnswerSubmitted ? "Tiếp" : "Gửi"}
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
            {isAnswerSubmitted && (
                <p>
                    {currentWord.eng} - {currentWord.vi} ({currentWord.type})
                    <br />
                    {currentWord.mean}
                    <br />
                    Ví dụ: {currentWord.example_eng} - {currentWord.example_vi}
                </p>
            )}
            <div id="progress-bar">
                <div
                    id="progress"
                    style={{
                        width: `${
                            ((vocabulary.length - remainingWords.length) /
                                vocabulary.length) *
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
