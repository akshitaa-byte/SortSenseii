// sortingAlgorithms.js

export function getBubbleSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  const n = auxiliaryArray.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step (Red)
      animations.push({ type: 'compare', indices: [j, j + 1] });

      if (auxiliaryArray[j] > auxiliaryArray[j + 1]) {
        // Swap step (Orange/Yellow)
        animations.push({
          type: 'swap',
          indices: [j, j + 1],
          arrayState: [...auxiliaryArray]
        });

        const temp = auxiliaryArray[j];
        auxiliaryArray[j] = auxiliaryArray[j + 1];
        auxiliaryArray[j + 1] = temp;

        animations.push({
          type: 'swap',
          indices: [j, j + 1],
          arrayState: [...auxiliaryArray]
        });
      }

      animations.push({ type: 'clearCompare', indices: [j, j + 1] });
    }
    // Mark element as sorted (Green)
    animations.push({ type: 'sorted', index: n - 1 - i });
  }
  animations.push({ type: 'sorted', index: 0 });
  return animations;
}

export function getSelectionSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  const n = auxiliaryArray.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: 'compare', indices: [minIdx, j] });
      if (auxiliaryArray[j] < auxiliaryArray[minIdx]) {
        minIdx = j;
      }
      animations.push({ type: 'clearCompare', indices: [minIdx, j] });
    }

    if (minIdx !== i) {
      animations.push({
        type: 'swap',
        indices: [i, minIdx],
        arrayState: [...auxiliaryArray]
      });

      const temp = auxiliaryArray[i];
      auxiliaryArray[i] = auxiliaryArray[minIdx];
      auxiliaryArray[minIdx] = temp;

      animations.push({
        type: 'swap',
        indices: [i, minIdx],
        arrayState: [...auxiliaryArray]
      });
    }
    animations.push({ type: 'sorted', index: i });
  }
  return animations;
}

export function getInsertionSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  const n = auxiliaryArray.length;

  animations.push({ type: 'sorted', index: 0 });

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      animations.push({ type: 'compare', indices: [j - 1, j] });

      if (auxiliaryArray[j] < auxiliaryArray[j - 1]) {
        animations.push({
          type: 'swap',
          indices: [j - 1, j],
          arrayState: [...auxiliaryArray]
        });

        const temp = auxiliaryArray[j];
        auxiliaryArray[j] = auxiliaryArray[j - 1];
        auxiliaryArray[j - 1] = temp;

        animations.push({
          type: 'swap',
          indices: [j - 1, j],
          arrayState: [...auxiliaryArray]
        });

        animations.push({ type: 'clearCompare', indices: [j - 1, j] });
        j--;
      } else {
        animations.push({ type: 'clearCompare', indices: [j - 1, j] });
        break;
      }
    }

    for (let k = 0; k <= i; k++) {
      animations.push({ type: 'sorted', index: k });
    }
  }

  return animations;
}

export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  const mainArray = array.slice();
  mergeSortHelper(mainArray, 0, mainArray.length - 1, auxiliaryArray, animations);

  // Mark all elements as sorted at the end
  for (let i = 0; i < mainArray.length; i++) {
    animations.push({ type: 'sorted', index: i });
  }
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;

  while (i <= middleIdx && j <= endIdx) {
    animations.push({ type: 'compare', indices: [i, j] });
    animations.push({ type: 'clearCompare', indices: [i, j] });

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[i],
        arrayState: mainArray.slice()
      });
      mainArray[k++] = auxiliaryArray[i++];
      animations.push({
        type: 'overwrite',
        index: k - 1,
        value: mainArray[k - 1],
        arrayState: mainArray.slice()
      });
    } else {
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[j],
        arrayState: mainArray.slice()
      });
      mainArray[k++] = auxiliaryArray[j++];
      animations.push({
        type: 'overwrite',
        index: k - 1,
        value: mainArray[k - 1],
        arrayState: mainArray.slice()
      });
    }
  }

  while (i <= middleIdx) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'clearCompare', indices: [i, i] });
    animations.push({
      type: 'overwrite',
      index: k,
      value: auxiliaryArray[i],
      arrayState: mainArray.slice()
    });
    mainArray[k++] = auxiliaryArray[i++];
    animations.push({
      type: 'overwrite',
      index: k - 1,
      value: mainArray[k - 1],
      arrayState: mainArray.slice()
    });
  }

  while (j <= endIdx) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'clearCompare', indices: [j, j] });
    animations.push({
      type: 'overwrite',
      index: k,
      value: auxiliaryArray[j],
      arrayState: mainArray.slice()
    });
    mainArray[k++] = auxiliaryArray[j++];
    animations.push({
      type: 'overwrite',
      index: k - 1,
      value: mainArray[k - 1],
      arrayState: mainArray.slice()
    });
  }
}

