package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface NotificationRepo extends JpaRepository<Notification, UUID> {
    //    Get All (Notifications-> (Read,unRead))   For ((Specific-User))
    Page<Notification> findByUserIdOrderByCreatedDateDesc(UUID userId, Pageable pageable);

    //    Get unRead Counts
    long countByUserIdAndIsReadFalse(UUID userId);

    //    Make All Read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadByUserId(@Param("userId") UUID userId);

    //    Make ((Specific-Notification)) Read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.user.id = :userId")
    void markAsReadByIdAndUserId(@Param("notificationId") UUID notificationId, @Param("userId") UUID userId);


}
