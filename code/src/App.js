import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Carousel from './components/Carousel';
import NewsInfo from './components/NewsInfo';
import Collections from './components/Collections';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import Work1 from './components/Work1';
import Work2 from './components/Work2';
import Work3 from './components/Work3';
import SmartGuide from './components/SmartGuide';
import ExhibitDisplay from './components/ExhibitDisplay';
import Drop1 from './components/Drop1';
import Drop2 from './components/Drop2';
import Drop3 from './components/Drop3';
import Drop4 from './components/Drop4';
import Drop5 from './components/Drop5';
import Drop6 from './components/Drop6';
import Drop7 from './components/Drop7';
import Drop8 from './components/Drop8';
import Drop9 from './components/Drop9';
import Drop10 from './components/Drop10';
import Drop11 from './components/Drop11';
import Drop12 from './components/Drop12';
import Drop13 from './components/Drop13';
import Drop14 from './components/Drop14';
import Drop15 from './components/Drop15';
import Drop16 from './components/Drop16';
import Drop17 from './components/Drop17';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [guideData, setGuideData] = useState(null);

    useEffect(() => {
        if (currentPage === '智慧導覽' && !guideData) {
            axios.get('http://127.0.0.1:5000/api/guide')
                .then(response => {
                    setGuideData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching guide data:', error);
                    setGuideData({ error: '無法加載數據，請稍後重試。' });
                });
        }
    }, [currentPage, guideData]); // 當currentPage變成"智慧導覽"且guideData為空時觸發請求

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <>
                        <Carousel />
                        <NewsInfo />
                        <Collections onSearch={() => setCurrentPage('searchResults')} setCurrentPage={setCurrentPage} />
                    </>
                );
            case 'searchResults':
                return <SearchResults />;
            case 'work1':
                return <Work1 />;
            case 'work2':
                return <Work2 />;
            case 'work3':
                return <Work3 />;
            case '智慧導覽':
                return <SmartGuide setCurrentPage={setCurrentPage} />;
            case '展示區':
                return <ExhibitDisplay />;
            case '參觀資訊':
                return <Drop1 />;
            case '選物及餐點':
                return <Drop2 />;
            case '現行展覽':
                return <Drop3 />;
            case '過去展覽':
                return <Drop4 />;
            case '即將展出':
                return <Drop5 />;
            case '近期活動':
                return <Drop6 />;
            case '教育活動':
                return <Drop7 />;
            case '講座資訊':
                return <Drop8 />;
            case '典藏品介紹':
                return <Drop9 />;
            case '新進典藏':
                return <Drop10 />;
            case '館藏檔案':
                return <Drop11 />;
            case '研究專題':
                return <Drop12 />;
            case '出版物':
                return <Drop13 />;
            case '學術論文':
                return <Drop14 />;
            case '組織簡介':
                return <Drop15 />;
            case '歷史沿革':
                return <Drop16 />;
            case '聯絡方式':
                return <Drop17 />;
            default:
                return (
                    <>
                        <Carousel />
                        <NewsInfo />
                        <Collections onSearch={() => setCurrentPage('searchResults')} setCurrentPage={setCurrentPage} />
                    </>
                );
        }
    };

    return (
        <div className="App">
            <Header setCurrentPage={setCurrentPage} /> {/* 傳遞setCurrentPage到Header */}
            {renderPage()}
            <Footer />
        </div>
    );
}

export default App;
