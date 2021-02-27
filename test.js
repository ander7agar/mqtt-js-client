require('dotenv').config()

const MqttClient = require('./index');

let mc = new MqttClient(process.env.MQTT_BROKER, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    clientId: 'MQTT-Q-TEST'
});

mc.on('connect', async function () {
    console.log('on connect')
    await mc.subscribe('/test/w/+/1', null, function (topic, message, packet) {
        console.log('/test/w/+/1', topic, message);
    });

    await mc.subscribe('/test/w/2/#', null, function (topic, message, packet) {
        console.log('/test/w/2/#', topic, message);
    });

    await mc.subscribe('/test/w/topic/3', null, function (topic, message, packet) {
        console.log('/test/w/topic/3', topic, message);
    })

    let packet = await mc.publish('/test/w/l/1', 'Hello World', null);
})

