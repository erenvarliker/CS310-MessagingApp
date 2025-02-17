package com.example.howudoin.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;

    @Field("senderEmail")
    private String senderEmail;


    @Field("recipientEmail")
    private String recipientEmail; // Used for direct messages


    private String groupId;        // Used for group messages
    private String content;
    private LocalDateTime timestamp;
}
