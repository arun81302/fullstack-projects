import Notification from "../models/notification.model.js";

// Logged-in user ki saari notifications fetch karne ke liye
export const getNotifications = async (req, res) => {
  try {

    // Current user ki notifications latest order mein fetch karo
    const notifications = await Notification.find({
      recipient: req.userId,
    })
      // Notification bhejne wale user ki details lao, password ke bina
      .populate("sender", "-password")

      // Related connection request ki details bhi fetch karo
      .populate("connection")

      // Latest notification sabse upar show karo
      .sort({ createdAt: -1 });

    // Current user ki unread notifications count karo
    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      isRead: false,
    });

    // Notifications aur unread count frontend ko bhejo
    return res.status(200).json({
      notifications,
      unreadCount,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error getting notifications",
      error: err.message,
    });
  }
};


// Kisi ek notification ko read mark karne ke liye
export const markNotificationAsRead = async (req, res) => {
  try {

    // Notification ID aur recipient dono match hone chahiye
    // Taaki user kisi doosre user ki notification update na kar sake
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.userId,
      },
      { isRead: true },

      // Update hone ke baad updated document return karo
      { new: true }
    );

    // Notification nahi mili ya current user ki nahi hai
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating notification",
      error: err.message,
    });
  }
};


// Current user ki saari unread notifications read mark karne ke liye
export const markAllNotificationsAsRead = async (req, res) => {
  try {

    // Sirf current user ki unread notifications update karo
    await Notification.updateMany(
      {
        recipient: req.userId,
        isRead: false,
      },
      { isRead: true }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating notifications",
      error: err.message,
    });
  }
};