const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");

const getAllTickets = asyncHandler(async (req, res) => {
  try {
    // Fetch all tickets from the database
    const tickets = await Ticket.find();

    // Return the tickets in the response
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
});

const createTicket = asyncHandler(async (req, res) => {
  try {
    const { orderId, subject, message } = req.body;
    console.log(req.user);
    const sellerId = req.user.name; // Assuming the seller is logged in
    console.log("sellerId", sellerId);

    const ticket = new Ticket({
      orderId,
      sellerId,
      subject,
      messages: [{ sender: sellerId, message }],
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creating ticket" });
  }
});

const getTicketsByOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const tickets = await Ticket.find({ orderId })
      .populate("sellerId")
      .populate("messages.sender");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
});

const addMessageToTicket = asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { message } = req.body;
    const sender = req.user._id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.messages.push({ sender, message });
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error adding message" });
  }
});

// @desc    Reply to a ticket (Admin only)
// @route   PUT /api/tickets/:id/reply
// @access  Private/Admin
const updateTicketStatus = asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error updating ticket status" });
  }
});

const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  // .populate("sellerId", "name email") // Populate seller details if needed
  // .populate("messages.sender", "name email"); // Populate sender details in messages

  if (ticket) {
    res.status(200).json(ticket);
  } else {
    res.status(404).json({ message: "Ticket not found" });
    res.status(404);
    throw new Error("Ticket not found");
  }
});

module.exports = {
  getTicketById,
  getAllTickets,
  createTicket,
  getTicketsByOrder,
  addMessageToTicket,
  updateTicketStatus,
};
