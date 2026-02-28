<template>
  <section class="section" id="projects">
    <div class="section-label">Work</div>
    <h2 class="section-title">Projects</h2>
    <p class="section-body">A selection of things I've built — from side projects to client work.</p>

    <!-- Series 2: v-for on project cards -->
    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-thumb">{{ project.icon }}</div>
        <div class="project-info">
          <div class="project-title">{{ project.title }}</div>
          <div class="project-desc">{{ project.desc }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Series 2: Dynamic list with v-for + props data
const projects = [
  {
    id: 1,
    icon: '①',
    title: 'Portfolio v2',
    desc: 'Personal portfolio built with Vue 3 and Vite. Fully responsive with smooth animations.'
  },
  {
    id: 2,
    icon: '②',
    title: 'Task Manager',
    desc: 'A clean to-do app with categories, priorities, and local storage persistence.'
  },
  {
    id: 3,
    icon: '③',
    title: 'Weather Dashboard',
    desc: 'Real-time weather data visualized with charts and location-based search.'
  }
]
</script>

<style scoped>
.section {
  min-height: 100vh;
  padding: 5rem 4rem;
  background: #eee8dc;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  color: var(--dark);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-body {
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.8;
  max-width: 580px;
  font-weight: 300;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(200, 169, 110, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(26, 24, 20, 0.12);
}

.project-thumb {
  height: 160px;
  background: linear-gradient(135deg, var(--dark), #3a3530);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--accent);
}

.project-info {
  padding: 1.2rem;
}

.project-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--dark);
  margin-bottom: 0.4rem;
}

.project-desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.6;
}
</style>
