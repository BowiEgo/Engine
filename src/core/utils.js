export function addPos(posA, posB) {
  return {
    x: posA.x + posB.x,
    y: posA.y + posB.y,
  };
}

export function subPos(posA, posB) {
  return {
    x: posA.x - posB.x,
    y: posA.y - posB.y,
  };
}
