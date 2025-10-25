package com.ccmart.backend.controller;

import com.ccmart.backend.model.Notification;
import com.ccmart.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all notifications for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        long count = notificationService.getUnreadCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        notificationService.markAsRead(id, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        notificationService.markAllAsRead(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        notificationService.deleteNotification(id, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted");
        return ResponseEntity.ok(response);
    }
}
