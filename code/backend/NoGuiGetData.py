import os
import time
from datetime import datetime
import numpy as np
from KKT_Module.DataReceive.Parsing import ResultParsing
from abc import ABCMeta, abstractmethod
from KKT_Module.ksoc_global import kgl
from KKT_Module.KKTUtility.DigiControl import Digi168BController
from KKT_Module.Configs import INIConfigs

# 全局變量，用於保存接收器對象
receiver = None

class Receiver(metaclass=ABCMeta):
    '''
    Data receiver.
    '''
    def __init__(self):
        self.trigger_arg = []
        self._trigger = False

    @abstractmethod
    def trigger(self, **kwargs):
        '''
        Before start to get the data which received from the receiver,
        you have to init some configs and trigger it.
        '''
        print('triggered receiver : {}'.format(self.__class__.__name__))
        if not self._trigger:
            return

    @abstractmethod
    def getResults(self):
        '''
        Get the data which received from the receiver.
        '''
        if not self._trigger:
            return

    @abstractmethod
    def stop(self):
        '''
        Shut down the receiver.
        '''
        return

    def setConfig(self, **kwargs):
        for k, v in kwargs.items():
            if not hasattr(self, k):
                print(f'Attribute "{k}" not in receiver.')
                continue
            self.__setattr__(k, v)
            print(f'Attribute "{k}", set "{v}"')

class ReceiverConfigs(INIConfigs):
    def __init__(self, filename):
        super(ReceiverConfigs, self).__init__(filename=filename)
        self.setINIConfigs()

    def setINIConfigs(self):
        for section in self.section:
            self.__setattr__(section, dict(self.config[section].items()))

    def getConfig(self, section):
        if not hasattr(self, section):
            return {}
        return self.__getattribute__(section)

class ReadBBufferReceiver(Receiver):
    '''
    Rename from "ReadBBufferReceiver"
    '''
    def __init__(self):
        super(ReadBBufferReceiver, self).__init__()
        from read3CH128REG import ksoc_read_b_buffer
        self.ch1_buf, self.ch2_buf, self.ch3_buf = ksoc_read_b_buffer()
        self.saveData()

    def trigger(self):
        pass

    def getResults(self):
        time.sleep(0.05)
        return self.ch1_buf, self.ch2_buf, self.ch3_buf

    def stop(self):
        pass

    def saveData(self):
        date = datetime.now().strftime(r'%Y_%m_%d_%H_%M_%S')
        b_buffer_dir = os.path.join(os.getcwd(), 'Read_B_Buffer')
        if not os.path.isdir(b_buffer_dir):
            os.makedirs(b_buffer_dir, exist_ok=True)
        with open(os.path.join(b_buffer_dir, f'ch1_{date}.txt'), mode='w') as f:
            for i in range(len(self.ch1_buf)):
                f.write(str(self.ch1_buf[i])+'\n')
        with open(os.path.join(b_buffer_dir, f'ch2_{date}.txt'), mode='w') as f:
            for i in range(len(self.ch2_buf)):
                f.write(str(self.ch2_buf[i])+'\n')
        with open(os.path.join(b_buffer_dir, f'ch3_{date}.txt'), mode='w') as f:
            for i in range(len(self.ch3_buf)):
                f.write(str(self.ch3_buf[i])+'\n')

