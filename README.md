# MQTT Wrapper
![Version](https://img.shields.io/npm/v/mqtt-js-client.svg?style=flat&logo=npm)
![License](https://img.shields.io/npm/l/mqtt-js-client)
![Downloads](https://img.shields.io/npm/dm/mqtt-js-client)

Easy MQTT Client

### Installation
```shell
npm install mqtt-js-client
```

### How to use

#### Creates your MQTT client
MqttClient receives same arguments that [MQTT Official Package](https://www.npmjs.com/package/mqtt) for JS.

```js
const MqttClient = require('mqtt-js-client')

let mc = new MqttClient('mqtt://mybroker', {
    username: 'myMqttUser',
    password: 'myMqttPassword',
});
```

#### #subscribe(topic, options, callback)

```js
mc.subscribe('mqtt/topic', options, function (topic, messageBuffer, packet) {
    console.log(messageBuffer.toString()); //Prints message as utf8
}) 
    .then(granted => {
        console.log('Subscrition granted:', granted)
    })
```
MqttClient supports the MQTT Wildcards

```js
mc.subscribe('mqtt/topic/#', options, function (topic, messageBuffer, packet) {
    console.log(messageBuffer.toString()); //Prints message as utf8
})

mc.subscribe('mqtt/+/topic', options, function (topic, messageBuffer, packet) {
    console.log(messageBuffer.toString()); //Prints message as utf8
})
```

#### #unsubscribe(topic, options)
Unsubscribe from a topic

```js
mc.unsubscribe('mqtt/topic', options)
    .then(success => {
        console.log('Unsubcribe success!')
    })
```

#### #publish(topic, message, options)
Publish a message

```js
mc.publish('mqtt/topic', 'Hello world!', options)
    .then(_ => {
        console.log('Publish works!')
    })
```

#### #end(force, options, callback)
Close connection

```js
mc.end(false, options)
    .then(_ => {
        console.log('Connection closed!')
    })
```

#### #removeOutgoingMessage(mId)
Remove a message from the outgoingStore. The outgoing callback will be called with Error('Message removed') if the message is removed.

```js
mc.removeOutgoingMessage(messageId)
```

#### #reconnect()
Reconnects the client

```js
mc.reconnect()
```

#### #handleMessage(packet, callback)
Handle messages with backpressure support, one at a time. Override at will, but always call
callback, or the client will hang.

```js
mc.handleMessage(packet, function () {
    
})
```

#### #isConnected()
Returns if client is connected

```js
mc.isConnected()
```

#### #isReconnecting()
Returns if client is reconnecting

```js
mc.isReconnecting()
```

#### #getLastMessageId()
Returns the last message id

```js
mc.getLastMessageId()
```
