<template>
  <section class="section contact-section" id="contact">
    <div class="section-label">Contact</div>
    <h2 class="section-title">Get In Touch</h2>
    <p class="section-body">
      Have a project in mind or just want to say hello? Fill out the form and
      I'll get back to you.
    </p>

    <!-- Series 5: @submit.prevent wires the form to our handler -->
    <form class="form-grid" @submit.prevent="handleSubmit">

      <!-- Series 3: v-model on text inputs -->
      <div class="form-group">
        <label for="name">Your Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="John Smith"
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="john@example.com"
        />
      </div>

      <!-- Series 4: v-model on select dropdowns -->
      <div class="form-group">
        <label for="subject">Subject</label>
        <select id="subject" v-model="form.subject">
          <option value="">Select a subject...</option>
          <option value="freelance">Freelance Project</option>
          <option value="fulltime">Full-time Opportunity</option>
          <option value="collab">Collaboration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="budget">Budget Range</label>
        <select id="budget" v-model="form.budget">
          <option value="">Select budget...</option>
          <option value="small">Under $1,000</option>
          <option value="mid">$1,000 – $5,000</option>
          <option value="large">$5,000+</option>
        </select>
      </div>

      <!-- Series 3: v-model on textarea -->
      <div class="form-group full">
        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          placeholder="Tell me about your project..."
        ></textarea>
      </div>

      <!-- Series 5: v-if for error message -->
      <div v-if="showError" class="error-msg full">
        ⚠ Please fill in your name, email, and message before submitting.
      </div>

      <!-- Series 5: Submit button + success feedback with v-if -->
      <div class="submit-wrap full">
        <button type="submit" class="btn-submit">Send Message</button>
        <div v-if="showSuccess" class="success-msg">
          <div class="success-icon">✓</div>
          Message sent! I'll be in touch soon.
        </div>
      </div>

    </form>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Series 3: reactive form object — v-model binds to these
const form = reactive({
  name: '',
  email: '',
  subject: '',
  budget: '',
  message: ''
})

// Series 5: control visibility of error/success messages
const showError   = ref(false)
const showSuccess = ref(false)

// Series 5: form validation + submission handler
function handleSubmit() {
  // Reset states
  showError.value   = false
  showSuccess.value = false

  // Validate required fields
  if (!form.name || !form.email || !form.message) {
    showError.value = true
    return
  }

  // Success — show message and reset form
  showSuccess.value = true
  form.name    = ''
  form.email   = ''
  form.subject = ''
  form.budget  = ''
  form.message = ''
}
</script>

<style scoped>
.section {
  min-height: 100vh;
  padding: 5rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-section {
  background: var(--dark);
}

.section-label {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.8rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-body {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  max-width: 580px;
  font-weight: 300;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 2.5rem;
  max-width: 640px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
}

input,
select,
textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
  background: rgba(200, 169, 110, 0.06);
}

select option {
  background: var(--dark);
  color: white;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-wrap {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-submit {
  padding: 0.9rem 2.5rem;
  background: var(--accent);
  color: var(--dark);
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(200, 169, 110, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

.success-msg {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #6fcf97;
  font-size: 0.88rem;
  font-weight: 500;
  animation: fadeUp 0.4s ease forwards;
}

.success-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6fcf97;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.error-msg {
  color: #eb5757;
  font-size: 0.82rem;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
