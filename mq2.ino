#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <DHT11.h>

#ifndef STASSID
#define STASSID "hoanglinh"
#define STAPSK "linh0511"
#endif

#define DHT_SENSOR_PIN  D7 // The ESP8266 pin D7 connected to DHT11 sensor
DHT11 dht11(2);

// #define DO_PIN D7     //esp8266's pin d7 connected to DO pin of the MQ2 sensor
// #define AO_PIN A0     //esp8266's pin d7 connected to DO pin of the MQ2 sensor
#define LED_PIN D5    //esp8266's pin d5 notification when connecting wifi successfully

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(200) // Increased buffer size to accommodate larger JSON string
char msg[MSG_BUFFER_SIZE];
int value = 0;

/**********************************MACROS**********************************************/
#define         MQ_PIN                       (0)     //define which analog input channel you are going to use
#define         RL_VALUE                     (5)     //define the load resistance on the board, in kilo ohms
#define         RO_CLEAN_AIR_FACTOR          (9.83)  //RO_CLEAR_AIR_FACTOR=(Sensor resistance in clean air)/RO,
//which is derived from the chart in datasheet
#define         CALIBARAION_SAMPLE_TIMES     (50)    //define how many samples you are going to take in the calibration phase
#define         CALIBRATION_SAMPLE_INTERVAL  (500)   //define the time interal(in milisecond) between each samples in the
//cablibration phase
#define         READ_SAMPLE_INTERVAL         (50)    //define how many samples you are going to take in normal operation
#define         READ_SAMPLE_TIMES            (5)     //define the time interal(in milisecond) between each samples in 
#define         GAS_LPG                      (0)
#define         GAS_CO                       (1)
#define         GAS_SMOKE                    (2)

float           LPGCurve[3]  =  {2.3, 0.21, -0.47}; //two points are taken from the curve.
                                                    //with these two points, a line is formed which is "approximately equivalent"
                                                    //to the original curve.
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.21), point2: (lg10000, -0.59)
float           COCurve[3]  =  {2.3, 0.72, -0.34};  //two points are taken from the curve.
                                                    //with these two points, a line is formed which is "approximately equivalent"
                                                    //to the original curve.
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.72), point2: (lg10000,  0.15)
float           SmokeCurve[3] = {2.3, 0.53, -0.44}; //two points are taken from the curve.
                                                    //with these two points, a line is formed which is "approximately equivalent"
                                                    //to the original curve.
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.53), point2: (lg10000,  -0.22)
float           Ro           =  10;                 //Ro is initialized to 10 kilo ohms
/**********************************MACROS END**********************************************/

WiFiClient espClient;
PubSubClient client(espClient);
const char* mqtt_server = "broker.emqx.io";
const char* ssid = STASSID;
const char* password = STAPSK;

