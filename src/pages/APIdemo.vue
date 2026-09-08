<script setup>
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'

const pathRef = ref(null)

const activePath = ref('wave')
const position = ref(35)
const strokeWidth = ref(4)
const speed = ref(20)

const pathLength = ref(0)
const pointX = ref(0)
const pointY = ref(0)

const playing = ref(false)

let frameId = null
let lastTime = 0

const paths = {
  wave: {
    name: 'Wave',
    d: 'M 60 160 C 150 40 250 280 350 160 S 550 40 640 160'
  },

  loop: {
    name: 'Loop',
    d: 'M 100 160 C 100 50 260 50 350 160 C 440 270 600 270 600 160 C 600 50 440 50 350 160 C 260 270 100 270 100 160'
  },

  arc: {
    name: 'Arc',
    d: 'M 70 240 C 180 40 520 40 630 240'
  },

  zigzag: {
    name: 'Zigzag',
    d: 'M 60 220 L 180 80 L 290 220 L 410 80 L 520 220 L 640 80'
  }
}

const currentPath = computed(() => {
  return paths[activePath.value]
})

const dashOffset = computed(() => {
  return pathLength.value -
    pathLength.value * (position.value / 100)
})

function updatePoint() {
  const path = pathRef.value

  if (!path) return

  const length = path.getTotalLength()

  pathLength.value = length

  const distance =
    length * (position.value / 100)

  const point =
    path.getPointAtLength(distance)

  pointX.value = point.x
  pointY.value = point.y
}

function selectPath(name) {
  activePath.value = name
}

function animate(time) {
  if (!playing.value) return

  if (!lastTime) {
    lastTime = time
  }

  const delta =
    (time - lastTime) / 1000

  lastTime = time

  position.value =
    (position.value + delta * speed.value) % 100

  frameId =
    requestAnimationFrame(animate)
}

function toggleAnimation() {
  playing.value = !playing.value

  if (playing.value) {
    lastTime = 0

    frameId =
      requestAnimationFrame(animate)
  } else {
    cancelAnimationFrame(frameId)
  }
}

function reset() {
  playing.value = false

  cancelAnimationFrame(frameId)

  position.value = 35
  strokeWidth.value = 4
  speed.value = 20
  activePath.value = 'wave'
}

watch(position, () => {
  updatePoint()
})

watch(activePath, async () => {
  await nextTick()
  updatePoint()
})

onMounted(() => {
  updatePoint()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
})
</script>

<template>
  <div class="svg-demo">

    <div class="header">
      <div>
        <span class="eyebrow">
          SVG API
        </span>

        <h2>Path Explorer</h2>

        <p>
          Explore points and distances
          along SVG paths.
        </p>
      </div>

      <button
        class="reset"
        type="button"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <div class="shape-buttons">
      <button
        v-for="(path, key) in paths"
        :key="key"
        type="button"
        :class="[
          'shape-button',
          {
            active:
              activePath === key
          }
        ]"
        @click="selectPath(key)"
      >
        {{ path.name }}
      </button>
    </div>

    <div class="canvas">
      <svg
        viewBox="0 0 700 320"
        class="svg"
      >
        <path
          :d="currentPath.d"
          class="path-background"
          fill="none"
          :stroke-width="strokeWidth"
        />

        <path
          ref="pathRef"
          :d="currentPath.d"
          class="path-progress"
          fill="none"
          :stroke-width="strokeWidth"
          :stroke-dasharray="
            `${pathLength} ${pathLength}`
          "
          :stroke-dashoffset="dashOffset"
        />

        <circle
          :cx="pointX"
          :cy="pointY"
          r="13"
          class="point-ring"
        />

        <circle
          :cx="pointX"
          :cy="pointY"
          r="5"
          class="point"
        />
      </svg>
    </div>

    <div class="controls">

      <div class="control">
        <div class="control-header">
          <label>
            Position
          </label>

          <span>
            {{ Math.round(position) }}%
          </span>
        </div>

        <input
          v-model.number="position"
          type="range"
          min="0"
          max="100"
          step="0.1"
        >
      </div>

      <div class="control">
        <div class="control-header">
          <label>
            Stroke width
          </label>

          <span>
            {{ strokeWidth }}px
          </span>
        </div>

        <input
          v-model.number="strokeWidth"
          type="range"
          min="1"
          max="12"
          step="1"
        >
      </div>

      <div class="control">
        <div class="control-header">
          <label>
            Animation speed
          </label>

          <span>
            {{ speed }}
          </span>
        </div>

        <input
          v-model.number="speed"
          type="range"
          min="5"
          max="60"
          step="1"
        >
      </div>

    </div>

    <div class="actions">
      <button
        type="button"
        class="play"
        @click="toggleAnimation"
      >
        {{
          playing
            ? 'Pause animation'
            : 'Start animation'
        }}
      </button>
    </div>

    <div class="stats">
      <div class="stat">
        <span>Path length</span>

        <strong>
          {{ pathLength.toFixed(1) }}
        </strong>
      </div>

      <div class="stat">
        <span>Point X</span>

        <strong>
          {{ pointX.toFixed(1) }}
        </strong>
      </div>

      <div class="stat">
        <span>Point Y</span>

        <strong>
          {{ pointY.toFixed(1) }}
        </strong>
      </div>
    </div>

  </div>
