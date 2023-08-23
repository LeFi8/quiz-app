export function shuffleArray<T>(array: T[]): T[] {
  let currentIndex: number = array.length;

  while (currentIndex != 0) {
    const randomIndex: number = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
