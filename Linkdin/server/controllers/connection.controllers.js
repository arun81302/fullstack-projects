import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Kisi doosre user ko connection request bhejne ke liye
export const sendConnectionRequest = async (req, res) => {
  try {
    // Logged-in user ki ID middleware se milegi
    const senderId = req.userId;

    // Jisko request bhejni hai uski ID URL params se milegi
    const receiverId = req.params.userId;

    // User khud ko connection request nahi bhej sakta
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself",
      });
    }

    // Check karo ki receiver database mein exist karta hai ya nahi
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Dono users ke beech pehle se koi connection request check karo
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    // Agar pehle se connected hain toh nayi request nahi bhej sakte
    if (existingConnection?.status === "accepted") {
      return res.status(400).json({
        message: "You are already connected",
      });
    }

    // Agar request pending hai toh duplicate request prevent karo
    if (existingConnection?.status === "pending") {

      // Check karo ki current user ne request bheji hai ya nahi
      if (existingConnection.sender.toString() === senderId.toString()) {
        return res.status(400).json({
          message: "Connection request already sent",
        });
      }

      // Agar saamne wale ne pehle hi request bhej rakhi hai
      return res.status(400).json({
        message: "This user has already sent you a connection request",
      });
    }

    let connection;

    // Rejected request dobara bheji ja rahi hai toh existing record update karo
    if (existingConnection) {
      existingConnection.sender = senderId;
      existingConnection.receiver = receiverId;
      existingConnection.status = "pending";

      connection = await existingConnection.save();
    } else {
      // Pehli baar request bhejne par naya connection record create karo
      connection = await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });
    }

    // Purani notifications delete karo taaki duplicate notification na bane
    await Notification.deleteMany({
      connection: connection._id,
    });

    // Receiver ke liye nayi connection request notification create karo
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "connection_request",
      connection: connection._id,
    });

    return res.status(201).json({
      message: "Connection request sent successfully",
      connection,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error sending connection request",
      error: err.message,
    });
  }
};


// Do users ke beech connection request ka current status check karne ke liye
export const getConnectionStatus = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;

    // Agar user apni hi profile dekh raha hai
    if (currentUserId.toString() === targetUserId) {
      return res.json({
        status: "self",
        requestId: null,
      });
    }

    // Dono directions mein connection record search karo
    const connection = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId },
      ],
    });

    // Koi request ya connection nahi mila
    if (!connection) {
      return res.json({
        status: "none",
        requestId: null,
      });
    }

    // Request accept ho chuki hai
    if (connection.status === "accepted") {
      return res.json({
        status: "connected",
        requestId: connection._id,
      });
    }

    // Request pending hai toh sender aur receiver identify karo
    if (connection.status === "pending") {
      const isSender =
        connection.sender.toString() === currentUserId.toString();

      return res.json({
        status: isSender ? "sent" : "received",
        requestId: connection._id,
      });
    }

    // Rejected ya kisi aur status ke case mein none return karo
    return res.json({
      status: "none",
      requestId: null,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error getting connection status",
      error: err.message,
    });
  }
};


// Current user ko mili hui pending requests fetch karne ke liye
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      receiver: req.userId,
      status: "pending",
    })
      // Sender ki complete details lao, password ko chhodkar
      .populate("sender", "-password")
      // Latest request sabse pehle show karo
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error getting received requests",
      error: err.message,
    });
  }
};


// Current user dwara bheji gayi pending requests fetch karne ke liye
export const getSentRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      sender: req.userId,
      status: "pending",
    })
      // Receiver ki details populate karo, password ko chhodkar
      .populate("receiver", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error getting sent requests",
      error: err.message,
    });
  }
};


// Receiver ki taraf se connection request accept karne ke liye
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Request ID se connection record find karo
    const connection = await Connection.findById(requestId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    // Sirf receiver hi apni received request accept kar sakta hai
    if (connection.receiver.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot accept this request",
      });
    }

    // Sirf pending request hi accept ho sakti hai
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending",
      });
    }

    // Connection ka status accepted kar do
    connection.status = "accepted";
    await connection.save();

    // Dono users ki connections list mein ek-doosre ko add karo
    // $addToSet duplicate user IDs add hone se rokta hai
    await User.findByIdAndUpdate(connection.sender, {
      $addToSet: { connections: connection.receiver },
    });

    await User.findByIdAndUpdate(connection.receiver, {
      $addToSet: { connections: connection.sender },
    });

    // Request accept hone ke baad notification read mark karo
    await Notification.updateMany(
      {
        connection: connection._id,
        recipient: req.userId,
      },
      { isRead: true }
    );

    return res.status(200).json({
      message: "Connection request accepted",
      connection,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error accepting connection request",
      error: err.message,
    });
  }
};


// Receiver ki taraf se connection request reject karne ke liye
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Request ID se connection record find karo
    const connection = await Connection.findById(requestId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    // Sirf receiver hi received request reject kar sakta hai
    if (connection.receiver.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot reject this request",
      });
    }

    // Pending request hi reject ki ja sakti hai
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending",
      });
    }

    // Connection ka status rejected kar do
    connection.status = "rejected";
    await connection.save();

    // Related notification ko read mark kar do
    await Notification.updateMany(
      {
        connection: connection._id,
        recipient: req.userId,
      },
      { isRead: true }
    );

    return res.status(200).json({
      message: "Connection request rejected",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error rejecting connection request",
      error: err.message,
    });
  }
};


// Sender apni bheji hui pending request cancel kar sakta hai
export const cancelConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Request ID se connection record find karo
    const connection = await Connection.findById(requestId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    // Sirf request bhejne wala user hi ise cancel kar sakta hai
    if (connection.sender.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot cancel this request",
      });
    }

    // Sirf pending request cancel ho sakti hai
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending",
      });
    }

    // Request se related notification bhi delete karo
    await Notification.deleteMany({
      connection: connection._id,
    });

    // Connection request ko database se remove karo
    await connection.deleteOne();

    return res.status(200).json({
      message: "Connection request cancelled",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error cancelling connection request",
      error: err.message,
    });
  }
};


// Current logged-in user ke saare accepted connections fetch karo
export const getMyConnections = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      // User document se sirf connections field select karo
      .select("connections")
      // Connections ki IDs ki jagah complete user details lao
      .populate("connections", "-password");

    return res.status(200).json({
      connections: user?.connections || [],
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error getting connections",
      error: err.message,
    });
  }
};