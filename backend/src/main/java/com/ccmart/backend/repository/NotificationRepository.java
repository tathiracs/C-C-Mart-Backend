package com.ccmart.backend.repository;

import com.ccmart.backend.model.Notification;
import com.ccmart.backend.model.Notification.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, NotificationStatus status);
    
    long countByUserIdAndStatus(Long userId, NotificationStatus status);
    
    @Modifying
    @Query("UPDATE Notification n SET n.status = :status WHERE n.user.id = :userId")
    void updateAllStatusByUserId(@Param("userId") Long userId, @Param("status") NotificationStatus status);
    
    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ' WHERE n.id IN :ids AND n.user.id = :userId")
    void markAsReadByIds(@Param("ids") List<Long> ids, @Param("userId") Long userId);
}