class MultiResult4168BReceiver(Receiver):
    '''
    Rename from AIResultReceiver.
    Instance with interrupts and get hardware results when "read_interrupt"
    was detected ,clear the results when "clear_interrupt was detected."
    '''
    _res_addrs_dict = {
        'SoftmaxExponential': [addr for addr in range(0x50000508, 0x5000051C + 1, 4)],
        'Axis': [addr for addr in range(0x50000578, 0x5000057C + 1, 4)],
        'Gestures': [addr for addr in range(0x50000580, 0x50000580 + 1, 4)],
        'SiameseGestures': [addr for addr in range(0x50000580, 0x50000580 + 1, 4)],
        'SiameseExponential': [addr for addr in range(0x50000604, 0x50000618 + 1, 4)],
        'IMax': [addr for addr in range(0x500005A4, 0x500005A4 + 1, 4)],
        'CFAR': [addr for addr in range(0x500005A8, 0x500005E4 + 1, 4)],
        'RSSI': [addr for addr in range(0x4005C10C, 0x4005C10C + 1, 4)],
        'Motion': [addr for addr in range(0x4005C140, 0x4005C15C + 1, 4)],
        'Motion EABS': [addr for addr in range(0x4005C190, 0x4005C1AC + 1, 4)],
        'AGC_Ch1': [addr for addr in range(0x400D8060, 0x400D8060 + 1, 4)],
        'AGC_Ch2': [addr for addr in range(0x400D80A0, 0x400D80A0 + 1, 4)],
        'AGC_Ch3': [addr for addr in range(0x400F8060, 0x400F8060 + 1, 4)],
        'AI Sram': [
            0x20020C04, 0x20022404, 0x20023C04, 0x20025404, 0x20026C04, 0x20028404,
            0x20029C04, 0x2002B404, 0x2002CC04, 0x2002E404, 0x2002FC04, 0x20031404,
            0x20020C08, 0x20022408, 0x20023C08, 0x20025408, 0x20026C08, 0x20028408,
            0x20029C08, 0x2002B408, 0x2002CC08, 0x2002E408, 0x2002FC08, 0x20031408
        ]
    }

    def __init__(self, actions=0b101, read_interrupt: int = 0, clear_interrupt: int = 0, rbank_ch_enable=0b111):
        super(MultiResult4168BReceiver, self).__init__()
        self._result_list = []
        self._result_dict = {
            'SoftmaxExponential': [], 'Axis': [], 'Gestures': [], 'SiameseGestures': [],
            'SiameseExponential': [], 'IMax': [], 'CFAR': [], 'RSSI': [], 'Motion': [],
            'Motion EABS': [], 'AGC Ch1': [], 'AGC Ch2': [], 'AGC Ch3': [], 'AI Sram': []
        }

        self._trigger = False
        self.read_interrupt = read_interrupt
        self.clear_interrupt = clear_interrupt
        self.rbank_ch_enable = rbank_ch_enable
        self.actions = actions
        self.RDI_enable = True

    def trigger(self, **kwargs):
        self.setConfig(**kwargs)
        total_res = []
        actions = int(self.actions)
        read_interrupt = int(self.read_interrupt)
        clear_interrupt = int(self.clear_interrupt)
        rbank_ch_enable = int(self.rbank_ch_enable)
        self._result_list = []
        if (actions & 0b100):
            if read_interrupt == 0:
                self._result_list = list(self._res_addrs_dict.keys())
            elif read_interrupt == 3:
                self._result_list = ['RSSI', 'Motion', 'Motion EABS']
            elif read_interrupt == 2:
                self._result_list = ['CFAR', 'RSSI', 'Motion', 'Motion EABS']
            elif read_interrupt == 1:
                self._result_list = ['CFAR', 'IMax', 'RSSI', 'Motion', 'Motion EABS']
            elif read_interrupt == 4:
                self._result_list = ['AXIS', 'CFAR', 'IMax', 'RSSI', 'Motion', 'Motion EABS']
            for res_name in self._result_list:
                total_res += self._res_addrs_dict[res_name]

        self._ResultParser = ResultParsing(self._result_list)
        reg_addrs = np.asarray(total_res).astype('uint32')
        self.size = 1
        if (actions & 0b1):
            self.RDI_enable = kgl.ksoclib.readReg(0x50000504, 5, 5)
            if self.RDI_enable:
                self.size = 1620 + self.size
            else:
                chirp = Digi168BController.getChirpNumber() + 1
                self.size = chirp * 128 + self.size
        kgl.ksoclib.switchSoftMaxInterrupt(actions, read_interrupt, clear_interrupt, self.size * 4, rbank_ch_enable, reg_addrs)
        self._trigger = True
        print('SwitchSoftMaxInterrupt success')
        time.sleep(0.5)
        super(MultiResult4168BReceiver, self).trigger()

    def getResults(self):
        res = kgl.ksoclib.getSoftMaxInterruptRegValues()
        if res is None:
            return None

        self._result_dict = {}
        if (int(self.actions) & 0b1):
            data = res.pop(0)
            if self.RDI_enable:
                rdi_raw = self._ResultParser.parseRDI(data, 0, self.size * 2)
                RDI_PHD = convertFeatureMap(rdi_raw)
                self._result_dict.setdefault('FeatureMap', RDI_PHD)
            else:
                raw_data = self._ResultParser.parseRawData(data, 0, self.size * 2)
                self._result_dict.setdefault('RawData', raw_data)

        if (int(self.actions) & 0b10):
            data = res.pop(0)
            retention = np.zeros((3, 128), dtype='int16')
            data = np.reshape(data, (int(len(data) / 128), 128))
            for i in range(data.shape[0]):
                retention[i, :] = data[i, :]
            self._result_dict.setdefault('Retention', retention)

        if (int(self.actions) & 0b100):
            data = res.pop(0)
            start = 0
            result_dict = {}
            for res_name in self._result_list:
                result_dict.setdefault(res_name, data[start:start + len(self._res_addrs_dict[res_name])])
                start += len(self._res_addrs_dict[res_name])
            self._ResultParser.parsing(result_dict)
            self._result_dict.update(self._ResultParser.getParsedResults())
        return self._result_dict

    def stop(self):
        if self._trigger:
            kgl.ksoclib.switchSoftMaxInterrupt(enable=0)
            self._trigger = False
            print('SwitchSoftMaxInterrupt stop')

