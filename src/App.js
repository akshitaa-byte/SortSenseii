import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  getBubbleSortAnimations,
  getSelectionSortAnimations,
  getInsertionSortAnimations,
  getMergeSortAnimations,
  getQuickSortAnimations,
  getHeapSortAnimations,
} from "./SortingVisualizer/sortingAlgorithms";
import { ALGORITHM_INFO } from "./SortingVisualizer/algorithmInfo";

const ALL_ALGOS_LIST = [
  "quickSort",
  "mergeSort",
  "bubbleSort",
  "insertionSort",
  "heapSort",
  "selectionSort",
];

function App() {
  const [mode, setMode] = useState("single"); // 'single' | 'race'
  const [theme, setTheme] = useState("night"); // 'night' | 'day'

  // Common Controls
  const [arraySize, setArraySize] = useState(25);
  const [baseArray, setBaseArray] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [manualInputError, setManualInputError] = useState("");

  // Speed (delay ms)
  const [speed, setSpeed] = useState(50);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Single Mode State
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubbleSort");
  const [arraySingle, setArraySingle] = useState([]);
  const [comparingSingle, setComparingSingle] = useState([]);
  const [swappingSingle, setSwappingSingle] = useState([]);
  const [sortedSingle, setSortedSingle] = useState([]);
  const [comparisonsSingle, setComparisonsSingle] = useState(0);
  const [swapsSingle, setSwapsSingle] = useState(0);
  const [executionTimeSingle, setExecutionTimeSingle] = useState(0);

  // Race Mode State (Dynamic 2 to 5 Lanes)
  const [raceLaneCount, setRaceLaneCount] = useState(3);
  const [raceAlgos, setRaceAlgos] = useState([
    "quickSort",
    "mergeSort",
    "bubbleSort",
  ]);

  const createInitialLanes = (count, arr) => {
    return Array.from({ length: count }, () => ({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      comparisons: 0,
      swaps: 0,
      time: 0,
      rank: null,
    }));
  };

  const [raceLanes, setRaceLanes] = useState([]);

  // Animation Control References
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isPlayingRef = useRef(false);
  const animationTimeoutRef = useRef(null);
  const startTimeRef = useRef(0);
  const elapsedTimeRef = useRef(0);

  // Single Mode Refs
  const animationsSingleRef = useRef([]);
  const stepSingleRef = useRef(0);

  // Race Mode Refs
  const animationsRaceRef = useRef([]);
  const stepsRaceRef = useRef([]);
  const finishedLanesRef = useRef([]);
  const rankCountRef = useRef(0);
  const raceTimesRef = useRef([]);
  const laneRanksRef = useRef([]);

  // Helper algorithm animator picker
  const getAnimations = (algoKey, arr) => {
    switch (algoKey) {
      case "bubbleSort":
        return getBubbleSortAnimations(arr);
      case "selectionSort":
        return getSelectionSortAnimations(arr);
      case "insertionSort":
        return getInsertionSortAnimations(arr);
      case "mergeSort":
        return getMergeSortAnimations(arr);
      case "quickSort":
        return getQuickSortAnimations(arr);
      case "heapSort":
        return getHeapSortAnimations(arr);
      default:
        return getBubbleSortAnimations(arr);
    }
  };

  // Generate random array
  const generateRandomArray = (size = arraySize) => {
    resetAnimationState();
    const newArr = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 280) + 20);
    }
    setBaseArray(newArr);
    setArraySingle([...newArr]);
    setRaceLanes(createInitialLanes(raceLaneCount, newArr));
    setManualInput(newArr.join(", "));
    setManualInputError("");
  };

  useEffect(() => {
    generateRandomArray(arraySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSizeChange = (newSize) => {
    if (isPlaying) return;
    setArraySize(newSize);
    generateRandomArray(newSize);
  };

  const handleLaneCountChange = (newCount) => {
    if (isPlaying) return;
    setRaceLaneCount(newCount);

    let nextAlgos = [...raceAlgos];
    if (newCount > nextAlgos.length) {
      for (let i = nextAlgos.length; i < newCount; i++) {
        nextAlgos.push(ALL_ALGOS_LIST[i % ALL_ALGOS_LIST.length]);
      }
    } else {
      nextAlgos = nextAlgos.slice(0, newCount);
    }
    setRaceAlgos(nextAlgos);

    resetAnimationState();
    setRaceLanes(createInitialLanes(newCount, baseArray));
  };

  const handleManualInputApply = () => {
    if (isPlaying) return;
    setManualInputError("");
    const parsed = manualInput
      .split(/[\s,]+/)
      .map((val) => parseInt(val.trim(), 10))
      .filter((val) => !isNaN(val) && val > 0);

    if (parsed.length === 0) {
      setManualInputError("Please enter valid positive numbers separated by commas.");
      return;
    }

    const clamped = parsed.slice(0, 100);
    resetAnimationState();
    setBaseArray(clamped);
    setArraySingle([...clamped]);
    setRaceLanes(createInitialLanes(raceLaneCount, clamped));
    setArraySize(clamped.length);
  };

  const resetAnimationState = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    elapsedTimeRef.current = 0;

    // Reset Single
    setComparingSingle([]);
    setSwappingSingle([]);
    setSortedSingle([]);
    setComparisonsSingle(0);
    setSwapsSingle(0);
    setExecutionTimeSingle(0);
    stepSingleRef.current = 0;
    animationsSingleRef.current = [];

    // Reset Race
    finishedLanesRef.current = Array(raceLaneCount).fill(false);
    rankCountRef.current = 0;
    stepsRaceRef.current = Array(raceLaneCount).fill(0);
    animationsRaceRef.current = Array(raceLaneCount).fill([]);
    raceTimesRef.current = Array(raceLaneCount).fill(0);
    laneRanksRef.current = Array(raceLaneCount).fill(null);

    setRaceLanes(createInitialLanes(raceLaneCount, baseArray));
  };

  const handleReset = () => {
    resetAnimationState();
    setArraySingle([...baseArray]);
  };

  const startAnimation = () => {
    if (isPlaying) return;

    if (mode === "single") {
      startSingleAnimation();
    } else {
      startRaceAnimation();
    }
  };

  // --- SINGLE MODE ANIMATION ---
  const startSingleAnimation = () => {
    if (!isPaused) {
      const animations = getAnimations(selectedAlgorithm, arraySingle);
      animationsSingleRef.current = animations;
      stepSingleRef.current = 0;
      setComparisonsSingle(0);
      setSwapsSingle(0);
      setSortedSingle([]);
      elapsedTimeRef.current = 0;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = performance.now() - elapsedTimeRef.current;
    runSingleStep();
  };

  const runSingleStep = () => {
    if (!isPlayingRef.current) return;

    const animations = animationsSingleRef.current;
    const stepIdx = stepSingleRef.current;

    if (stepIdx >= animations.length) {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      setComparingSingle([]);
      setSwappingSingle([]);
      setSortedSingle(Array.from({ length: arraySingle.length }, (_, i) => i));
      return;
    }

    const now = performance.now();
    elapsedTimeRef.current = now - startTimeRef.current;
    setExecutionTimeSingle(Math.round(elapsedTimeRef.current));

    const step = animations[stepIdx];

    if (step.type === "compare") {
      setComparingSingle(step.indices);
      setSwappingSingle([]);
      setComparisonsSingle((prev) => prev + 1);
    } else if (step.type === "clearCompare") {
      setComparingSingle([]);
      setSwappingSingle([]);
    } else if (step.type === "swap") {
      setComparingSingle([]);
      setSwappingSingle(step.indices);
      setArraySingle([...step.arrayState]);
      setSwapsSingle((prev) => prev + 1);
    } else if (step.type === "overwrite") {
      setComparingSingle([]);
      setSwappingSingle([step.index]);
      setArraySingle((prevArr) => {
        const nextArr = [...prevArr];
        nextArr[step.index] = step.value;
        return nextArr;
      });
      setSwapsSingle((prev) => prev + 1);
    } else if (step.type === "sorted") {
      setComparingSingle([]);
      setSwappingSingle([]);
      setSortedSingle((prev) => [...new Set([...prev, step.index])]);
    }

    stepSingleRef.current += 1;
    animationTimeoutRef.current = setTimeout(runSingleStep, speedRef.current);
  };

  // --- RACE MODE ANIMATION ---
  const startRaceAnimation = () => {
    if (!isPaused) {
      animationsRaceRef.current = raceAlgos.map((algo) =>
        getAnimations(algo, baseArray)
      );
      stepsRaceRef.current = Array(raceLaneCount).fill(0);
      finishedLanesRef.current = Array(raceLaneCount).fill(false);
      rankCountRef.current = 0;
      raceTimesRef.current = Array(raceLaneCount).fill(0);
      laneRanksRef.current = Array(raceLaneCount).fill(null);
      elapsedTimeRef.current = 0;

      setRaceLanes(createInitialLanes(raceLaneCount, baseArray));
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = performance.now() - elapsedTimeRef.current;
    runRaceStep();
  };

  const runRaceStep = () => {
    if (!isPlayingRef.current) return;

    const now = performance.now();
    elapsedTimeRef.current = now - startTimeRef.current;
    const currentMs = Math.round(elapsedTimeRef.current);

    setRaceLanes((prevLanes) => {
      return prevLanes.map((lane, idx) => {
        if (finishedLanesRef.current[idx]) {
          return {
            ...lane,
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: lane.array.length }, (_, i) => i),
            rank: laneRanksRef.current[idx],
            time: raceTimesRef.current[idx],
          };
        }

        const animations = animationsRaceRef.current[idx];
        const stepIdx = stepsRaceRef.current[idx];

        if (stepIdx >= animations.length) {
          finishedLanesRef.current[idx] = true;
          rankCountRef.current += 1;
          laneRanksRef.current[idx] = rankCountRef.current;
          raceTimesRef.current[idx] = currentMs;

          return {
            ...lane,
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: lane.array.length }, (_, i) => i),
            rank: laneRanksRef.current[idx],
            time: currentMs,
          };
        }

        const step = animations[stepIdx];
        stepsRaceRef.current[idx] += 1;

        let nextComparing = lane.comparing;
        let nextSwapping = lane.swapping;
        let nextSorted = lane.sorted;
        let nextArray = lane.array;
        let nextComparisons = lane.comparisons;
        let nextSwaps = lane.swaps;

        if (step.type === "compare") {
          nextComparing = step.indices;
          nextSwapping = [];
          nextComparisons += 1;
        } else if (step.type === "clearCompare") {
          nextComparing = [];
          nextSwapping = [];
        } else if (step.type === "swap") {
          nextComparing = [];
          nextSwapping = step.indices;
          nextArray = [...step.arrayState];
          nextSwaps += 1;
        } else if (step.type === "overwrite") {
          nextComparing = [];
          nextSwapping = [step.index];
          const updated = [...lane.array];
          updated[step.index] = step.value;
          nextArray = updated;
          nextSwaps += 1;
        } else if (step.type === "sorted") {
          nextComparing = [];
          nextSwapping = [];
          nextSorted = [...new Set([...lane.sorted, step.index])];
        }

        return {
          ...lane,
          array: nextArray,
          comparing: nextComparing,
          swapping: nextSwapping,
          sorted: nextSorted,
          comparisons: nextComparisons,
          swaps: nextSwaps,
          time: currentMs,
        };
      });
    });

    if (finishedLanesRef.current.every((f) => f)) {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      return;
    }

    animationTimeoutRef.current = setTimeout(runRaceStep, speedRef.current);
  };

  const handlePause = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(true);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="rank-badge rank-1">🥇 1st Place</span>;
    if (rank === 2) return <span className="rank-badge rank-2">🥈 2nd Place</span>;
    if (rank === 3) return <span className="rank-badge rank-3">🥉 3rd Place</span>;
    if (rank === 4) return <span className="rank-badge rank-4">4th Place</span>;
    if (rank === 5) return <span className="rank-badge rank-5">5th Place</span>;
    return null;
  };

  const algorithmDetails = ALGORITHM_INFO[selectedAlgorithm] || ALGORITHM_INFO.bubbleSort;

  // Colors per theme
  const colors = theme === "night"
    ? { default: "#00D2FF", sorted: "#00FF9D", swap: "#FFD166", compare: "#FF2994" }
    : { default: "#B5838D", sorted: "#6D4C7A", swap: "#E8A598", compare: "#D64F6E" };

  return (
    <div
      className={`site-wrapper ${theme === "night" ? "anime-night-theme" : "day-editorial-theme"}`}
      style={theme === "day" ? {
        backgroundImage: `url(${process.env.PUBLIC_URL}/wallpaper.jpeg)`,
        backgroundSize: "cover",
        backgroundPosition: "center 45%",
        backgroundAttachment: "fixed",
      } : {}}
    >
      {/* Anime City Stars Overlay (Night Only) */}
      {theme === "night" && <div className="stars-overlay"></div>}

      {/* Top Navbar */}
      <nav className="top-nav">
        <div className="nav-links left-links">
          <button
            className="nav-link-btn"
            onClick={() => {
              setMode("single");
              resetAnimationState();
              const el = document.getElementById("visualizer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            VISUALIZER
          </button>
          <button
            className="nav-link-btn"
            onClick={() => {
              setMode("race");
              resetAnimationState();
              const el = document.getElementById("visualizer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            RACE MODE
          </button>
          <button
            className="nav-link-btn theme-toggle-nav-btn"
            onClick={() => setTheme(theme === "night" ? "day" : "night")}
          >
            {theme === "night" ? "DAY MODE" : "NIGHT MODE"}
          </button>
        </div>

        <div className="brand-logo-container">
          <h1 className="brand-title">
            SortSenseii {theme === "night" && <span className="kanji-sign">ソート先生</span>}
          </h1>
        </div>

        <div className="nav-links right-links-placeholder"></div>
      </nav>

      {/* Hero Banner */}
      <header className="hero-banner">
        <div className="hero-content">
          {theme === "night" ? (
            <>
              <span className="hero-tag">アルゴリズム • VISUALIZING ALGORITHMS</span>
              <h2 className="hero-heading">Visualizing Algorithms.</h2>
              <p className="hero-subtext">
                Neon-lit sorting visualizer. Daily Tokyo night rituals for algorithm enthusiasts.
              </p>
            </>
          ) : (
            <>
              <span className="hero-tag">アルゴリズム • VISUALIZING ALGORITHMS</span>
              <h2 className="hero-heading">Visualizing Algorithms.</h2>
              <p className="hero-subtext">
                Sorting algorithms visualized through the beauty of sakura season.
              </p>
            </>
          )}

          <div className="hero-buttons">
            <button
              className="neon-pill-btn"
              onClick={() => {
                setMode("race");
                resetAnimationState();
                const el = document.getElementById("visualizer");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              EXPLORE RACE MODE
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Studio Section */}
      <main id="visualizer" className="main-studio">
        {/* Mode Selector Ribbon */}
        <div className="studio-mode-selector">
          <span className="studio-label">SELECT MODE:</span>
          <div className="mode-toggle-container">
            <button
              className={`mode-btn ${mode === "single" ? "active" : ""}`}
              disabled={isPlaying}
              onClick={() => {
                setMode("single");
                resetAnimationState();
              }}
            >
              Single Visualizer
            </button>
            <button
              className={`mode-btn ${mode === "race" ? "active" : ""}`}
              disabled={isPlaying}
              onClick={() => {
                setMode("race");
                resetAnimationState();
              }}
            >
              Race Mode
            </button>
          </div>
        </div>

        <div className="main-layout">
          {/* Controls Panel */}
          <section className="panel controls-panel">
            <h3 className="section-title">Studio Controls</h3>

            {mode === "single" ? (
              <div className="control-group">
                <label htmlFor="algorithm-select">Choose Algorithm:</label>
                <select
                  id="algorithm-select"
                  value={selectedAlgorithm}
                  disabled={isPlaying}
                  onChange={(e) => {
                    setSelectedAlgorithm(e.target.value);
                    resetAnimationState();
                  }}
                >
                  <option value="bubbleSort">Bubble Sort</option>
                  <option value="selectionSort">Selection Sort</option>
                  <option value="insertionSort">Insertion Sort</option>
                  <option value="mergeSort">Merge Sort</option>
                  <option value="quickSort">Quick Sort</option>
                  <option value="heapSort">Heap Sort</option>
                </select>
              </div>
            ) : (
              <div className="race-select-group">
                <div className="control-group">
                  <label htmlFor="race-lane-count">Number of Algorithms (2-5):</label>
                  <select
                    id="race-lane-count"
                    value={raceLaneCount}
                    disabled={isPlaying}
                    onChange={(e) => handleLaneCountChange(Number(e.target.value))}
                  >
                    <option value={2}>2 Algorithms</option>
                    <option value={3}>3 Algorithms</option>
                    <option value={4}>4 Algorithms</option>
                    <option value={5}>5 Algorithms</option>
                  </select>
                </div>

                <hr className="divider" />

                {Array.from({ length: raceLaneCount }).map((_, laneIdx) => (
                  <div key={laneIdx} className="control-group">
                    <label htmlFor={`race-algo-${laneIdx}`}>Lane {laneIdx + 1} Algorithm:</label>
                    <select
                      id={`race-algo-${laneIdx}`}
                      value={raceAlgos[laneIdx] || "bubbleSort"}
                      disabled={isPlaying}
                      onChange={(e) => {
                        const next = [...raceAlgos];
                        next[laneIdx] = e.target.value;
                        setRaceAlgos(next);
                        resetAnimationState();
                      }}
                    >
                      <option value="quickSort">Quick Sort</option>
                      <option value="mergeSort">Merge Sort</option>
                      <option value="heapSort">Heap Sort</option>
                      <option value="insertionSort">Insertion Sort</option>
                      <option value="bubbleSort">Bubble Sort</option>
                      <option value="selectionSort">Selection Sort</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="control-group">
              <label>Animation Controls:</label>
              <div className="button-row">
                {!isPlaying ? (
                  <button className="btn btn-primary" onClick={startAnimation}>
                    {isPaused ? "Resume" : mode === "race" ? "Start Race" : "Start Sorting"}
                  </button>
                ) : (
                  <button className="btn btn-warning" onClick={handlePause}>
                    Pause
                  </button>
                )}
                <button className="btn btn-danger" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="speed-slider">Visualization Delay: {speed}ms</label>
              <input
                id="speed-slider"
                type="range"
                min="5"
                max="300"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <div className="speed-labels">
                <span>Fast (5ms)</span>
                <span>Slow (300ms)</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="control-group">
              <label htmlFor="array-size-slider">Array Size: {arraySize} elements</label>
              <input
                id="array-size-slider"
                type="range"
                min="5"
                max="100"
                value={arraySize}
                disabled={isPlaying}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <button
                className="btn btn-secondary"
                disabled={isPlaying}
                onClick={() => generateRandomArray(arraySize)}
              >
                Generate Random Array
              </button>
            </div>

            <div className="control-group">
              <label htmlFor="manual-input">Manually Enter Values:</label>
              <div className="input-row">
                <input
                  id="manual-input"
                  type="text"
                  value={manualInput}
                  placeholder="e.g., 20, 50, 10, 80"
                  disabled={isPlaying}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  disabled={isPlaying}
                  onClick={handleManualInputApply}
                >
                  Apply
                </button>
              </div>
              {manualInputError && <p className="error-text">{manualInputError}</p>}
            </div>

            <div className="legend">
              <span className="legend-item">
                <span className="color-box comparison-box"></span> Compare ({theme === "night" ? "Neon Pink" : "Red"})
              </span>
              <span className="legend-item">
                <span className="color-box swap-box"></span> Swap ({theme === "night" ? "Amber Gold" : "Orange"})
              </span>
              <span className="legend-item">
                <span className="color-box sorted-box"></span> Sorted (Sage Green)
              </span>
            </div>
          </section>

          {/* Center Display: Single Mode or Race Mode */}
          {mode === "single" ? (
            <div className="center-panel">
              {/* Visualization Area */}
              <section className="panel visualizer-section">
                <div className="visualizer-header">
                  <h3>{algorithmDetails.name} Canvas</h3>
                  <button
                    className="canvas-badge theme-toggle-badge"
                    onClick={() => setTheme(theme === "night" ? "day" : "night")}
                  >
                    {theme === "night" ? "🌙 NIGHT MODE" : "☀️ DAY MODE"}
                  </button>
                </div>
                <div className="bars-container">
                  {arraySingle.map((value, index) => {
                    let barColor = colors.default;
                    if (sortedSingle.includes(index)) {
                      barColor = colors.sorted;
                    } else if (swappingSingle.includes(index)) {
                      barColor = colors.swap;
                    } else if (comparingSingle.includes(index)) {
                      barColor = colors.compare;
                    }

                    return (
                      <div key={index} className="bar-wrapper">
                        <div
                          className="array-bar"
                          style={{
                            height: `${value}px`,
                            backgroundColor: barColor,
                            boxShadow: theme === "night" ? `0 0 10px ${barColor}88` : "none",
                          }}
                        ></div>
                        <span className="bar-label">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Metrics & Algorithm Info Grid */}
              <div id="metrics" className="info-grid">
                {/* Performance Metrics */}
                <section className="panel metrics-panel">
                  <h3>Performance Metrics</h3>
                  <div className="metric-item">
                    <span>Comparisons:</span>
                    <strong>{comparisonsSingle}</strong>
                  </div>
                  <div className="metric-item">
                    <span>Swaps / Writes:</span>
                    <strong>{swapsSingle}</strong>
                  </div>
                  <div className="metric-item">
                    <span>Execution Time:</span>
                    <strong>{executionTimeSingle} ms</strong>
                  </div>
                </section>

                {/* Algorithm Info */}
                <section id="algorithms" className="panel info-panel">
                  <h3>{algorithmDetails.name} Info</h3>
                  <p>{algorithmDetails.description}</p>
                  <div className="complexity-grid">
                    <div>
                      <span>Best Case:</span> <strong>{algorithmDetails.bestTime}</strong>
                    </div>
                    <div>
                      <span>Average:</span> <strong>{algorithmDetails.avgTime}</strong>
                    </div>
                    <div>
                      <span>Worst Case:</span> <strong>{algorithmDetails.worstTime}</strong>
                    </div>
                    <div>
                      <span>Space:</span> <strong>{algorithmDetails.spaceComplexity}</strong>
                    </div>
                    <div>
                      <span>Stability:</span> <strong>{algorithmDetails.stability}</strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* DYNAMIC RACE MODE LAYOUT (2 to 5 LANES) */
            <div id="race-mode" className="center-panel race-center-panel">
              <div className="race-lanes-grid">
                {raceAlgos.map((algoKey, laneIdx) => {
                  const lane = raceLanes[laneIdx] || {
                    array: baseArray,
                    comparing: [],
                    swapping: [],
                    sorted: [],
                    comparisons: 0,
                    swaps: 0,
                    time: 0,
                    rank: null,
                  };
                  const info = ALGORITHM_INFO[algoKey] || ALGORITHM_INFO.bubbleSort;

                  return (
                    <div key={laneIdx} className="panel race-lane-card">
                      <div className="race-lane-header">
                        <h3>
                          Lane {laneIdx + 1}: {info.name}
                        </h3>
                        {getRankBadge(lane.rank)}
                      </div>

                      <div className="bars-container race-bars-container">
                        {lane.array.map((value, index) => {
                          let barColor = colors.default;
                          if (lane.sorted.includes(index)) {
                            barColor = colors.sorted;
                          } else if (lane.swapping.includes(index)) {
                            barColor = colors.swap;
                          } else if (lane.comparing.includes(index)) {
                            barColor = colors.compare;
                          }

                          return (
                            <div key={index} className="bar-wrapper">
                              <div
                                className="array-bar"
                                style={{
                                  height: `${Math.round(value * 0.7)}px`,
                                  backgroundColor: barColor,
                                  boxShadow: theme === "night" ? `0 0 8px ${barColor}88` : "none",
                                }}
                              ></div>
                              <span className="bar-label">{value}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="metrics-panel race-metrics">
                        <div className="metric-item">
                          <span>Comparisons:</span>
                          <strong>{lane.comparisons}</strong>
                        </div>
                        <div className="metric-item">
                          <span>Swaps / Writes:</span>
                          <strong>{lane.swaps}</strong>
                        </div>
                        <div className="metric-item">
                          <span>Execution Time:</span>
                          <strong>{lane.time} ms</strong>
                        </div>
                        <div className="metric-item">
                          <span>Complexity:</span>
                          <strong>Avg {info.avgTime} | Space {info.spaceComplexity}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;