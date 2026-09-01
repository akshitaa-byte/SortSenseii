# SortSenseii (ソート先生)

> **Interactive Dual-Themed Algorithm Visualizer & Dynamic Multi-Lane Race Benchmarking Platform.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-sort--senseii.vercel.app-FF2994?style=for-the-badge&logo=vercel)](https://sort-senseii.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-00F0FF?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-00FF9D?style=for-the-badge)](LICENSE)

---

## 🎬 Race Mode Demo

![SortSenseii Race Mode Demo](docs/demo.gif)

*Watch 2 to 5 sorting algorithms race head-to-head on identical arrays with real-time rank placement tracking.*

---

## ✨ Features

- **Dynamic 2 to 5 Lane Race Mode**: Benchmarks up to 5 sorting algorithms side-by-side on identical array clones with real-time placement rank badges (🥇 1st Place to 5th Place).
- **Single Canvas Studio**: Deep dive into individual algorithm executions with real-time metrics and complexity breakdowns.
- **Dual Japanese Aesthetics**:
  - 🌙 **Night Mode**: Cyberpunk Tokyo Anime Night theme with glowing neon bars and starry midnight purple skies.
  - 🌸 **Day Mode**: Serene Sakura Cherry Blossom theme with glassmorphism panels over Japanese wallpaper art.
- **Full Precision Controls**: Adjustable animation speed (5ms–300ms), array size slider (5–100 elements), random array generator, and manual array input.
- **Always-Visible Bar Labels**: Number values dynamically displayed beneath every bar across all screen sizes and mobile layouts.

---

## 🧠 Implemented Algorithms

| Algorithm | Best Case | Average Case | Worst Case | Space Complexity | Stability |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | ❌ Unstable |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | ✅ Stable |
| **Heap Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | ❌ Unstable |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✅ Stable |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ❌ Unstable |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✅ Stable |

---

## 📊 Benchmarking Methodology

SortSenseii records high-precision performance metrics in real time during single and multi-lane race executions:

- **Comparisons**: Incremented every time two indices are evaluated by the algorithm (`compare` step).
- **Swaps / Writes**: Incremented whenever two elements exchange positions (`swap` step) or when a value is assigned directly (`overwrite` step during merge/copy phases).
- **Execution Time (Wall-Clock)**: Measured using the High-Resolution Time API (`performance.now()`), tracking exact elapsed milliseconds from animation start until each lane completes its sorting pass.

---

## 🏗️ Architecture & Engineering Notes

```
┌───────────────────────────────┐
│   Pure Step Generators        │
│   (sortingAlgorithms.js)      │
└──────────────┬────────────────┘
               │ Returns atomic step trace
               ▼
┌───────────────────────────────┐
│   Non-Blocking Step Engine    │
│   (App.js - setTimeout loop)  │
└──────────────┬────────────────┘
               │ Synchronized concurrent ticks
               ▼
┌───────────────────────────────┐
│   Dynamic N-Lane Renderer     │
│   (React State + Ref Sync)    │
└───────────────────────────────┘
```

- **Decoupled Step Trace Generation**: Sorting algorithms (`sortingAlgorithms.js`) do not mutate the DOM directly. Instead, they operate on array copies and return a pure, deterministic trace of atomic step objects (`compare`, `clearCompare`, `swap`, `overwrite`, `sorted`).
- **Non-Blocking Animation Loop**: Visualizer execution is driven by a scheduled `setTimeout` loop managed via React refs (`isPlayingRef`, `speedRef`, `startTimeRef`). This prevents UI main thread lockup while maintaining smooth 60fps renders.
- **Synchronized Multi-Lane Race Engine**: In Race Mode, $N$ independent lanes receive identical deep-cloned initial arrays. A unified tick function (`runRaceStep()`) steps all active lanes concurrently. Ref-backed placement tracking (`laneRanksRef`, `finishedLanesRef`) eliminates React state batching race conditions, guaranteeing finish times and 🥇–🥉 placement badges persist accurately across re-renders.

---

## 🚀 Running Locally

### Prerequisites
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher

### Installation & Launch

1. **Clone the repository**:
   ```bash
   git clone https://github.com/akshitaa-byte/SortSenseii.git
   cd SortSenseii
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
