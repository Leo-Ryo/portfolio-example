<template>
  <section class="section" id="about">
    <div class="section-label">About</div>
    <h2 class="section-title">About Me</h2>
    <p class="section-body">
      I'm a frontend developer passionate about building clean, accessible, and
      performant web experiences. I specialize in Vue.js and love turning design
      ideas into real, working interfaces that people enjoy using.
    </p>

    <!-- Series 2: v-for to render skills dynamically -->
    <div class="skills-grid">
      <div
        v-for="skill in skills"
        :key="skill"
        class="skill-tag"
      >
        {{ skill }}
      </div>
    </div>
  </section>
</template>

<script setup>
// Series 2: Dynamic list rendered with v-for
const skills = [
  'Vue 3', 'Vite', 'JavaScript', 'CSS / SCSS',
  'Figma', 'Git', 'REST APIs', 'Node.js'
]
</script>

<style scoped>
.section {
  min-height: 100vh;
  padding: 5rem 4rem;
  background: var(--cream);
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 2.5rem;
  max-width: 620px;
}

.skill-tag {
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--dark);
  text-align: center;
  font-weight: 500;
  transition: all 0.2s;
}

.skill-tag:hover {
  border-color: var(--accent);
  background: var(--accent-light);
}
</style>
