import React, { useState, useEffect, useRef } from 'react';
import './ExhibitDisplay.css';

const ExhibitDisplay = () => {
    const exhibitData = [
        {
            id: 1,
            title: '晨曦之光',
            imageUrl: require('../assets/images/collection/work1.jpg'),
            description: '一個寧靜的港口景色，紅色的日出映照在水面上，營造出一種夢幻的氛圍。',
        },
        {
            id: 2,
            title: '慶典之日',
            imageUrl: require('../assets/images/collection/work2.jpg'),
            description: '一場城市慶典，街道兩側掛滿了紅白藍色的旗幟，充滿歡慶的氣氛。',
        },
        {
            id: 3,
            title: '秋日幽徑',
            imageUrl: require('../assets/images/collection/work3.jpg'),
            description: '一片秋日的森林景色，金黃色的樹葉與幽靜的小徑營造出一種和諧自然的感覺。',
        },
        {
            id: 4,
            title: '秋色映湖',
            imageUrl: require('../assets/images/collection/work4.jpg'),
            description: '秋天的樹林景象，鮮艷的紅、黃、綠色彩交織在一起，反映在靜謐的湖水中，充滿生機與活力。',
        },
        {
            id: 5,
            title: '星月夜語',
            imageUrl: require('../assets/images/collection/work5.jpg'),
            description: '一片靜謐的夜空，紫色的天空下，滿天星斗與新月輝映，地面上點綴著盛開的紅花，營造出夢幻的氛圍。',
        },
        {
            id: 6,
            title: '靜海孤帆',
            imageUrl: require('../assets/images/collection/work6.jpg'),
            description: '一艘孤帆在寧靜的海面上航行，粉紅色的雲彩映照在平靜的海水上，充滿了平和與寧靜的感覺。',
        },
    ];

    const [currentExhibitIndex, setCurrentExhibitIndex] = useState(0);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        // 檢查瀏覽器是否支持 speechSynthesis
        if (!('speechSynthesis' in window)) {
            console.error('此瀏覽器不支持 Web Speech API');
            return;
        }

        const exhibit = exhibitData[currentExhibitIndex];

        const speakExhibitDetails = () => {
            const utterance = new SpeechSynthesisUtterance(
                `展覽品名稱：${exhibit.title}。詳細資訊：${exhibit.description}`
            );
            utterance.lang = 'zh-TW';
            utterance.rate = 1; // 語速，可根據需要調整
            utterance.pitch = 1; // 音調，可根據需要調整

            utterance.onstart = () => {
                console.log('語音朗讀開始');
            };

            utterance.onend = () => {
                console.log('語音朗讀結束');
                setIsDetailVisible(false);
                setCurrentExhibitIndex((prevIndex) => (prevIndex + 1) % exhibitData.length);

                timeoutRef.current = setTimeout(() => {
                    setIsDetailVisible(true);
                }, 5000);
            };

            utterance.onerror = (e) => {
                console.error('語音朗讀出錯：', e.error);
                setIsDetailVisible(false);
                setCurrentExhibitIndex((prevIndex) => (prevIndex + 1) % exhibitData.length);

                timeoutRef.current = setTimeout(() => {
                    setIsDetailVisible(true);
                }, 5000);
            };

            // 開始語音朗讀
            window.speechSynthesis.speak(utterance);
        };

        if (isDetailVisible) {
            speakExhibitDetails();
        } else {
            timeoutRef.current = setTimeout(() => {
                setIsDetailVisible(true);
            }, 5000);
        }

        // 清理函數，組件卸載或狀態變化時清理 timeout 和停止語音
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.speechSynthesis.cancel();
        };
    }, [isDetailVisible, currentExhibitIndex, exhibitData]);

    return (
        <div className="exhibit-display-container">
            <h1>展覽品展示區</h1>
            {!isDetailVisible ? (
                <div className="exhibit-list">
                    {exhibitData.map((exhibit) => (
                        <div key={exhibit.id} className="exhibit-item">
                            <img src={exhibit.imageUrl} alt={exhibit.title} />
                            <h2>{exhibit.title}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="exhibit-detail">
                    <img
                        src={exhibitData[currentExhibitIndex].imageUrl}
                        alt={exhibitData[currentExhibitIndex].title}
                    />
                    <h2>{exhibitData[currentExhibitIndex].title}</h2>
                    <p>{exhibitData[currentExhibitIndex].description}</p>
                </div>
            )}
        </div>
    );
};

export default ExhibitDisplay;
