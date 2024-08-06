
<script setup>
import { z } from "zod";
import draggable from "vuedraggable";
import { toast } from "vue3-toastify";
import { KanbanBroadServices } from "~/services/kanbanBroadServices";

const lanes = ref([]);
const ticketId = ref(null);
const showCard = ref(false);
const priorityOptions = ["Low", "Medium", "High"];

const state = reactive({
  title: "",
  description: "",
  link_issue: "",
  priority: priorityOptions[0],
});

const isEditing = reactive({
  value: false,
  ticketId: null,
  laneId: null,
});

const TicketSchema = z.object({
  title: z.string().min(8, "Must be at least 8 characters"),
  description: z.string().min(8, "Must be at least 8 characters"),
  link_issue: z.string().min(8, "Must be at least 8 characters"),
  priority: z.enum(priorityOptions),
});

const onStart = async (event) => {
  ticketId.value = Number(event.item.dataset.ticketId);
};

const onEnd = async (event) => {
  const oldIndexTicket = event.oldIndex;
  const newIndexTicket = event.newIndex;
  const fromLaneId = event.from.dataset.laneId;
  const toLaneId = event.to.dataset.laneId;
  // const ticketId = event.item.dataset.ticketId;
  const payload = {
    oldIndex: oldIndexTicket,
    newIndex: newIndexTicket,
    fromLaneId: Number(fromLaneId),
    toLaneId: Number(toLaneId),
    ticketId: ticketId.value,
  };
  if (toLaneId == fromLaneId && oldIndexTicket == newIndexTicket) {
    toast.warning("Ticket not moved");
    return;
  }
  const moveTicketResponse = await KanbanBroadServices.moveTicket(payload);
  if (!moveTicketResponse.success || !moveTicketResponse.data) {
    toast.error("Error moving ticket");
  }
  toast.success("Ticket moved successfully");
};

const dragOptions = computed(() => {
  return {
    animation: 200,
    disable: false,
    ghostClass: "ghost",
  };
});
const validate = (state) => {
  try {
    TicketSchema.parse(state);
    return [];
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.errors.map((err) => ({
        path: err.path[0],
        message: err.message,
      }));
    }
    return [{ path: "unknown", message: "An unknown error occurred" }];
  }
};

const handleShowCard = (payload, laneId) => {
  showCard.value = true;
  if (payload) {
    isEditing.laneId = laneId;
    isEditing.value = true;
    isEditing.ticketId = payload.id;
    state.title = payload.title;
    state.description = payload.description;
    state.link_issue = payload.link_issue;
    state.priority = payload.priority;
  }
};
const handleDelete = async (laneId, ticketId) => {
  const deleteTicketResponse = await KanbanBroadServices.deleteTicket(
    laneId,
    ticketId
  );
  if (!deleteTicketResponse.success || !deleteTicketResponse.data) {
    toast.error("Error deleting ticket");
  }
  lanes.value = deleteTicketResponse.data;
  toast.success("Ticket deleted successfully");
};

async function onSubmit(event) {
  const payload = event.data;
  let response;
  if (isEditing.value) {
    const updateTicketResponse = await KanbanBroadServices.updateTicket(
      isEditing.laneId,
      isEditing.ticketId,
      payload
    );
    if (!updateTicketResponse.success || !updateTicketResponse.data) {
      toast.error("Error updating ticket");
    }
    response = updateTicketResponse.data;
    toast.success("Ticket updated successfully");
  } else {
    const createTicketResponse = await KanbanBroadServices.createTicket(
      payload
    );
    if (!createTicketResponse.success || !createTicketResponse.data) {
      toast.error("Error creating ticket");
    }
    response = createTicketResponse.data;
    toast.success("Ticket created successfully");
  }

  showCard.value = false;
  state.title = "";
  state.description = "";
  state.link_issue = "";
  state.priority = priorityOptions[0];
  isEditing.value = false;
  lanes.value = response;
}

const fetchLanes = async () => {
  const lanesResponse = await KanbanBroadServices.getLanes();
  lanes.value = lanesResponse.data;
};

onMounted(() => {
  fetchLanes();
});
</script>

<template>
  <KanbanBroadControl />
  <div>
    <div>
      <UButton
        class="text-white bg-blue-500 hover:bg-blue-700"
        icon="i-heroicons-plus"
        @click="handleShowCard()"
        >Add Ticket</UButton
      >
    </div>
    <Teleport to="body">
      <UModal v-model="showCard">
        <div class="p-4">
          <div class="text-lg font-semibold">Create new Ticket</div>
          <div class="p-4">
            <UForm
              class="space-y-4"
              :validate="validate"
              :state="state"
              @submit="onSubmit"
            >
              <UFormGroup label="Title" name="title">
                <UInput autofocus="false" v-model="state.title" />
              </UFormGroup>

              <UFormGroup label="Description" name="description">
                <UTextarea v-model="state.description" type="text" />
              </UFormGroup>

              <UFormGroup label="Link Issue" name="link_issue">
                <UInput v-model="state.link_issue" type="text" />
              </UFormGroup>

              <UFormGroup label="Priority Issue" name="priorityIssue">
                <USelect v-model="state.priority" :options="priorityOptions" />
              </UFormGroup>

              <UButton type="submit"> Submit </UButton>
            </UForm>
          </div>
        </div>
      </UModal>
    </Teleport>
  </div>
  <div class="grid grid-cols-3 gap-6">
    <div
      v-for="lane in lanes"
      :key="lane.name"
      class="border border-gray-300 rounded-md bg-gray-50"
    >
      <div
        class="flex justify-between p-4 bg-white border-b border-gray-300 rounded-t-md item-center"
      >
        <div class="text-lg font-semibold">{{ lane.name }}</div>
        <div class="flex items-center space-x-4">
          <button
            class="font-semibold text-blue-500 hover:text-blue-700"
            v-if="lane.name == 'Done'"
          >
            Clear All
          </button>
          <span
            class="block px-3 py-1 text-sm font-semibold bg-gray-200 rounded-xl"
          >
            {{ lane.tickets.length }}
          </span>
        </div>
      </div>
      <div class="h-full p-4">
        <draggable
          class="min-h-full"
          v-model="lane.tickets"
          group="tickets"
          @start="onStart"
          @end="onEnd"
          item-key="name"
          v-bind="dragOptions"
          :data-lane-id="lane.id"
        >
          <template #item="{ element }">
            <div :data-ticket-id="element.id">
              <Ticket
                :handleDelete="handleDelete"
                :handelShowOrUpdateCard="handleShowCard"
                :ticket="element"
                :laneId="lane.id"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

