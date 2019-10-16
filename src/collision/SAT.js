let SAT = {};

SAT.detectCollide = (shapeA, shapeB) => {
  return !SAT.separationOnAxes(shapeA, shapeB);
}

SAT.separationOnAxes = (shapeA, shapeB) => {
  let axes = shapeA.getAxes().concat(shapeB.getAxes());

  for (let i = 0; i < axes.length; i++) {
    let axis = axes[i];
    let projection1 = shapeA.project(axis);
    let projection2 = shapeB.project(axis);
    if (!projection1.overlaps(projection2)) {
      return true;
    }
  }
  return false;
}

export default SAT
