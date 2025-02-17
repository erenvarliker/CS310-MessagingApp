

package com.example.howudoin.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.howudoin.model.User;
import com.example.howudoin.service.FriendService;

@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;


    @PostMapping("/add")
    public ResponseEntity<?> sendFriendRequest(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        String senderEmail = authentication.getName();
        String recipientEmail = requestBody.get("email"); // Extract email from JSON body

        friendService.sendFriendRequest(senderEmail, recipientEmail);

        return ResponseEntity.ok("Friend request sent");
    }


    @PostMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        try {
            String receiverEmail = authentication.getName();
            String senderEmail = requestBody.get("senderEmail"); // Extract senderEmail from JSON body

            friendService.acceptFriendRequest(receiverEmail, senderEmail);
            return ResponseEntity.ok("Friend request accepted");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request.");
        }
    }

    @GetMapping
    public ResponseEntity<?> getFriends(Authentication authentication) {
        String userEmail = authentication.getName();

        List<User> friends = friendService.getFriends(userEmail);

        return ResponseEntity.ok(friends);
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<?> getIncomingFriendRequests(Authentication authentication) {
        String userEmail = authentication.getName();

        List<User> incomingRequests = friendService.getIncomingFriendRequests(userEmail);

        return ResponseEntity.ok(incomingRequests);
    }

    @GetMapping("/requests/outgoing")
    public ResponseEntity<?> getOutgoingFriendRequests(Authentication authentication) {
        String userEmail = authentication.getName();

        List<User> outgoingRequests = friendService.getOutgoingFriendRequests(userEmail);

        return ResponseEntity.ok(outgoingRequests);
    }
}
