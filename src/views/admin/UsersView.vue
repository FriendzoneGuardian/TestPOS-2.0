<template>
  <div>
    <div class="text-h5 font-weight-bold mb-1">User Management</div>
    <div class="text-caption text-medium-emphasis mb-4">Manage system users and roles (Admin only)</div>

    <v-card rounded="xl" elevation="1">
      <v-card-title class="pa-4 d-flex align-center justify-space-between">
        <span class="text-subtitle-1 font-weight-bold">System Users</span>
        <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" variant="elevated" @click="showAddDialog = true">
          Add User
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="users"
          density="comfortable"
          item-value="id"
        >
          <template #item.role="{ item }">
            <v-chip :color="roleColor(item.role)" size="small" variant="tonal">{{ item.role }}</v-chip>
          </template>
          <template #item.status="{ item }">
            <v-chip :color="item.active ? 'success' : 'error'" size="small" variant="tonal">
              {{ item.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon="mdi-pencil" size="x-small" variant="text" color="primary" @click="editUser(item)" />
            <v-btn
              :icon="item.active ? 'mdi-account-off' : 'mdi-account-check'"
              size="x-small"
              variant="text"
              :color="item.active ? 'error' : 'success'"
              @click="toggleActive(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="pa-4">{{ editingUser ? 'Edit User' : 'Add User' }}</v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-text-field v-model="form.name" label="Full Name" variant="outlined" density="compact" class="mb-3" />
          <v-text-field v-model="form.username" label="Username" variant="outlined" density="compact" class="mb-3" />
          <v-text-field v-model="form.password" label="Password" type="password" variant="outlined" density="compact" class="mb-3" />
          <v-select
            v-model="form.role"
            :items="['admin', 'accounting', 'cashier']"
            label="Role"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-spacer />
          <v-btn color="primary" variant="elevated" @click="saveUser" rounded="lg">
            {{ editingUser ? 'Update' : 'Add User' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Admin User', username: 'admin', role: 'admin', active: true },
  { id: 2, name: 'Jane Reyes', username: 'accounting', role: 'accounting', active: true },
  { id: 3, name: 'Mark Santos', username: 'cashier', role: 'cashier', active: true },
])

const headers = [
  { title: 'ID', key: 'id', width: 60 },
  { title: 'Full Name', key: 'name' },
  { title: 'Username', key: 'username' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, width: 100 },
]

const showAddDialog = ref(false)
const editingUser = ref(null)
const form = ref({ name: '', username: '', password: '', role: 'cashier' })

function roleColor(role) {
  return { admin: 'error', accounting: 'info', cashier: 'success' }[role] || 'primary'
}

function editUser(user) {
  editingUser.value = user
  form.value = { name: user.name, username: user.username, password: '', role: user.role }
  showAddDialog.value = true
}

function toggleActive(user) {
  user.active = !user.active
}

function saveUser() {
  if (editingUser.value) {
    const u = users.value.find(u => u.id === editingUser.value.id)
    if (u) { u.name = form.value.name; u.username = form.value.username; u.role = form.value.role }
  } else {
    users.value.push({
      id: users.value.length + 1,
      name: form.value.name,
      username: form.value.username,
      role: form.value.role,
      active: true
    })
  }
  closeDialog()
}

function closeDialog() {
  showAddDialog.value = false
  editingUser.value = null
  form.value = { name: '', username: '', password: '', role: 'cashier' }
}
</script>