void setup_wifi(){
  Serial.print("Connecting to WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
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
  pinMode(A0, INPUT);

  Serial.println("Warming up the MQ2 sensor");
  delay(2000);  // wait for the MQ2 to warm up

  //Calibrating the sensor. Please make sure the sensor is in clean air
  Ro = MQCalibration(MQ_PIN);
  //send to serial port
  Serial.print("Calibration is done...\n");
  Serial.print("Ro=");
  Serial.print(Ro);
  Serial.print("kohm");
  Serial.print("\n");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // read humidity
  float humid  = dht11.readHumidity();
  // read temperature in Celsius
  float temperature_C = dht11.readTemperature();

  // Create a JSON object and serialize it to a string
  StaticJsonDocument<200> jsonDoc; // Adjust size as needed
  jsonDoc["deviceId"] = 123;
  jsonDoc["location"] = "Hai Ba Trung, Ha Noi";
  jsonDoc["weather"] = "Downpour";
  jsonDoc["temp"] = (int) temperature_C;
  jsonDoc["humid"] = (int) humid;
  int COppm = MQGetGasPercentage(MQRead(MQ_PIN) / Ro, GAS_CO);
  if (COppm > 100000) {
    jsonDoc["ppm"] = 0;
  } else {
  jsonDoc["ppm"] = COppm;
  }
  
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

  // Serial.print("LPG:");
  // Serial.print(MQGetGasPercentage(MQRead(MQ_PIN) / Ro, GAS_LPG) );
  // Serial.print( "ppm" );
  // Serial.print("    ");
  // Serial.print("CO:");
  // Serial.print(MQGetGasPercentage(MQRead(MQ_PIN) / Ro, GAS_CO) );
  // Serial.print( "ppm" );
  // Serial.print("    ");
  // Serial.print("SMOKE:");
  // Serial.print(MQGetGasPercentage(MQRead(MQ_PIN) / Ro, GAS_SMOKE) );
  // Serial.print( "ppm" );
  // Serial.print("\n");

  delay(1000);
}

/**************** MQResistanceCalculation **************************************
  Input:   raw_adc - raw value read from adc, which represents the voltage
  Output:  the calculated sensor resistance
  Remarks: The sensor and the load resistor forms a voltage divider. Given the voltage
         across the load resistor and its resistance, the resistance of the sensor
         could be derived.
**********************************************************************************/

float MQResistanceCalculation(int raw_adc){
  return ( ((float)RL_VALUE * (1023 - raw_adc) / raw_adc));
}


/*************************** MQCalibration **************************************
  Input:   mq_pin - analog channel
  Output:  Ro of the sensor
  Remarks: This function assumes that the sensor is in clean air. It use
         MQResistanceCalculation to calculates the sensor resistance in clean air
         and then divides it with RO_CLEAN_AIR_FACTOR. RO_CLEAN_AIR_FACTOR is about
         10, which differs slightly between different sensors.
**********************************************************************************/

float MQCalibration(int mq_pin){
  int i;
  float val = 0;

  for (i = 0; i < CALIBARAION_SAMPLE_TIMES; i++) {      //take multiple samples
    val += MQResistanceCalculation(analogRead(mq_pin));
    delay(CALIBRATION_SAMPLE_INTERVAL);
  }

  val = val / CALIBARAION_SAMPLE_TIMES;                 //calculate the average value
  val = val / RO_CLEAN_AIR_FACTOR;                      //divided by RO_CLEAN_AIR_FACTOR yields the Ro
  //according to the chart in the datasheet
  
  return val;
}

/***************************  MQRead *******************************************
  Input:   mq_pin - analog channel
  Output:  Rs of the sensor
  Remarks: This function use MQResistanceCalculation to caculate the sensor resistenc (Rs).
         The Rs changes as the sensor is in the different consentration of the target
         gas. The sample times and the time interval between samples could be configured
         by changing the definition of the macros.
**********************************************************************************/

float MQRead(int mq_pin){
  int i;
  float rs = 0;
  
  for (i = 0; i < READ_SAMPLE_TIMES; i++) {
    rs += MQResistanceCalculation(analogRead(mq_pin));
    delay(READ_SAMPLE_INTERVAL);
  }

  rs = rs / READ_SAMPLE_TIMES;
  
  return rs;
}


/***************************  MQGetGasPercentage ********************************
  Input:   rs_ro_ratio - Rs divided by Ro
         gas_id      - target gas type
  Output:  ppm of the target gas
  Remarks: This function passes different curves to the MQGetPercentage function which
         calculates the ppm (parts per million) of the target gas.
**********************************************************************************/

int MQGetGasPercentage(float rs_ro_ratio, int gas_id){
  if ( gas_id == GAS_LPG ) {
    return MQGetPercentage(rs_ro_ratio, LPGCurve);
  }
  else if( gas_id == GAS_CO ){
    return MQGetPercentage(rs_ro_ratio, COCurve);
  } 
  else if ( gas_id == GAS_SMOKE ) {
    return MQGetPercentage(rs_ro_ratio, SmokeCurve);
  }

  return 0;
}


/***************************  MQGetPercentage ********************************
  Input:   rs_ro_ratio - Rs divided by Ro
         pcurve      - pointer to the curve of the target gas
  Output:  ppm of the target gas
  Remarks: By using the slope and a point of the line. The x(logarithmic value of ppm)
         of the line could be derived if y(rs_ro_ratio) is provided. As it is a
         logarithmic coordinate, power of 10 is used to convert the result to non-logarithmic
         value.
**********************************************************************************/

int  MQGetPercentage(float rs_ro_ratio, float *pcurve){
  return (pow(10, ( ((log(rs_ro_ratio) - pcurve[1]) / pcurve[2]) + pcurve[0])));
}
