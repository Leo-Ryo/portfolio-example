<template>
  <aside class="side-panel">
    <div class="panel-logo">John Doe</div>
    <div class="panel-tagline">Frontend Developer</div>

    <div class="nav-label">Navigate</div>

    <!-- Series 2: v-for to render nav items dynamically -->
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.id" class="nav-item">
        <a
          :href="item.href"
          :class="{ active: activeSection === item.id }"
          @click="$emit('navigate', item.id)"
        >
          <span class="dot"></span>
          {{ item.label }}
        </a>
      </li>
    </ul>

    <div class="panel-footer">
      Built with Vue + Vite<br />
      © 2025 John Doe
    </div>
  </aside>
</template>

<script setup>
// Series 2: Props — data passed in from the parent (App.vue)
defineProps({
  activeSection: {
    type: String,
    default: 'hero'
  }
})

// Series 2: Emit — tells parent when user clicks a nav item
defineEmits(['navigate'])

// Series 2: v-for data source
const navItems = [
  { id: 'hero',     label: 'Home',     href: '#hero' },
  { id: 'about',    label: 'About',    href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact',  label: 'Contact',  href: '#contact' },
]
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--panel-width);
  height: 100vh;
  background: var(--dark);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 1.8rem;
  z-index: 100;
  border-right: 1px solid rgba(200, 169, 110, 0.15);
}

.panel-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--accent);
  letter-spacing: 0.02em;
  margin-bottom: 0.4rem;
}

.panel-tagline {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

.nav-label {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 1rem;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.nav-item a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  color: #c4bdb5;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item a:hover,
.nav-item a.active {
  background: rgba(200, 169, 110, 0.12);
  color: var(--accent);
}

.nav-item a .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  transition: background 0.2s;
  flex-shrink: 0;
}

.nav-item a:hover .dot,
.nav-item a.active .dot {
  background: var(--accent);
}

.panel-footer {
  margin-top: auto;
  font-size: 0.72rem;
  color: var(--muted);
  line-height: 1.6;
}
</style>