class FeatureMapReceiver(Receiver):
    def __init__(self, chirps: int = 32):
        '''
        Receive RDI PHD map from hardware.
        :param chirps: chirps number.
        '''
        super(FeatureMapReceiver, self).__init__()
        self._trigger = False
        self.__LastFrameCount = 0
        self.trigger_arg = ['chirps']
        self.chirps = chirps

    def trigger(self, **kwargs):
        super(FeatureMapReceiver, self).trigger(**kwargs)
        kgl.ksoclib.writeReg(1, 0x50000504, 5, 5, 0)
        time.sleep(0.3)
        if self.chirps <= 35:
            kgl.ksoclib.massdatabufStart_RDI(0, 0x0C)
        elif self.chirps <= 64:
            kgl.ksoclib.massdatabufStart_RDI(0, 0x10)
        else:
            kgl.ksoclib.massdatabufStart_RDI(0, 0x08)

        self._trigger = True
        print('switch RDI')

    def getResults(self):
        '''
        :return: RDI, PHD shape 32*32 array.
        '''
        result = kgl.ksoclib.massdatabufGet_RDI()

        if result is None:
            return None

        framecount1 = result[0]
        framecount2 = result[1]
        raw_RDI = result[2]

        if framecount1 != framecount2:
            print(f"framecount1 != framecount2 ({framecount1}/{framecount2})")
        elif framecount1 == 0 and framecount2 == 0:
            pass
        elif framecount1 - 1 != self.__LastFrameCount and framecount1 != -1:
            print(f"shift {framecount1 - self.__LastFrameCount - 1}")
        self.__LastFrameCount = framecount1

        return convertFeatureMap(raw_RDI)

    def stop(self):
        if self._trigger:
            kgl.ksoclib.massdatabufStop()
            print('Mass data buffer stopped')
            self._trigger = False

def convertFeatureMap(rdi_raw, dual_mode=False):
    shape_pack = rdi_raw.reshape([15, 18, 16])
    spec_pack = np.transpose(shape_pack, (1, 2, 0))
    RDI = np.zeros((33, 33, 2), dtype='uint32')
    spec_pack_up = spec_pack[0:9, :, :]
    spec_pack_down = spec_pack[9:, :, :]

    for i in range(15):
        idx = i
        row_start = 2 * idx
        row_end = row_start + 3

        RDI[row_start:row_end, 0:16:2, 0] = spec_pack_up[::3, ::2, idx]
        RDI[row_start:row_end, 0:16:2, 1] = spec_pack_up[::3, 1::2, idx]

        RDI[row_start:row_end, 1:17:2, 0] = spec_pack_up[1::3, ::2, idx]
        RDI[row_start:row_end, 1:17:2, 1] = spec_pack_up[1::3, 1::2, idx]

        RDI[row_start:row_end, 2:18:2, 0] = spec_pack_up[2::3, ::2, idx]
        RDI[row_start:row_end, 2:18:2, 1] = spec_pack_up[2::3, 1::2, idx]

        RDI[row_start:row_end, 16:32:2, 0] = spec_pack_down[::3, ::2, idx]
        RDI[row_start:row_end, 16:32:2, 1] = spec_pack_down[::3, 1::2, idx]

        RDI[row_start:row_end, 17:33:2, 0] = spec_pack_down[1::3, ::2, idx]
        RDI[row_start:row_end, 17:33:2, 1] = spec_pack_down[1::3, 1::2, idx]

        RDI[row_start:row_end, 18:34:2, 0] = spec_pack_down[2::3, ::2, idx]
        RDI[row_start:row_end, 18:34:2, 1] = spec_pack_down[2::3, 1::2, idx]

    return RDI[:32, :32, 0], RDI[:32, :32, 1]

# 初始化感測器
def initialize_sensor():
    global receiver
    kgl.setLib()
    kgl.ksoclib.connectDevice()
    receiver = FeatureMapReceiver(chirps=32)  # 初始化接收器
    receiver.trigger(chirps=32)
    print("感測器初始化完成")

# 獲取感測器數據
def get_data():
    global receiver
    if receiver is None:
        return None
    
    res = receiver.getResults()
    if res is None:
        return None
    
    # 假設返回 RDI 和 PHD 數據
    RDI, PHD = res
    
    # 返回一個字典，包含獲取的數據
    return {
        "RDI": RDI.tolist(),  # 將 NumPy 數組轉換為列表，以便 JSON 序列化
        "PHD": PHD.tolist()   # 同上
    }

# 停止感測器
def stop_sensor():
    global receiver
    if receiver is not None:
        receiver.stop()
        print("感測器已停止")

# 測試用代碼，不會在 Flask 應用中運行
if __name__ == '__main__':
    initialize_sensor()
    i = 0
    while i < 100:
        data = get_data()
        if data:
            print(data)
        i += 1
    stop_sensor()