export function getQuickSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1, animations);
  for (let i = 0; i < auxiliaryArray.length; i++) {
    animations.push({ type: 'sorted', index: i });
  }
  return animations;
}

function quickSortHelper(arr, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) {
    if (startIdx >= 0 && startIdx < arr.length) {
      animations.push({ type: 'sorted', index: startIdx });
    }
    return;
  }

  const pivotIdx = partition(arr, startIdx, endIdx, animations);
  animations.push({ type: 'sorted', index: pivotIdx });
  quickSortHelper(arr, startIdx, pivotIdx - 1, animations);
  quickSortHelper(arr, pivotIdx + 1, endIdx, animations);
}

function partition(arr, startIdx, endIdx, animations) {
  const pivotValue = arr[endIdx];
  let i = startIdx - 1;

  for (let j = startIdx; j < endIdx; j++) {
    animations.push({ type: 'compare', indices: [j, endIdx] });
    if (arr[j] < pivotValue) {
      i++;
      if (i !== j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        animations.push({
          type: 'swap',
          indices: [i, j],
          arrayState: [...arr]
        });
      }
    }
    animations.push({ type: 'clearCompare', indices: [j, endIdx] });
  }

  if (i + 1 !== endIdx) {
    const temp = arr[i + 1];
    arr[i + 1] = arr[endIdx];
    arr[endIdx] = temp;

    animations.push({
      type: 'swap',
      indices: [i + 1, endIdx],
      arrayState: [...arr]
    });
  }
  animations.push({ type: 'clearCompare', indices: [i + 1, endIdx] });

  return i + 1;
}

export function getHeapSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  const n = auxiliaryArray.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(auxiliaryArray, n, i, animations);
  }

  for (let i = n - 1; i > 0; i--) {
    animations.push({
      type: 'swap',
      indices: [0, i],
      arrayState: [...auxiliaryArray]
    });
    const temp = auxiliaryArray[0];
    auxiliaryArray[0] = auxiliaryArray[i];
    auxiliaryArray[i] = temp;
    animations.push({
      type: 'swap',
      indices: [0, i],
      arrayState: [...auxiliaryArray]
    });

    animations.push({ type: 'sorted', index: i });
    heapify(auxiliaryArray, i, 0, animations);
  }
  animations.push({ type: 'sorted', index: 0 });
  return animations;
}

function heapify(arr, n, i, animations) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    animations.push({ type: 'compare', indices: [left, largest] });
    if (arr[left] > arr[largest]) {
      largest = left;
    }
    animations.push({ type: 'clearCompare', indices: [left, largest] });
  }

  if (right < n) {
    animations.push({ type: 'compare', indices: [right, largest] });
    if (arr[right] > arr[largest]) {
      largest = right;
    }
    animations.push({ type: 'clearCompare', indices: [right, largest] });
  }

  if (largest !== i) {
    animations.push({
      type: 'swap',
      indices: [i, largest],
      arrayState: [...arr]
    });
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    animations.push({
      type: 'swap',
      indices: [i, largest],
      arrayState: [...arr]
    });

    heapify(arr, n, largest, animations);
  }
}
