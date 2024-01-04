from flask import Flask, request
from flask_cors import CORS
import logging
import pyautogui
import time
import threading

app = Flask(__name__)
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)

pyautogui.FAILSAFE = False

CORS(app)

speed =10
currentKey = ""

mouseDirX = 0
mouseDirY = 0

def smooth_move_rel(mouse_dir_x, mouse_dir_y, duration=1.0):
    current_x, current_y = pyautogui.position()
    target_x, target_y = current_x + mouse_dir_x, current_y + mouse_dir_y

    # 使用easeOutQuad参数使移动更加平滑
    pyautogui.moveTo(target_x, target_y, duration=duration)


def MoveMouse():
    global mouseDirX
    global mouseDirY
    if(mouseDirY + mouseDirX != 0):
        # pyautogui.moveRel(mouseDirX, mouseDirY)
        smooth_move_rel(mouseDirX, mouseDirY, 0.05)

def Thread(Name):
    while(True):
        MoveMouse()
        # time.sleep(0.01)
x = threading.Thread(target=Thread, args=(1,))
x.start()
@app.route('/')
def hello():
    return 'Hello Flask!'

@app.route('/getKey', methods=['POST'])
def get_key():
    global currentKey
    global mouseDirY
    global mouseDirX
    data = request.json
    key_value = data.get('key', None)
    if(key_value == "over"):
        pyautogui.keyUp(currentKey)
        mouseDirX = 0
        mouseDirY = 0
    print(data.get("type", "key"))
    if(data.get("type", "key") == "key"):
        sameName = data.get("sameName", True)
        if(sameName):
            if(currentKey != key_value):
                pyautogui.keyDown(key_value)
                if(currentKey != ""):
                    pyautogui.keyUp(currentKey)
                currentKey = key_value
    else:
        if(currentKey != key_value):
            if(key_value == "w"):
                mouseDirX = 0
                mouseDirY = -speed
            elif(key_value == "a"):
                mouseDirX = -speed
                mouseDirY = 0
            elif(key_value == "s"):
                mouseDirX = 0
                mouseDirY = speed
            elif(key_value == "d"):
                mouseDirX = speed
                mouseDirY = 0
            currentKey = key_value
    return "Data received successfully!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)


