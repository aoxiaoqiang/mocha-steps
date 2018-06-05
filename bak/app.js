function fibNumber(n) {
  if (n == 1) return 0;
  if (n == 2) return 1;
  return fibNumber(n - 1) + fibNumber(n - 2);
}

module.exports = fibNumber;