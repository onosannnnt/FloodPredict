# Flood Prediction IoT Project

## Overview

This project aims to predict potential flood risks using an IoT-based approach. The system integrates ESP8266 microcontroller with ultrasonic and humidity sensors to monitor real-time environmental conditions. The ultrasonic sensor measures water levels, while the humidity sensor tracks atmospheric moisture. Data is transmitted to a backend server for analysis, enabling predictive alerts and risk assessments.

## Steps to Run ESP8266

### Set up ESP8266

1. Connect the computer to ESP8266.
2. Install the ESP8266 package dependencies:
   - Open the Arduino IDE.
   - Go to `File > Preferences`.
   - Add the following URL to the "Additional Boards Manager URLs" field:
     ```
     https://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Click `OK`.
   - Go to `Tools > Board > Boards Manager`.
   - Search for `ESP8266` and install the package.
   - Ensure the following libraries are installed via `Tools > Manage Libraries`:
     - `ESP8266WiFi` for Wi-Fi connectivity.
     - `DHT` for the humidity sensor.
     - `Ultrasonic` for handling the ultrasonic sensor.
     - `ArduinoJson` for parsing and creating JSON objects.
3. Open the `main.ino` file.
4. Change the Wi-Fi SSID and password.
5. Update the backend URL.
6. Compile and upload the code to ESP8266.

### After Setup ESP8266

1. Connect the power to ESP8266.
2. Wait for it to connect to Wi-Fi.
3. Device is ready to use.

---

## Steps to Run Backend

1. Open the project directory in a terminal.
2. Run the `npm i` command to install dependencies.
3. Configure database settings in the `data-source.ts` file.
4. Run the `npm start` command.
5. Backend is ready to use.

---

## Steps to Run Model Using Python and FastAPI

1. Install dependencies by running:
   ```bash
   pip install -r requirements.txt
   ```
2. Ensure the model file is in the appropriate directory.
3. Start the FastAPI server by running:
   ```bash
   uvicorn main:app --reload
   ```
4. Open your browser and navigate to:
   ```
   http://127.0.0.1:8000/docs
   ```
   to access the FastAPI interactive API documentation.
5. Use the available endpoints to interact with the model.
