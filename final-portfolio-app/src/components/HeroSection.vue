<template>
  <!-- Series 1: Full-screen hero with background image + overlay -->
  <section class="hero" id="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-eyebrow">Welcome to my portfolio</div>
      <h1 class="hero-name">John Doe</h1>
      <p class="hero-sub">Frontend Developer · Vue Enthusiast · Problem Solver</p>
    </div>
    <div class="scroll-hint">
      <div class="scroll-line"></div>
      Scroll
    </div>
  </section>
</template>

<script setup>
// Series 1: No logic needed here yet — pure layout and styling
</script>

<style scoped>
.hero {
  width: 100%;
  height: 100vh;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(26,24,20,0.82) 0%, rgba(26,24,20,0.55) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.2rem;
  opacity: 0;
  animation: fadeUp 0.8s ease 0.2s forwards;
}

.hero-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.2rem;
  opacity: 0;
  animation: fadeUp 0.8s ease 0.4s forwards;
}

.hero-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 300;
  letter-spacing: 0.05em;
  opacity: 0;
  animation: fadeUp 0.8s ease 0.6s forwards;
}

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeUp 0.8s ease 1s forwards;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: scrollPulse 2s ease infinite;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
</style>
