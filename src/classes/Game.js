import Goblin from "./Goblin.js";

export default class Game {
  constructor() {
    this.score = 0;
    this.misses = 0;
    this.maxMisses = 5;
    this.isPlaying = false;
    this.timerId = null;

    // Элементы интерфейса
    this.scoreElement = document.getElementById("score");
    this.missesElement = document.getElementById("misses");
    this.boardElement = document.getElementById("board");

    // Создаем гоблина (один экземпляр, который перемещается)
    this.goblin = new Goblin();
    this.goblin.setOnHit(() => this.handleHit());

    // Генерируем ячейки поля (например, 3x3)
    this.cells = [];
    this.initBoard();
  }

  initBoard() {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      this.boardElement.appendChild(cell);
      this.cells.push(cell);
    }
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.score = 0;
    this.misses = 0;
    this.updateUI();
    this.spawnGoblin();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
    this.goblin.hide();
    alert(`Game Over! Ваш счет: ${this.score}`);
  }

  spawnGoblin() {
    if (!this.isPlaying) return;

    // Выбираем случайную ячейку
    const randomIndex = Math.floor(Math.random() * this.cells.length);
    const randomCell = this.cells[randomIndex];

    // Показываем гоблина
    this.goblin.show(randomCell);

    // Таймер исчезновения (1 секунда)
    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;

      // Если гоблин все еще на поле (значит, не кликнули)
      if (this.goblin.element) {
        this.handleMiss();
        this.goblin.hide();
      }

      // Запускаем следующего через небольшую паузу
      if (this.isPlaying) {
        setTimeout(() => this.spawnGoblin(), 500);
      }
    }, 1000);
  }

  handleHit() {
    this.score++;
    this.updateUI();
    // Сбрасываем таймер исчезновения, так как гоблин уже скрыт в методе onClick
    clearTimeout(this.timerId);
    // Сразу спавним следующего
    setTimeout(() => this.spawnGoblin(), 500);
  }

  handleMiss() {
    this.misses++;
    this.updateUI();
    if (this.misses >= this.maxMisses) {
      this.stop();
    }
  }

  updateUI() {
    this.scoreElement.textContent = this.score;
    this.missesElement.textContent = this.misses;
  }
}
