const mqtt = require('mqtt');
const EventEmitter = require('events').EventEmitter;

/**
 * @callback MessageCallback
 * @param {string} topic
 * @param {Buffer} message
 * @param {Packet} packet
 */

/**
 * @callback PacketCallback
 * @param {Error} error
 * @param {Packet} packet
 */

class MqttClient extends EventEmitter {
    constructor(broker, options) {
        super();
        this.__client = mqtt.connect(broker, options);

        this.__registerEvents();

        this.__client.on('message', (topic, message, packet) => {
            this.__emitOnMatchedTopics(topic, message, packet);
        })
    }

    /**
     *
     * @param {string} topic
     * @param {Buffer} message
     * @param {Packet} packet
     * @private
     */
    __emitOnMatchedTopics(topic, message, packet) {
        let topicNames = this.eventNames();
        for (const topicEvent of topicNames) {
            let topicWildCard = topicEvent.split('/+').join('\/[^\/]{1,}')
                .split('#').join('.{1,}$');

            let matches = topic.match(topicWildCard);
            if (matches) {
                this.emit(topicEvent, topic, message, packet);
            }
        }
    }

    __registerEvents() {
        let events = ['connect', 'reconnect', 'close', 'disconnect', 'offline', 'error', 'end', 'packetsend', 'packereceive'];

        let that = this;

        for (let e of events) {
            this.__client.on(e, (arg1, arg2, arg3) => {
                that.emit(e, arg1, arg2, arg3);
            })
        }
    }

    /**
     *
     * @param {string} topic
     * @param {*} options
     * @param {MessageCallback} callback
     * @return {Promise<unknown>}
     */
    subscribe(topic, options, callback) {
        let that = this;
        return new Promise((resolve, reject) => {
            this.__client.subscribe(topic, options, function (err, granted) {
                if (err) {
                    reject(err)
                } else {
                    if (callback) {
                        that.on(topic, callback);
                    }
                    resolve(granted);
                }
            })
        });
    }

    /**
     *
     * @param {string} topic
     * @param {*} options
     * @return {Promise<unknown>}
     */
    unsubscribe(topic, options) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.removeAllListeners(topic);
            this.__client.unsubscribe(topic, options, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true);
                }
            })
        });
    }

    /**
     *
     * @param {string} topic
     * @param {string|Buffer} message
     * @param {Object} options
     * @return {Promise<unknown>}
     */
    publish(topic, message, options) {
        return new Promise((resolve, reject) => {
            this.__client.publish(topic, message, options, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true);
                }
            })
        });
    }

    /**
     *
     * @param {boolean} force
     * @param {Object} options
     * @return {Promise<unknown>}
     */
    end(force, options) {
        return new Promise((resolve, reject) => {
            this.__client.end(force, options, function (err) {
                resolve(true);
            })
        });
    }

    /**
     *
     * @param {number} mid
     */
    removeOutgoingMessage(mid) {
        this.__client.removeOutgoingMessage(mid);
    }

    reconnect() {
        this.__client.reconnect();
    }

    /**
     *
     * @param {Packet} packet
     * @param {PacketCallback} callback
     */
    handleMessage(packet, callback) {
        this.__client.handleMessage(packet, callback);
    }

    /**
     *
     * @return {boolean}
     */
    isConnected() {
        return this.__client.connected;
    }

    /**
     *
     * @return {boolean}
     */
    isReconnecting() {
        return this.__client.reconnecting;
    }

    /**
     *
     * @return {number}
     */
    getLastMessageId() {
        return this.__client.getLastMessageId();
    }
}

module.exports = MqttClient;