</template>

<style scoped>
.svg-demo {
  width: min(100%, 720px);
  background: transparent;
  color: #ffffff;

  font-family:
    Arial,
    Helvetica,
    sans-serif;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;
}

.eyebrow {
  display: block;

  margin-bottom: 6px;

  color: rgba(255, 255, 255, 0.55);

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.12em;
}

.header h2 {
  margin: 0 0 6px;

  color: #ffffff;

  font-size: 26px;
  font-weight: 600;

  letter-spacing: -0.5px;
}

.header p {
  margin: 0;

  color: rgba(255, 255, 255, 0.6);

  font-size: 14px;
}

.reset {
  padding: 9px 14px;

  border:
    1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 7px;

  background: transparent;

  color: #ffffff;

  font: inherit;
  font-size: 13px;

  cursor: pointer;
}

.reset:hover {
  border-color: #ffffff;
}

.shape-buttons {
  display: flex;
  flex-wrap: wrap;

  gap: 8px;

  margin-bottom: 14px;
}

.shape-button {
  padding: 9px 15px;

  border:
    1px solid
    rgba(255, 255, 255, 0.3);

  border-radius: 7px;

  background: transparent;

  color: #ffffff;

  font: inherit;
  font-size: 13px;

  cursor: pointer;
}

.shape-button:hover {
  border-color: #ffffff;
}

.shape-button.active {
  border-color: #ffffff;

  background: #ffffff;

  color: #111111;
}

.canvas {
  width: 100%;
  overflow: hidden;

  border:
    1px solid
    rgba(255, 255, 255, 0.25);

  border-radius: 10px;

  background: transparent;
}

.svg {
  display: block;

  width: 100%;
  height: auto;
}

.path-background {
  stroke: #ffffff;

  opacity: 0.15;

  stroke-linecap: round;
  stroke-linejoin: round;
}

.path-progress {
  stroke: #ffffff;

  stroke-linecap: round;
  stroke-linejoin: round;

  transition:
    stroke-width 0.15s ease;
}

.point-ring {
  fill: transparent;

  stroke: #ffffff;

  stroke-width: 2;

  opacity: 0.4;
}

.point {
  fill: #ffffff;
}

.controls {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 24px;

  margin-top: 24px;
}

.control-header {
  display: flex;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 10px;

  font-size: 13px;
}

.control-header label {
  color:
    rgba(255, 255, 255, 0.7);
}

.control-header span {
  color: #ffffff;

  font-variant-numeric:
    tabular-nums;
}

.control input {
  width: 100%;

  accent-color: #ffffff;

  cursor: pointer;
}

.actions {
  margin-top: 24px;
}

.play {
  width: 100%;

  padding: 12px 16px;

  border: 1px solid #ffffff;
  border-radius: 7px;

  background: #ffffff;

  color: #111111;

  font: inherit;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.play:hover {
  background: #e9e9e9;
}

.stats {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  margin-top: 24px;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.2);

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.2);
}

.stat {
  padding: 16px 0;
}

.stat + .stat {
  padding-left: 20px;

  border-left:
    1px solid
    rgba(255, 255, 255, 0.2);
}

.stat span {
  display: block;

  margin-bottom: 5px;

  color:
    rgba(255, 255, 255, 0.5);

  font-size: 11px;
}

.stat strong {
  color: #ffffff;

  font-size: 16px;
  font-weight: 500;

  font-variant-numeric:
    tabular-nums;
}

@media (max-width: 650px) {
  .controls {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .stat + .stat {
    padding-left: 0;

    border-left: 0;

    border-top:
      1px solid
      rgba(255, 255, 255, 0.2);
  }
}
</style>