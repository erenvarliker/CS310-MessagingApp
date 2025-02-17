package com.example.howudoin.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.howudoin.model.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderEmailAndRecipientEmail(String senderEmail, String recipientEmail);
    List<Message> findByGroupId(String groupId);
    @Query("{ '$or': [ {'senderEmail': ?0 }, {'recipientEmail': ?0} ] }")
    List<Message> findMessagesByEmail(String email);

}
