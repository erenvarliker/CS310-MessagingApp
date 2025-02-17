package com.example.howudoin.service;

import com.example.howudoin.model.Group;
import com.example.howudoin.model.User;
import com.example.howudoin.repository.GroupRepository;
import com.example.howudoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public Group createGroup(String groupName, String creatorEmail, List<String> memberEmails) {
        // Find creator by email
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        // Initialize the member IDs with the creator's ID
        List<String> memberIds = new ArrayList<>();
        memberIds.add(creator.getId());

        // Add each member's ID by email lookup
        for (String email : memberEmails) {
            userRepository.findByEmail(email).ifPresent(user -> memberIds.add(user.getId()));
        }

        // Create and save the group
        Group group = new Group();
        group.setName(groupName);
        group.setCreatorId(creator.getId());
        group.setMemberIds(memberIds);
        group.setCreationTimestamp(LocalDateTime.now());

        return groupRepository.save(group);
    }




    public Group addMemberToGroup(String groupId, String memberEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));
        User member = userRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        group.getMemberIds().add(member.getId());
        return groupRepository.save(group);
    }

    public List<String> getGroupMembers(String groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        return group.getMemberIds().stream().toList();
    }
    // Method to fetch groups for a user
    // Method to fetch groups for a user
    public List<Map<String, Object>> getGroupsForUser(String userEmail) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        // Get user's ID
        String userId = user.getId();

        // Fetch all groups where the user is a member
        List<Group> groups = groupRepository.findAll().stream()
                .filter(group -> group.getMemberIds().contains(userId)) // Check membership
                .toList();

        // Convert groups to required details
        List<Map<String, Object>> userGroups = new ArrayList<>();
        for (Group group : groups) {
            List<String> memberEmails = new ArrayList<>();

            // Fetch emails for each member
            for (String memberId : group.getMemberIds()) {
                userRepository.findById(memberId)
                        .ifPresent(member -> memberEmails.add(member.getEmail()));
            }

            // Prepare group details
            Map<String, Object> groupDetails = Map.of(
                    "id", group.getId(),
                    "name", group.getName(),
                    "creatorEmail", userRepository.findById(group.getCreatorId())
                            .map(User::getEmail)
                            .orElse("Unknown"),
                    "createdAt", group.getCreationTimestamp(),
                    "members", memberEmails
            );

            userGroups.add(groupDetails);
        }

        return userGroups;
    }

    public List<String> getGroupMemberEmails(String groupId) {
    // Find the group by ID
    Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new NoSuchElementException("Group not found"));

    // Convert member IDs to emails
    List<String> memberEmails = new ArrayList<>();
    for (String memberId : group.getMemberIds()) {
        userRepository.findById(memberId)
                .ifPresent(user -> memberEmails.add(user.getEmail()));
    }
    return memberEmails;
}
    
}
