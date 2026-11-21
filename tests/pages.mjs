export function pageURL(file) {
  return new URL(`../${file}`, import.meta.url).href;
}

export const exercises = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return number === 7 ? "Task7.html" : `task${number}.html`;
});
