

package com.example.howudoin.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String lastName;
    private String email;
    private String password;

    // Set of user IDs representing friends
    private Set<String> friends = new HashSet<>();

    // Set of user IDs representing incoming friend requests
    private Set<String> incomingFriendRequests = new HashSet<>();

    // Set of user IDs representing outgoing friend requests
    private Set<String> outgoingFriendRequests = new HashSet<>();

    public boolean isFriend(String userId) {
        return friends.contains(userId);
    }

    public boolean hasIncomingRequestFrom(String userId) {
        return incomingFriendRequests.contains(userId);
    }

    public boolean hasOutgoingRequestTo(String userId) {
        return outgoingFriendRequests.contains(userId);
    }
    public String getFullName() {
        return name + " " + lastName;
    }
}
