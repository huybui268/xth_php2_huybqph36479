<script setup>
import { EllipsisVertical, Trash2, Pencil } from "lucide-vue-next";
const props = defineProps({
  ticket: Object,
  laneId: Number,
  handelShowOrUpdateCard: Function,
  handleDelete: Function
});
const handleDelete = (event) => {
  event.stopPropagation();
  props.handleDelete( props.laneId, props.ticket.id);

};
</script>


<template>
  <div
    class="relative flex flex-col-reverse p-4 mb-3 space-y-2 space-y-reverse bg-white border-t border-l border-r border-gray-100 rounded-md shadow-md hover:cursor-move"
  >
    <div>{{ ticket.title }}</div>
    <div class="text-sm text-gray-400">
      {{ ticket.author }}, {{ ticket.created_at }}
    </div>

    <div class="flex justify-between gap-2 text-sm text-gray-400">
      <div class="flex gap-2 text-sm text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="font-semibold text-gray-400">
          {{ ticket.comments_count }}
        </span>
      </div>

      <div class="flex gap-2">
        <div
          v-if="ticket.priority == 'Low'"
          class="px-3 text-sm font-semibold text-green-700 bg-green-100 rounded-full top-4 right-4"
        >
          {{ ticket.priority }} Level
        </div>
        <div
          v-if="ticket.priority == 'Medium'"
          class="px-3 text-sm font-semibold text-yellow-700 bg-yellow-100 rounded-full top-4 right-4"
        >
          {{ ticket.priority }} Level
        </div>
        <div
          v-if="ticket.priority == 'High'"
          class="px-3 text-sm font-semibold text-red-700 bg-red-100 rounded-full top-4 right-4"
        >
          {{ ticket.priority }} Level
        </div>
        <div>
          <UPopover>
            <EllipsisVertical />

            <template #panel>
              <div class="flex flex-col w-full gap-2 px-2 py-4">
                <UButton @click="handleDelete">
                  <Trash2 class="w-4 h-4"
                /></UButton>
                <UButton
                  @click="
                    handelShowOrUpdateCard(ticket,laneId)
                  "
                  ><Pencil class="w-4 h-4"
                /></UButton>
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
  </div>
</template>
