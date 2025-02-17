// src/main/java/com/howudoin/service/FriendService.java

package com.example.howudoin.service;

import com.example.howudoin.model.User;
import com.example.howudoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class FriendService {

    @Autowired
    private UserRepository userRepository;

    public void sendFriendRequest(String senderEmail, String receiverEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new NoSuchElementException("Sender not found"));
        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new NoSuchElementException("Receiver not found"));

        if (sender.getFriends().contains(receiver.getId())) {
            throw new IllegalStateException("You are already friends");
        }

        if (sender.getOutgoingFriendRequests().contains(receiver.getId())) {
            throw new IllegalStateException("Friend request already sent");
        }

        // Update outgoing and incoming friend requests
        if (!receiver.getIncomingFriendRequests().contains(sender.getId())) {
            receiver.getIncomingFriendRequests().add(sender.getId());
        }
        if (!sender.getOutgoingFriendRequests().contains(receiver.getId())) {
            sender.getOutgoingFriendRequests().add(receiver.getId());
        }

        userRepository.save(sender);
        userRepository.save(receiver);
    }

    public void acceptFriendRequest(String receiverEmail, String senderEmail) {
        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new NoSuchElementException("Receiver not found"));
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new NoSuchElementException("Sender not found"));

        // Ensure the request exists in the correct lists
        if (!receiver.getIncomingFriendRequests().contains(sender.getId())) {
            throw new NoSuchElementException("Friend request not found");
        }

        // Remove the requests from both lists and add each other to the friends list
        receiver.getIncomingFriendRequests().remove(sender.getId());
        sender.getOutgoingFriendRequests().remove(receiver.getId());
        receiver.getFriends().add(sender.getId());
        sender.getFriends().add(receiver.getId());

        userRepository.save(receiver);
        userRepository.save(sender);
    }


    public List<User> getFriends(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return userRepository.findAllById(user.getFriends());
    }

    public List<User> getIncomingFriendRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return userRepository.findAllById(user.getIncomingFriendRequests());
    }

    public List<User> getOutgoingFriendRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return userRepository.findAllById(user.getOutgoingFriendRequests());
    }
}
