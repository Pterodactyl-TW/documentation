<template>
  <div class="inline-block">
    {{ version.title || version.name }}
    <span class="rounded-full ml-2" :class="classes">{{ statusText }}</span>
  </div>
</template>

<script>
import VersionSelectItem from "./VersionSelectItem.vue";

export default {
  name: "VersionSelectItem",
  props: {
    version: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusText() {
      return {
        deprecated: "已棄用",
        current: "目前版本",
        stable: "穩定版",
        beta: "測試版",
        eol: "已終止支援"
      }[this.version.status] || this.version.status;
    },
    classes() {
      return (
        {
          deprecated: ["text-orange"],
          current: ["text-green-dark"],
          stable: ["text-green-dark"],
          beta: ["text-blue"],
          eol: ["text-red"]
        }[this.version.status] || ["text-grey"]
      );
    }
  }
};
</script>