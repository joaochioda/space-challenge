import React, { useEffect, useState } from "react";
import { System, Circle } from "detect-collisions";

function App() {
  const [posX, setPosX] = useState(0);

  const system = new System();
  const circle = new Circle({ x: 0, y: 0 }, 10);
  system.insert(circle);
  //system.update();
  useEffect(() => {
    draw();
  }, []);

  function draw() {
    var canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");

    context.strokeStyle = "red";

    let x = 0;
    let y = 0;

    setInterval(() => {
      context.clearRect(0, 0, 800, 600);
      context.beginPath();
      system.draw(context);
      console.log(x);
      circle.setPosition(x + 1, y + 1);
      x++;
      y++;

      system.update();
      context.stroke();
    }, 100);
  }

  return (
    <div>
      <canvas
        id="myCanvas"
        width="800"
        height="600"
        style={{ border: "1px solid black" }}
      />
    </div>
  );
}

export default App;
