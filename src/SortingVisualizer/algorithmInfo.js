// algorithmInfo.js

export const ALGORITHM_INFO = {
  bubbleSort: {
    name: 'Bubble Sort',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },
  selectionSort: {
    name: 'Selection Sort',
    bestTime: 'O(n²)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    description: 'Divides the array into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region.'
  },
  insertionSort: {
    name: 'Insertion Sort',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    description: 'Builds the final sorted array one item at a time by inserting each element into its correct position.'
  },
  mergeSort: {
    name: 'Merge Sort',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stability: 'Stable',
    description: 'Divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and merges the sorted halves.'
  },
  quickSort: {
    name: 'Quick Sort',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(log n)',
    stability: 'Unstable',
    description: 'Picks an element as a pivot and partitions the given array around the picked pivot.'
  },
  heapSort: {
    name: 'Heap Sort',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    description: 'Comparison-based sorting technique based on a Binary Heap data structure.'
  }
};
