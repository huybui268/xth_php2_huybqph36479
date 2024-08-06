import jsonServer from "json-server";
import bodyParser from "body-parser";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(bodyParser.json());

// Custom route to add a ticket to a specific lane
server.post("/lanes/:laneId/tickets", (req, res) => {
  const { laneId } = req.params;
  const newTicket = req.body;
  const lanes = router.db.get("lanes").value();
  const [targetLane] = lanes;
  targetLane.tickets.push(newTicket);
  router.db
    .get("lanes")
    .find({ id: laneId })
    .assign({ tickets: targetLane.tickets })
    .write();
  res.status(201).json(lanes);
});

// Custom route to update a ticket to a specific lane
server.put("/lanes/:laneId/tickets/:id", (req, res) => {
  const { laneId, id } = req.params;
  const updatedTicket = req.body;

  // Tìm lane theo laneId
  const lane = router.db.get("lanes").find({ id: laneId }).value();

  if (lane) {
    // Tìm vé theo id
    const ticketIndex = lane.tickets.findIndex((ticket) => ticket.id === id);

    if (ticketIndex !== -1) {
      // Cập nhật vé
      lane.tickets[ticketIndex] = {
        ...lane.tickets[ticketIndex],
        ...updatedTicket,
      };
      console.log(lane.tickets);

      // Cập nhật cơ sở dữ liệu với lane đã thay đổi
      router.db
        .get("lanes")
        .find({ id: laneId })
        .assign({ tickets: lane.tickets })
        .write();
      res
        .status(200)
        .json({ success: true, data: lane, message: "Ticket updated" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } else {
    res.status(404).json({ error: "Lane not found" });
  }
});

// Custom route to update a ticket to a specific lane
server.delete("/lanes/:laneId/tickets/:id", (req, res) => {
  const { laneId, id } = req.params;

  // Tìm lane theo laneId
  const lane = router.db.get("lanes").find({ id: laneId }).value();

  if (lane) {
    // Lọc bỏ vé cần xóa
    lane.tickets = lane.tickets.filter((ticket) => ticket.id !== id);

    // Cập nhật cơ sở dữ liệu với lane đã thay đổi
    router.db
      .get("lanes")
      .find({ id: laneId })
      .assign({ tickets: lane.tickets })
      .write();

    res.status(200).json({ message: "Ticket deleted", data: lane, success: true });
  } else {
    res.status(404).json({ error: "Lane not found" });
  }
});

server.use(middlewares);
server.use(router);

const port = 8000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
