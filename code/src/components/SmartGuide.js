import React, { useEffect, useState } from 'react';
import './SmartGuide.css';

const SmartGuide = ({ setCurrentPage }) => {
    const [sensorData, setSensorData] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        // 模擬3秒的數據加載延遲
        setTimeout(() => {
            setSensorData({ success: true }); // 模擬數據
            setShowDialog(true); // 3秒後顯示彈出視窗
        }, 3000);
    }, []);

    const handleEnter = () => {
        setShowDialog(false);
        setCurrentPage('展示區'); // 跳轉到展覽品展示區介面
    };

    const handleCancel = () => {
        setShowDialog(false);
        setCurrentPage('home'); // 跳轉到首頁
    };

    return (
        <div className="smart-guide-container">
            <h1 className="smart-guide-title">智慧導覽</h1>
            {sensorData ? (
                <div className="sensor-data">
                    <p>感測器數據：</p>
                    <pre>{JSON.stringify(sensorData, null, 2)}</pre>
                </div>
            ) : (
                <p className="loading">正在加載感測器數據</p>
            )}
            {showDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <p>連接成功，是否啟動智慧導覽？</p>
                        <div className="dialog-actions">
                            <button className="dialog-button cancel" onClick={handleCancel}>取消</button>
                            <button className="dialog-button enter" onClick={handleEnter}>進入</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartGuide;
