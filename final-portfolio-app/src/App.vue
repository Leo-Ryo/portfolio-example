<template>
  <div class="app">

    <!-- Series 2: SidePanel component with props + event -->
    <SidePanel
      :activeSection="activeSection"
      @navigate="handleNavigate"
    />

    <!-- Main scrollable area -->
    <main class="main" ref="mainEl" @scroll="handleScroll">

      <!-- Series 1: Hero layout -->
      <HeroSection />

      <!-- Series 2: Navigation targets -->
      <AboutSection />
      <ProjectsSection />

      <!-- Series 3, 4, 5: Form -->
      <ContactForm />

      <PortfolioManager/>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Importing all components (one per series concept)
import SidePanel       from './components/SidePanel.vue'
import HeroSection     from './components/HeroSection.vue'
import AboutSection    from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactForm     from './components/ContactForm.vue'
import PortfolioManager from '../../portfolio/src/components/PortfolioManager.vue'

// Series 2: Track which section is currently active for nav highlight
const activeSection = ref('hero')
const mainEl        = ref(null)

// Series 2: Scroll spy — updates activeSection as user scrolls
function handleScroll() {
  const sections = mainEl.value.querySelectorAll('section[id]')
  sections.forEach(sec => {
    if (mainEl.value.scrollTop >= sec.offsetTop - 200) {
      activeSection.value = sec.getAttribute('id')
    }
  })
}

// Series 2: Smooth scroll to section when nav item is clicked
function handleNavigate(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.app {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main {
  margin-left: var(--panel-width);
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  width: calc(100% - var(--panel-width));
}

/* Subtle scrollbar styling */
.main::-webkit-scrollbar        { width: 4px; }
.main::-webkit-scrollbar-track  { background: transparent; }
.main::-webkit-scrollbar-thumb  { background: var(--accent); border-radius: 4px; }
</style>
