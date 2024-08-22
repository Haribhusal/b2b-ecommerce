const express = require("express");
const {
  createTicket,
  getTicketsByOrder,
  addMessageToTicket,
  updateTicketStatus,
  getAllTickets,
  getTicketById,
} = require("../controllers/ticketController");
const { protect, admin, seller } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, seller, createTicket)
  .get(protect, getAllTickets);
router.route("/:id").get(protect, getTicketById);

router.route("/order/:orderId").get(protect, seller, getTicketsByOrder);
router.route("/:ticketId/messages").post(protect, addMessageToTicket);
router.route("/:ticketId/status").patch(protect, seller, updateTicketStatus);

module.exports = router;
