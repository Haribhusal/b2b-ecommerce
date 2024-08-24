const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");
const { io } = require("../socket"); // Ensure this path is correct

const ticketController = {
  getAllTickets: asyncHandler(async (req, res) => {
    try {
      const tickets = await Ticket.find({
        user: req.user.role === "seller" ? req.user._id : { $exists: true },
      })
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
        .populate("user", "name role")
        .populate("messages.sender", "name role");

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  }),

  createTicket: asyncHandler(async (req, res) => {
    try {
      const { orderId, subject, message } = req.body;
      const user = req.user;

      const ticket = await Ticket.create({
        orderId,
        user,
        subject,
        messages: [{ sender: user._id, message }],
      });

      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Error creating ticket" });
    }
  }),

  getTicketsByOrder: asyncHandler(async (req, res) => {
    try {
      const { orderId } = req.params;
      const tickets = await Ticket.find({ orderId })
        .populate("user", "name role")
        .populate("messages.sender", "name role");

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Error fetching tickets" });
    }
  }),

  addMessageToTicket: asyncHandler(async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { message } = req.body;
      const sender = req.user;

      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            messages: { sender: sender._id, message, timestamp: new Date() },
          },
        },
        { new: true, runValidators: true }
      )
        .populate("messages.sender", "name role")
        .populate("user", "name role");

      // io.emit(`messageReceived:${ticketId}`, {
      //   sender: { name: sender.name, role: sender.role },
      //   message,
      //   timestamp: new Date(),
      // });

      res.status(200).json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding message" });
    }
  }),

  getTicketById: asyncHandler(async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id)
        .populate("user", "name role")
        .populate("messages.sender", "name role")
        .populate({
          path: "orderId",
          select: "orderNumber items totalAmount status createdAt",
          populate: {
            path: "items.product",
            select: "name price images",
          },
        });

      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ message: "Ticket not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching ticket" });
    }
  }),

  updateTicketStatus: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const ticket = await Ticket.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Error updating ticket status" });
    }
  }),
};

module.exports = ticketController;
