import os
from confluent_kafka import Consumer, Producer, KafkaError

# Configure the source and target Kafka brokers
source_broker = os.environ.get('SOURCE_BROKER')  # Replace with the address of the source broker
target_broker = os.environ.get('TARGET_BROKER')  # Replace with the address of the target broker
source_topic_name = os.environ.get('SOURCE_TOPIC')  # Replace with your Kafka topic name
target_topic_name = os.environ.get('TARGET_TOPIC')  # Replace with your Kafka topic name

# Configure the consumer
consumer_config = {
    'bootstrap.servers': source_broker,
    'group.id': 'edge-consumer-' + os.environ.get('MACHINE_ID'),
    'auto.offset.reset': 'earliest'
}

# Configure the producer
producer_config = {
    'bootstrap.servers': target_broker
}

# Create a Kafka consumer and subscribe to the topic
consumer = Consumer(consumer_config)
consumer.subscribe([source_topic_name])

# Create a Kafka producer
producer = Producer(producer_config)

# Continuously consume and produce messages
try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                print(f"End of partition event: {msg.error()}")
                continue
            if msg.error().code() == KafkaError.UNKNOWN_TOPIC_OR_PART:
                print(f"Topic not yet created: {msg.error()}")
                continue
            else:
                print(f"Error while consuming message: {msg.error()}")
                break

        # Produce the received message to the target broker with the same topic
        producer.produce(target_topic_name, key=msg.key(), value=msg.value())

except KeyboardInterrupt:
    pass

finally:
    consumer.close()
    producer.flush()

