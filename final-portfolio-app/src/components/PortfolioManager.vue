<template>
  <!--
    PortfolioManager.vue
    1. READ   -> load items from monday.com and show them in the list
    2. CREATE -> use the form to make a new item
    3. UPDATE -> click Edit, load an item into the form, then save changes
    4. DELETE -> click Delete, confirm, then refresh the list
  -->
  <section class="portfolio-manager" id="portfolio-manager">
    <div class="pm-header">
      <h2>Portfolio Manager</h2>
      <p>
        CRUD example that connects this Vue app to a monday.com board. It reads, create, update, and delete portfolio items!
      </p>
    </div>

    <div class="pm-layout">
      <div class="pm-panel pm-form-panel">
        <h3>
          {{ isEditing ? "Edit Portfolio Item" : "Create Portfolio Item" }}
        </h3>
        <p class="pm-helper-text">
          This form only uses these fields: title, description, tech stack,
          status, GitHub link, and image URL.
        </p>

        <!--
          CREATE + UPDATE AREA

          This is one form that does two jobs:
          - If we are NOT editing, it creates a new item
          - If we ARE editing, it updates an existing item

          @submit.prevent stops the page from refreshing and sends control to
          handleSubmit() in the script section.
        -->
        <form class="pm-form" @submit.prevent="handleSubmit">
          <label>
            <span>Project Title</span>
            <!--
              v-model connects the input to form.title. You'll see this being used everywhere here.
              Whatever the user types becomes JavaScript data we can send to monday.com :)
            -->
            <input
              v-model.trim="form.title"
              type="text"
              placeholder="Example: Mood Bloom"
              required
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              v-model.trim="form.description"
              rows="5"
              placeholder="Write a simple description of the project"
            />
          </label>

          <label>
            <span>Tech Stack</span>
            <input
              v-model.trim="form.techStack"
              type="text"
              placeholder="Example: Vue, Node.js, PostgreSQL"
            />
          </label>

          <label>
            <span>Status</span>
            <input
              v-model.trim="form.status"
              type="text"
              placeholder="Example: Working on it"
            />
          </label>

          <label>
            <span>GitHub Link</span>
            <input
              v-model.trim="form.githubLink"
              type="text"
              placeholder="Example: https://github.com/your-name/project"
            />
          </label>

          <label>
            <span>Image URL</span>
            <input
              v-model.trim="form.imageUrl"
              type="text"
              placeholder="Example: https://images.example.com/project.png"
            />
          </label>

            <!--
              The button label changes based on the current mode.
              If we're editing, "Save Changes", if we're creating an item "Create Item".
            -->
          <div class="pm-button-row">
            <button type="submit" :disabled="isBusy">
              {{
                isBusy
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Item"
              }}
            </button>

            <!--
              Cancel Edit only appears during UPDATE mode.
              Clicking it clears the form and returns the component to CREATE mode.
            -->
            <button
              v-if="isEditing"
              type="button"
              class="pm-secondary"
              @click="resetForm"
              :disabled="isBusy"
            >
              Cancel Edit
            </button>
          </div>
        </form>
      </div>

      <div class="pm-panel pm-list-panel">
        <div class="pm-list-header">
          <div>
            <h3>Portfolio Items</h3>
            <p class="pm-helper-text">
              Reading directly from your monday.com board.
            </p>
          </div>

          <!--
            READ AREA

            This button re-runs loadItems(), which re-fetches the latest data from monday.com.
            It is useful after create, update, and delete, or anytime the board changed.
          -->
          <button class="pm-secondary" @click="loadItems" :disabled="isBusy">
            {{ isBusy ? "Working..." : "Refresh List" }}
          </button>
        </div>

        <!-- Simple feedback messages -->
        <p v-if="message" class="pm-message">{{ message }}</p>
        <p v-if="errorMessage" class="pm-error">{{ errorMessage }}</p>

        <!-- READ: loading state while the app waits for monday.com -->
        <div v-if="isLoading" class="pm-loading">
          Loading portfolio items...
        </div>

        <!-- READ: empty state when no items are found -->
        <div v-else-if="items.length === 0" class="pm-empty">
          No portfolio items found yet. Create your first item using the form.
        </div>

        <!--
          READ: this card list is rendered with v-for.
          Vue loops over every item in the items array and creates one card per item.
        -->
        <div v-else class="pm-card-list">
          <article v-for="item in items" :key="item.id" class="pm-card">
            <div class="pm-card-top">
              <div>
                <h4>{{ item.title }}</h4>
                <p class="pm-status">
                  Status: {{ item.status || "No status yet" }}
                </p>
              </div>
              <div class="pm-card-actions">
                <!--
                  UPDATE: load the clicked item's values into the form.
                -->
                <button
                  class="pm-secondary"
                  @click="startEdit(item)"
                  :disabled="isBusy"
                >
                  Edit
                </button>

                <!--
                  DELETE: ask for confirmation, then remove the item from monday.com.
                -->
                <button
                  class="pm-danger"
                  @click="handleDelete(item)"
                  :disabled="isBusy"
                >
                  Delete
                </button>
              </div>
            </div>

            <p class="pm-description">
              {{ item.description || "No description provided." }}
            </p>
            <ul class="pm-details">
              <li>
                <strong>Tech Stack:</strong>
                {{ item.techStack || "None listed" }}
              </li>
              <li>
                <strong>GitHub Link:</strong>
                {{ item.githubLink || "None listed" }}
              </li>
              <li>
                <strong>Image URL:</strong> {{ item.imageUrl || "None listed" }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Vue helpers used by this component:
// - ref: stores simple reactive values like arrays, booleans, and strings
// - reactive: stores our form object
// - computed: creates a value based on other reactive values
// - onMounted: runs code when the component first appears on the page
import { computed, onMounted, reactive, ref } from "vue";

// Service functions that talk to monday.com.
// - fetchPortfolioItems  -> READ
// - createPortfolioItem  -> CREATE
// - updatePortfolioItem  -> UPDATE
// - deletePortfolioItem  -> DELETE
import {
  createPortfolioItem,
  deletePortfolioItem,
  fetchPortfolioItems,
  updatePortfolioItem,
} from "../services/portfolioMondayClient";


// ===== COMPONENT STATE =====
// items: the portfolio items currently shown in the list
const items = ref([]);

// isLoading: used for the READ loading screen
const isLoading = ref(false);

// isBusy: used while create/update/delete actions are running
const isBusy = ref(false);

// message and errorMessage: simple user feedback text
const message = ref("");
const errorMessage = ref("");

// editingItemId: empty string means CREATE mode
// if it has an item id, we are in UPDATE mode for that item
const editingItemId = ref("");

// This function gives us a clean, default form shape.
// We use it when the app first loads and anytime we reset the form.
const createEmptyForm = () => ({
  title: "",
  description: "",
  techStack: "",
  status: "",
  githubLink: "",
  imageUrl: "",
});

// form holds the values from the inputs in the template.
const form = reactive(createEmptyForm());

// isEditing becomes true when editingItemId has a value.
// This controls button text and whether we create or update on submit.
const isEditing = computed(() => Boolean(editingItemId.value));

// Clears success and error messages before a new action begins.
const resetMessages = () => {
  message.value = "";
  errorMessage.value = "";
};

// Resets the form back to blank values and returns to CREATE mode.
const resetForm = () => {
  Object.assign(form, createEmptyForm());
  editingItemId.value = "";
};

// ===== LESSON 1: READ =====
// loadItems gets all portfolio items from monday.com and stores them in items.
// The template then loops through items and renders one card for each item.
const loadItems = async () => {
  resetMessages();
  isLoading.value = true;
  try {
    items.value = await fetchPortfolioItems();
    message.value = "Portfolio items loaded from monday.com.";
  } catch (error) {
    errorMessage.value =
      error.message || "Could not load items from monday.com.";
  } finally {
    isLoading.value = false;
  }
};

// ===== LESSON 3: UPDATE (part 2) =====
// startEdit takes the clicked card and copies its values into the form.
// This is how the same form can switch from CREATE mode to UPDATE mode.
const startEdit = (item) => {
  resetMessages();

  // Store the item's id so we know which monday row to update later.
  editingItemId.value = item.id;

  // Copy the clicked item's values into the form fields.
  Object.assign(form, {
    title: item.title,
    description: item.description,
    techStack: item.techStack,
    status: item.status,
    githubLink: item.githubLink,
    imageUrl: item.imageUrl,
  });
  message.value = `Loaded "${item.title}" into the form for editing.`;
};

// ===== LESSON 2 + LESSON 3 =====
// handleSubmit handles BOTH create and update.
// - If we are editing, it updates the selected item
// - If we are not editing, it creates a brand-new item
const handleSubmit = async () => {
  resetMessages();
  isBusy.value = true;
  try {
    if (isEditing.value) {
      // LESSON 3: UPDATE
      await updatePortfolioItem(editingItemId.value, { ...form });
      message.value = "Portfolio item updated successfully.";
    } else {
      // LESSON 2: CREATE
      await createPortfolioItem({ ...form });
      message.value = "Portfolio item created successfully.";
    }

    // After create/update:
    // 1. clear the form
    // 2. re-read the list from monday.com so the UI shows fresh data
    resetForm();
    await loadItems();
  } catch (error) {
    errorMessage.value = error.message || "Could not save the portfolio item.";
  } finally {
    isBusy.value = false;
  }
};

// ===== LESSON 4: DELETE =====
// handleDelete removes an item only after the user confirms.
// This follows the lesson plan's safety/confirmation pattern.
const handleDelete = async (item) => {
  const userConfirmed = window.confirm(
    `Delete "${item.title}"? This removes the item from the monday.com board.`,
  );

  // If the user clicks Cancel, stop here.
  if (!userConfirmed) return;

  resetMessages();
  isBusy.value = true;

  try {
    await deletePortfolioItem(item.id);
    message.value = "Portfolio item deleted successfully.";

    // If the deleted item was currently being edited,
    // reset the form so the UI does not show old data.
    if (editingItemId.value === item.id) resetForm();

    // Re-read the list so the deleted item disappears from the UI.
    await loadItems();
  } catch (error) {
    errorMessage.value =
      error.message || "Could not delete the portfolio item.";
  } finally {
    isBusy.value = false;
  }
};

// When the component first loads on the page, start with READ.
// This matches Lesson 1: fetch data first, then render it.
onMounted(loadItems);
</script>

<style scoped>
/*
  Styles are intentionally simple.
  The lesson focus is CRUD and data flow, not advanced design. Edit it if you'd like
*/
.portfolio-manager {
  padding: 2rem;
  background: #f5f7fb;
}
.pm-header {
  max-width: 900px;
  margin: 0 auto 1.5rem;
}
.pm-header h2,
.pm-panel h3,
.pm-card h4 {
  margin-bottom: 0.5rem;
}
.pm-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.pm-panel {
  background: #fff;
  border: 1px solid #d9e0ea;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}
.pm-form {
  display: grid;
  gap: 1rem;
}
.pm-form label {
  display: grid;
  gap: 0.45rem;
}
.pm-form input,
.pm-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #c9d3e0;
  border-radius: 8px;
  font: inherit;
}
.pm-button-row,
.pm-list-header,
.pm-card-top,
.pm-card-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
}
button {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font: inherit;
  background: #1f4bb3;
  color: white;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.pm-secondary {
  background: #e8eef9;
  color: #173b89;
}
.pm-danger {
  background: #b42318;
  color: white;
}
.pm-helper-text,
.pm-status,
.pm-message,
.pm-error,
.pm-loading,
.pm-empty,
.pm-description,
.pm-details {
  margin: 0;
}
.pm-message {
  color: #0f7b3e;
  margin-bottom: 1rem;
}
.pm-error {
  color: #b42318;
  margin-bottom: 1rem;
}
.pm-card-list {
  display: grid;
  gap: 1rem;
}
.pm-card {
  border: 1px solid #d9e0ea;
  border-radius: 10px;
  padding: 1rem;
  background: #fbfcff;
}
.pm-details {
  padding-left: 1.2rem;
}
@media (max-width: 900px) {
  .pm-layout {
    grid-template-columns: 1fr;
  }
  .pm-list-header,
  .pm-card-top {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
