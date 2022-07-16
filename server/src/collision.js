//npm i detect-collisions

import { System, Circle, Polygon } from "detect-collisions";
const system = new System();

const circle = new Circle({ x: x, y: y }, 10);
const polygon = new Polygon({ x: 40, y: 40 }, [
  { x: 0, y: 0 },
  { x: 20, y: 20 },
  { x: -10, y: 10 },
]);

circle.draw(ctx);
polygon.setAngle(count);
count += 0.1;

if (system.checkCollision(circle, polygon)) {
  const response = system.response;
  console.log(response);
}
