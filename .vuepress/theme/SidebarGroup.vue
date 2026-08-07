<template>
  <div class="sidebar-group" :class="{ first, collapsable }">
    <p class="sidebar-heading" :class="{ open }" @click="$emit('toggle')">
      <span>{{ item.title }}</span>
      <span class="arrow" v-if="collapsable" :class="open ? 'down' : 'right'"></span>
      <VersionSelect
        class="float-right"
        v-if="isVersioned"
        :versions="item.versions"
        v-model="versionSelect"
      />
    </p>
    <DropdownTransition>
      <ul class="sidebar-group-items" ref="items" v-if="open || !collapsable">
        <li v-for="child in children">
          <SidebarLink :item="child" />
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<script>
import SidebarLink from "./SidebarLink.vue";
import DropdownTransition from "./DropdownTransition.vue";
import VersionSelect from "./VersionSelect.vue";

export default {
  name: "SidebarGroup",
  props: ["item", "first", "open", "collapsable"],
  components: { SidebarLink, DropdownTransition, VersionSelect },
  data: function() {
    let isVersioned = this.item.versions.length > 0;

    let versionSelect = "";
    if (isVersioned) {
      versionSelect = this.item.currentVersion || this.item.versions[0].name;
      const matched = this.matchVersion(this.$router.currentRoute.path);
      if (matched) {
        versionSelect = matched.name;
      }
    }

    return {
      isVersioned,
      versionSelect
    };
  },
  methods: {
    // Finds which version (if any) the given path belongs to, accounting for
    // versions with a custom basePath living outside this group's own path
    // (e.g. Wings' "Daemon 0.6" living under /daemon/0.6 instead of /wings/0.6).
    matchVersion(path) {
      return this.item.versions.find(v => {
        const prefix = v.basePath !== undefined ? v.basePath : this.item.path + v.name;
        return path.startsWith(prefix);
      });
    }
  },
  watch: {
    versionSelect(newVersion, oldVersion) {
      const currentPath = this.$router.currentRoute.path;
      const matchedOld = this.matchVersion(currentPath);
      if (
        oldVersion !== newVersion &&
        matchedOld &&
        this.selectedVersion.children.length > 0
      ) {
        // Try to navigate to the same page in the new version, or default to the first one
        const oldPrefix =
          matchedOld.basePath !== undefined
            ? matchedOld.basePath
            : this.item.path + matchedOld.name;
        let path = currentPath.substr(oldPrefix.length);
        this.$router.push(
          this.selectedVersion.children.find(c => {
            return c.path.endsWith(path);
          }) || this.selectedVersion.children[0]
        );
      }
    },
    $route(to, from) {
      if (this.isVersioned) {
        const matched = this.matchVersion(to.path);
        if (matched) {
          this.versionSelect = matched.name;
        }
      }
    }
  },
  computed: {
    selectedVersion: function() {
      return this.item.versions.find(v => v.name === this.versionSelect);
    },
    children: function() {
      return this.isVersioned
        ? this.selectedVersion.children
        : this.item.children;
    }
  }
};
</script>
