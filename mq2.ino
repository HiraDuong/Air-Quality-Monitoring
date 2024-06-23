#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#define DO_PIN D7     //esp8266's pin d7 connected to DO pin of the MQ2 sensor
#define AO_PIN A0     //esp8266's pin d7 connected to DO pin of the MQ2 sensor
#define LED_PIN D5    //esp8266's pin d5 notification when connecting wifi successfully

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(200) // Increased buffer size to accommodate larger JSON string
char msg[MSG_BUFFER_SIZE];
int value = 0;

WiFiClient espClient;
PubSubClient client(espClient);
const char* mqtt_server = "broker.emqx.io";

void setup_wifi(){
  Serial.print("Connecting to WiFi");
  WiFi.begin("hoanglinh", "linh0511");
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("WiFi Connected!");
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(LED_PIN, HIGH); 

  } else {
    digitalWrite(LED_PIN, LOW);   
    
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe("testTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  Serial.begin(9600);
  // initialize the esp8266's pin as an input
  pinMode(DO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  Serial.println("Warming up the MQ2 sensor");
  delay(2000);  // wait for the MQ2 to warm up
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // get data from MQ2 sensor 
  int gasState = digitalRead(DO_PIN);
  int gasValue = analogRead(AO_PIN);

  // Create a JSON object and serialize it to a string
  StaticJsonDocument<200> jsonDoc; // Adjust size as needed
  jsonDoc["device_id"] = "1";
  jsonDoc["sensor_data"] = gasValue;
  jsonDoc["location"] = "Hai Ba Trung";
  
  // Serialize JSON to a string
  size_t length = serializeJson(jsonDoc, msg, sizeof(msg));
  msg[length] = '\0'; // Null-terminate the string

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("1147707_nhom5", msg);
  }

  if (gasState == HIGH) {
    Serial.println("The gas is NOT present");
  } else {
    Serial.print("The gas is present: ");
    Serial.println(gasValue);
  }

  delay(1000);
}
