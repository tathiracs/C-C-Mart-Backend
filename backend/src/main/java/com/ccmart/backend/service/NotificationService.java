package com.ccmart.backend.service;

import com.ccmart.backend.model.Notification;
import com.ccmart.backend.model.Notification.NotificationStatus;
import com.ccmart.backend.model.Order;
import com.ccmart.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Notification Types
    public static final String ORDER_PLACED = "ORDER_PLACED";
    public static final String ORDER_APPROVED = "ORDER_APPROVED";
    public static final String ORDER_DISPATCHED = "ORDER_DISPATCHED";
    public static final String ORDER_IN_TRANSIT = "ORDER_IN_TRANSIT";
    public static final String ORDER_DELIVERED = "ORDER_DELIVERED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";

    /**
     * Create notification based on order status
     */
    @Transactional
    public Notification createOrderNotification(Order order, String oldStatus, String newStatus) {
        String message = generateMessageForStatus(order, newStatus);
        String notificationType = getNotificationTypeForStatus(newStatus);
        
        Notification notification = new Notification(
            order.getUser(),
            message,
            order.getId(),
            notificationType
        );
        
        return notificationRepository.save(notification);
    }

    /**
     * Generate user-friendly message based on order status
     */
    private String generateMessageForStatus(Order order, String status) {
        String orderNumber = "#" + order.getId();
        
        switch (status.toLowerCase()) {
            case "approved":
                return "🎉 Great news! Your order " + orderNumber + " has been approved and is being prepared.";
            
            case "assigned":
                return "📦 Your order " + orderNumber + " has been assigned to a delivery agent.";
            
            case "in_delivery":
                return "🚚 Your order " + orderNumber + " is on the way! Track your delivery.";
            
            case "delivered":
                return "✅ Your order " + orderNumber + " has been delivered successfully. Enjoy your purchase!";
            
            case "cancelled":
                return "❌ Your order " + orderNumber + " has been cancelled.";
            
            case "pending":
            default:
                return "📋 Your order " + orderNumber + " has been placed successfully and is pending approval.";
        }
    }

    /**
     * Map order status to notification type
     */
    private String getNotificationTypeForStatus(String status) {
        switch (status.toLowerCase()) {
            case "approved":
                return ORDER_APPROVED;
            case "assigned":
                return ORDER_DISPATCHED;
            case "in_delivery":
                return ORDER_IN_TRANSIT;
            case "delivered":
                return ORDER_DELIVERED;
            case "cancelled":
                return ORDER_CANCELLED;
            case "pending":
            default:
                return ORDER_PLACED;
        }
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, NotificationStatus.UNREAD);
    }

    /**
     * Get unread notification count
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getUser().getId().equals(userId)) {
                notification.setStatus(NotificationStatus.READ);
                notificationRepository.save(notification);
            }
        });
    }

    /**
     * Mark multiple notifications as read
     */
    @Transactional
    public void markMultipleAsRead(List<Long> notificationIds, Long userId) {
        notificationRepository.markAsReadByIds(notificationIds, userId);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.updateAllStatusByUserId(userId, NotificationStatus.READ);
    }

    /**
     * Delete a notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getUser().getId().equals(userId)) {
                notificationRepository.delete(notification);
            }
        });
    }
}
