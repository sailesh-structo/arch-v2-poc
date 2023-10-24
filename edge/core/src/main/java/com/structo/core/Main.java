package com.structo.core;

import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class Main {

    private static final String START_JOB_TOPIC = "start_job";
    private static final String OUTPUT_TOPIC = "output";   
    // private static final String KAFKA_BROKER_LIST = "localhost:9092";
    private static final String KAFKA_BROKER_LIST = System.getenv("KAFKA_BROKER_LIST");
    

    public static void main(String[] args) {
        System.out.println("KAFKA_BROKER_LIST: " + KAFKA_BROKER_LIST);
        // Set up Kafka consumer properties
        Properties consumerProps = new Properties();
        consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BROKER_LIST);
        consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, "job-processor-group");
        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(consumerProps);
        consumer.subscribe(Collections.singleton(START_JOB_TOPIC));

        // Set up Kafka producer properties
        Properties producerProps = new Properties();
        producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BROKER_LIST);
        producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        KafkaProducer<String, String> producer = new KafkaProducer<>(producerProps);


        // Create an ObjectMapper for JSON parsing
        ObjectMapper objectMapper = new ObjectMapper();

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records) {
                String message = record.value();

                try {
                    JobMessage jobMessage = objectMapper.readValue(message, JobMessage.class);
                    String jobId = jobMessage.getJobId();
                    String filePath = jobMessage.getFilePath();                    
                    String machineId = jobMessage.getMachineId();


                    // Process the job
                    int targetValue = processJob(filePath);
                    int counter = 1;

                    // Send output messages with jobId and counter
                    while (counter <= targetValue) {
                        String m = "{\"schema\": {\"type\": \"struct\",\"fields\": [{\"type\": \"string\",\"field\": \"jobId\"},{\"type\": \"string\",\"field\": \"machineId\"},{\"type\": \"int32\",\"field\": \"status\"},{\"type\": \"int64\",\"field\": \"timestamp\"}]},\"payload\": {\"jobId\": \""+ jobId +"\",\"status\": "+  counter +",\"machineId\": \""+ machineId +"\",\"timestamp\":"+ System.currentTimeMillis() +"}}";
                        
                        JSONParser parser = new JSONParser();  
                        JSONObject json = null;
                        try {
                            json = (JSONObject) parser.parse(m);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }  
                        System.out.println("Sending output message: " + json);
                        String messageJsonStr = objectMapper.writeValueAsString(json);

                        ProducerRecord<String, String> outputRecord = new ProducerRecord<>(OUTPUT_TOPIC, jobId, messageJsonStr);
                        producer.send(outputRecord);
                        counter++;

                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                } catch (IOException e) {
                    // Handle JSON parsing errors
                    e.printStackTrace();
                }
            }
        }
    }

    // Replace this with your logic to process the job and get the target value
    private static int processJob(String filePath) {
        try {
            // Read the file and extract the integer
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            String line = reader.readLine();
            reader.close();
            
            // Parse the extracted value to an integer
            int extractedValue = Integer.parseInt(line.trim());

            return extractedValue;
        } catch (IOException e) {
            // Handle file not found or other IO errors
            e.printStackTrace();
            return -1; // Return an error value or handle the error as needed
        } catch (NumberFormatException e) {
            // Handle a parsing error if the file does not contain a valid integer
            e.printStackTrace();
            return -1; // Return an error value or handle the error as needed
        }
    }
}
