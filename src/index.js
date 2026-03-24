import "./index.scss";
import Game from "./classes/Game.js";

const game = new Game();
// Добавим кнопку старта для удобства
const startBtn = document.createElement("button");
startBtn.textContent = "Start Game";
startBtn.onclick = () => game.start();
document.body.append(startBtn);
