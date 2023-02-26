# Arcadia monitoring worker
## Robot event log interface
Robot event logs are pushed to rabbitmq queue, where worker takes them and puts to mongo
They should have next interface:
```
{
"type": "roboteventlog", // mandatory
"sessionId": number, // optional, id of current session on machine
"machineSerial": string, // mandatory
"eventType": string, // Defined in robotEvent.type.ts, should be ROBOT_LOG or ROBOT_ERROR
"data": object // Log payload, can be any JSON object
}
```