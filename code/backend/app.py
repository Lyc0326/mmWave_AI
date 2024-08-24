from flask import Flask, jsonify
from flask_cors import CORS
import Bell  # 導入 Bell.py
import NoGuiGetData  # 導入 NoGuiGetData.py

app = Flask(__name__)
CORS(app)

# 初始化感測器
Bell.initialize_sensor()
NoGuiGetData.initialize_sensor()  # 初始化 NoGuiGetData.py 中的感測器

@app.route('/api/bell_sensor_data', methods=['GET'])
def get_bell_sensor_data():
    try:
        sensor_data = Bell.get_sensor_data()  # 調用 Bell.py 中的 get_sensor_data 函數來獲取感測器數據
        if sensor_data is None:
            return jsonify({"error": "No data received from Bell sensor"}), 500
        return jsonify(sensor_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/nogui_sensor_data', methods=['GET'])
def get_nogui_sensor_data():
    try:
        sensor_data = NoGuiGetData.get_data()  # 調用 NoGuiGetData.py 中的 get_data 函數來獲取感測器數據
        if sensor_data is None:
            return jsonify({"error": "No data received from NoGui sensor"}), 500
        return jsonify(sensor_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True)
    finally:
        Bell.stop_sensor()  # 確保在 Flask 應用關閉時停止 Bell 感測器
        NoGuiGetData.stop_sensor()  # 確保在 Flask 應用關閉時停止 NoGuiGetData 感測器
