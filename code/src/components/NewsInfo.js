// src/components/NewsInfo.js
import React from 'react';
import './NewsInfo.css';

const NewsInfo = () => {
    return (
        <section className="news-info">
            <div className="separator-horizontal"></div>
            <div className="news">
                <h2>最新消息</h2>
                <ul>
                    <li><a href="/news/20240802"><span>2024/08/02</span> | 一般公告 | 終於做好網頁了</a></li>
                    <li><a href="/news/20240801"><span>2024/08/01</span> | 失物招領 | 快累死了ㄚㄚㄚ</a></li>
                    <li><a href="/news/20240726"><span>2024/07/26</span> | 新聞發布 | 歡迎來到「我們五個人」互動式展覽系統</a></li>
                    <li><a href="/news/20240722"><span>2024/07/22</span> | 一般公告 | 你想得到的我們都有！</a></li>
                    <li><a href="/news/20240719"><span>2024/07/19</span> | 參觀消息 | 我們走一個永遠不開放路線，嘿嘿</a></li>
                </ul>
                <a href="#" className="more-link">more <span className="triangle-right">▶</span></a>
            </div>
            <div className="separator-vertical"></div>
            <div className="info">
                <h2>參觀資訊</h2>
                <p>週一 <span>休館</span></p>
                <p>週二 <span>休館</span></p>
                <p>週三 <span>休館</span></p>
                <p>週四 <span>休館</span></p>
                <p>週五 <span>休館</span></p>
                <p>...</p>
                <a href="#" className="more-link">more <span className="triangle-right">▶</span></a>
            </div>
        </section>
    );
};

export default NewsInfo;
