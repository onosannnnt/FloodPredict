#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WebSocketsClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "onosannnnt";
const char* password = "00000000";

const char* server = "https://flood-prediction-backend.ialwh0.easypanel.host/";
const char* humidityServer = "https://flood-prediction-backend.ialwh0.easypanel.host/humidity";

DHT dht(3, DHT11);

struct Sensor {
  int trigPin;
  int echoPin;
};

// Pin definitions for Sensor 1
Sensor sensors[] = { //Trigger : Echo 
  {5, 4},
  {2,0},
  {14, 12},
  {13, 15},
};

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(sensors[i].trigPin, OUTPUT);
    pinMode(sensors[i].echoPin, INPUT);
  }

  // Initialize serial communication
  Serial.begin(115200);
  dht.begin();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  for (int i = 0; i < 4; i++) {
    int distance = measureDistance(sensors[i].trigPin, sensors[i].echoPin);
    Serial.print("Sensor ");
    Serial.print(i + 1);  // Print the sensor number (1 or 2)
    Serial.print(" Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    sendDataToServer(distance, i);
  }
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Default in Celsius

  // Check if the readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print the values to the Serial Monitor
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("%, Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  sendHumidityData(humidity,temperature);

  // Short delay before the next measurements
  delay(1000 * 3 * 1);
}

// Function to measure distance from a sensor
int measureDistance(int trigPin, int echoPin) {
  // Send a 10µs pulse to the Trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the pulse duration from the Echo pin
  long duration = pulseIn(echoPin, HIGH);

  // Calculate distance in centimeters
  int distance = duration * 0.034 / 2;
  return distance;
}

// Function to send data to the server  
void sendDataToServer(int water_level, int sensor_no) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    // WiFiClient client;
    WiFiClientSecure client;
    client.setInsecure();
    http.begin(client, server);
    http.addHeader("Content-Type", "application/json");
    

    String payload = "{";
    payload += "\"water_level\": " + String(water_level) + ", ";
    payload += "\"sensor_no\": " + String(sensor_no);
    payload += "}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("Data sent successfully. Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data. HTTP response code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send data.");
  }
}

void sendHumidityData(float humidity, float temperature) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    // WiFiClient client;
    WiFiClientSecure client;
    client.setInsecure();
    http.begin(client, humidityServer);
    http.addHeader("Content-Type", "application/json");
    

    String payload = "{";
    payload += "\"humidity\": " + String(humidity) + ", ";
    payload += "\"temperature\": " + String(temperature);
    payload += "}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("Data sent successfully. Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data. HTTP response code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send data.");
  }
}
