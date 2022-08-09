import React, { useEffect, useState } from "react";
import { System, Circle, Polygon, Box } from "detect-collisions";

let posX = 90;
let posY = 90;

function App() {
  const system = new System();
  const box = new Box({ x: 50, y: 50 }, 5, 5);
  const polygon = new Polygon({ x: 100, y: 100 }, [
    { x: 20, y: -10 },
    { x: 30, y: -10 },
    { x: 50, y: -30 },
    { x: 70, y: -10 },
    { x: 70, y: 10 },
    { x: 50, y: 30 },
    { x: 50, y: 30 },
    { x: 30, y: 10 },
    { x: 20, y: 10 },
    { x: 0, y: 0 },
  ]);

  system.insert(polygon);
  system.insert(box);
  //system.update();
  useEffect(() => {
    draw();
  }, []);

  function draw() {
    var canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");

    context.strokeStyle = "red";

    let x = 400;
    let y = 300;

    setInterval(() => {
      context.clearRect(0, 0, 800, 600);
      context.beginPath();
      system.draw(context);
      // console.log(x);
      box.setPosition(posX, posY);

      // x -= 1;
      // y++;
      if (system.checkCollision(box, polygon)) {
        console.log("hit");
      }
      system.update();
      context.stroke();
    }, 100);
  }

  return (
    <div>
      <canvas
        id="myCanvas"
        tabIndex="0"
        width="400"
        height="300"
        style={{ border: "1px solid black" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            console.log("up");
            draw();
            posY -= 1;
          } else if (e.key === "ArrowDown") {
            posY += 1;
          } else if (e.key === "ArrowLeft") {
            posX -= 1;
          } else if (e.key === "ArrowRight") {
            posX += 1;
          }
        }}
      />
    </div>
  );
}

export default App;
