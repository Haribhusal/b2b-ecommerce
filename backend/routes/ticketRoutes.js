const express = require("express");
const {
  createTicket,
  getTicketsBySeller,
  getAllTickets,
  addMessageToTicket,
  updateTicketStatus,
  getTicketsByOrder,
  getTicketById,
} = require("../controllers/ticketController");
const { protect, admin, seller } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, seller, createTicket)
  .get(protect, getAllTickets);

router
  .route("/:id")
  .get(protect, getTicketById)
  .patch(protect, admin, updateTicketStatus);

router.route("/:ticketId/messages").post(protect, addMessageToTicket);

router.route("/order/:orderId").get(protect, seller, getTicketsByOrder);

module.exports = router;
