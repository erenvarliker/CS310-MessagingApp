package com.example.howudoin.service;

import com.example.howudoin.model.User;
import com.example.howudoin.model.Message;
import com.example.howudoin.repository.MessageRepository;
import com.example.howudoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(String senderEmail, String recipientEmail, String content) {
        // Ensure both users exist and are friends
        try {
            User sender = userRepository.findByEmail(senderEmail)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User recipient = userRepository.findByEmail(recipientEmail)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            if (!sender.isFriend(recipient.getId()) || !recipient.isFriend(sender.getId())) {
                throw new RuntimeException("Cannot send message. The recipient is not your friend.");
            }

            // Create and save the message
            Message message = new Message();
            message.setSenderEmail(senderEmail);
            message.setRecipientEmail(recipientEmail);
            message.setContent(content);
            message.setTimestamp(LocalDateTime.now());

            return messageRepository.save(message);
        } catch (RuntimeException e) {
            // Log the exception for debugging
            System.err.println("Error in sendMessage: " + e.getMessage());
            throw e;
        }
    }





    public List<Message> getAllMessagesForUser(String email) {
        List<Message> messages = messageRepository.findMessagesByEmail(email);
        System.out.println("Retrieved Messages for " + email + ": " + messages);
        return messages;
    }


    public Message sendGroupMessage(String senderEmail, String groupId, String content) {
        Message message = new Message();
        message.setSenderEmail(senderEmail);
        message.setGroupId(groupId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getGroupMessages(String groupId) {
        return messageRepository.findByGroupId(groupId);
    }
}

