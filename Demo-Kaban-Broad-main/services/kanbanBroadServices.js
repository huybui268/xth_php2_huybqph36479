import axiosInstance from "~/ultis/apiService";

export const getLanes = async () => {
  try {
    const { data } = await axiosInstance.get("/lanes");
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const handleTicketMove = async (lanes) => {
//   try {
//     const requests = lanes.map((lane) =>
//       axiosInstance.put(`/lanes/${lane.id}`, lane)
//     );
//     await Promise.all(requests);
//   } catch (error) {
//     console.log(error);
//   }
// };

const moveTicket = async (payload) => {
  try {
    const { data } = await axiosInstance.put(`/tickets/move`, payload);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createTicket = async (ticket) => {
  try {
    const { data } = await axiosInstance.post(`/tickets`, ticket);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTicket = async (landId, ticketId, ticket) => {
  try {
    const { data } = await axiosInstance.put(
      `/lanes/${landId}/tickets/${ticketId}`,
      ticket
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTicket = async (landId, ticketId) => {
  try {
    const { data } = await axiosInstance.delete(
      `/lanes/${landId}/tickets/${ticketId}`
    );
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const KanbanBroadServices = {
  getLanes,
  // handleTicketMove,
  moveTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
