export interface DiffOp {
  t: 'eq' | 'rm' | 'add';
  a?: string;
  b?: string;
  ai?: number;
  bi?: number;
}

export function diffLines(a: string, b: string): DiffOp[] {
  const A = a.split('\n');
  const B = b.split('\n');
  const m = A.length, n = B.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) { ops.push({ t: 'eq', a: A[i], b: B[j], ai: i, bi: j }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: 'rm', a: A[i], ai: i }); i++; }
    else { ops.push({ t: 'add', b: B[j], bi: j }); j++; }
  }
  while (i < m) { ops.push({ t: 'rm', a: A[i], ai: i }); i++; }
  while (j < n) { ops.push({ t: 'add', b: B[j], bi: j }); j++; }
  return ops;
}
