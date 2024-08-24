import React, { useState } from 'react';
import './Collections.css';

const Collections = ({ onSearch, setCurrentPage }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query) {
            onSearch(); // Trigger the page switch to search results
        }
    };

    const handleWorkClick = (workPage) => {
        setCurrentPage(workPage); // Set the current page based on the clicked work item
    };

    return (
        <section className="collections">
            <div className="search-bar">
                <div className="search-input-container">
                    <div className="search-label">典藏品查詢</div>
                    <input 
                        type="text" 
                        placeholder="請輸入關鍵字" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-icon">
                        ⌕
                    </button>
                </div>
            </div>
            <div className="works">
                <div className="work-item">
                    <div className="work-box" onClick={() => handleWorkClick('work1')}>
                        <img src={require('../assets/images/collection/work1.jpg')} alt="Work 1" />
                        <div className="description">
                            <p>晨曦之光</p>
                            <p>就是好像有2個人在賞夕陽這樣，之類的...</p>
                        </div>
                    </div>
                </div>
                <div className="work-item">
                    <div className="work-box" onClick={() => handleWorkClick('work2')}>
                        <img src={require('../assets/images/collection/work2.jpg')} alt="Work 2" />
                        <div className="description">
                            <p>慶典之日</p>
                            <p>不知道哪個國家可能國慶日在辦party...</p>
                        </div>
                    </div>
                </div>
                <div className="work-item">
                    <div className="work-box" onClick={() => handleWorkClick('work3')}>
                        <img src={require('../assets/images/collection/work3.jpg')} alt="Work 3" />
                        <div className="description">
                            <p>秋日幽徑</p>
                            <p>盲猜一下應該是秋天這樣，好漂亮嗎...</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Collections;
