import React, { useState } from 'react';
import './Header.css';

const Header = ({ setCurrentPage }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleMouseEnter = (item) => {
        setActiveDropdown(item);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    return (
        <header>
            <div className="logo" onClick={() => handleNavigation('home')}>
                <img src={require('../assets/images/logo/ticketyellow.png')} alt="Logo" />
            </div>
            <div className="nav-container">
                <nav>
                    <ul className="nav-list">
                        <li
                            className="nav-item special-item"
                            onClick={() => handleNavigation('智慧導覽')}
                        >
                            智慧導覽
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('我們提供')}
                            onMouseLeave={handleMouseLeave}
                        >
                            我們提供
                            {activeDropdown === '我們提供' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('參觀資訊')}>參觀資訊</li>
                                    <li onClick={() => handleNavigation('選物及餐點')}>選物及餐點</li>
                                </ul>
                            )}
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('展覽')}
                            onMouseLeave={handleMouseLeave}
                        >
                            展覽
                            {activeDropdown === '展覽' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('現行展覽')}>現行展覽</li>
                                    <li onClick={() => handleNavigation('過去展覽')}>過去展覽</li>
                                    <li onClick={() => handleNavigation('即將展出')}>即將展出</li>
                                </ul>
                            )}
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('活動')}
                            onMouseLeave={handleMouseLeave}
                        >
                            活動
                            {activeDropdown === '活動' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('近期活動')}>近期活動</li>
                                    <li onClick={() => handleNavigation('教育活動')}>教育活動</li>
                                    <li onClick={() => handleNavigation('講座資訊')}>講座資訊</li>
                                </ul>
                            )}
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('典藏')}
                            onMouseLeave={handleMouseLeave}
                        >
                            典藏
                            {activeDropdown === '典藏' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('典藏品介紹')}>典藏品介紹</li>
                                    <li onClick={() => handleNavigation('新進典藏')}>新進典藏</li>
                                    <li onClick={() => handleNavigation('館藏檔案')}>館藏檔案</li>
                                </ul>
                            )}
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('研究出版')}
                            onMouseLeave={handleMouseLeave}
                        >
                            研究出版
                            {activeDropdown === '研究出版' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('研究專題')}>研究專題</li>
                                    <li onClick={() => handleNavigation('出版物')}>出版物</li>
                                    <li onClick={() => handleNavigation('學術論文')}>學術論文</li>
                                </ul>
                            )}
                        </li>
                        <li
                            className="nav-item"
                            onMouseEnter={() => handleMouseEnter('關於我們')}
                            onMouseLeave={handleMouseLeave}
                        >
                            關於我們
                            {activeDropdown === '關於我們' && (
                                <ul className="dropdown">
                                    <li onClick={() => handleNavigation('組織簡介')}>組織簡介</li>
                                    <li onClick={() => handleNavigation('歷史沿革')}>歷史沿革</li>
                                    <li onClick={() => handleNavigation('聯絡方式')}>聯絡方式</li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
