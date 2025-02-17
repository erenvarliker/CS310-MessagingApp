package com.example.howudoin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.howudoin.model.Message;
import com.example.howudoin.service.MessageService;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        String senderEmail = authentication.getName();
        String recipientEmail = requestBody.get("recipientEmail");
        String content = requestBody.get("content");

        if (recipientEmail == null || recipientEmail.isEmpty() || content == null || content.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Recipient email and content are required.");
        }

        try {
            Message message = messageService.sendMessage(senderEmail, recipientEmail, content);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages(Authentication authentication) {
        String currentUserEmail = authentication.getName();
        List<Message> messages = messageService.getAllMessagesForUser(currentUserEmail);
        return ResponseEntity.ok(messages);
    }


    // Group message endpoints@PostMapping("/groups/{groupId}/send")
    //    public ResponseEntity<?> sendGroupMessage(@PathVariable String groupId, @RequestBody Map<String, String> requestBody, Authentication authentication) {
    //        String senderEmail = authentication.getName();
    //        String content = requestBody.get("content");
    //
    //        Message message = messageService.sendGroupMessage(senderEmail, groupId, content);
    //        return ResponseEntity.ok(message);
    //    }
    //
    //    @GetMapping("/groups/{groupId}/messages")
    //    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
    //        List<Message> messages = messageService.getGroupMessages(groupId);
    //        return ResponseEntity.ok(messages);
    //    }

}
