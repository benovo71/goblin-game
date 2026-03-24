import Goblin from "./Goblin.js";

export default class Game {
  // 🎯 Конфигурация игры — все «магические числа» вынесены сюда
  static ROWS = 3;
  static COLS = 3;
  static get CELLS_COUNT() {
    return this.ROWS * this.COLS;
  }

  static GOBLIN_DURATION = 1000; // Время появления гоблина (мс)
  static SPAWN_DELAY = 500; // Пауза между появлениями (мс)
  static MAX_MISSES = 5; // Максимальное количество промахов

  constructor(rootElement = document.body) {
    this.root = rootElement;

    this.score = 0;
    this.misses = 0;
    this.isPlaying = false;
    this.timerId = null;

    // 🔑 Получаем элементы ВНУТРИ root с проверкой
    this.scoreElement = this.root.querySelector("#score");
    this.missesElement = this.root.querySelector("#misses");
    this.boardElement = this.root.querySelector("#board");

    if (!this.scoreElement || !this.missesElement || !this.boardElement) {
      const missing = [];
      if (!this.scoreElement) missing.push("#score");
      if (!this.missesElement) missing.push("#misses");
      if (!this.boardElement) missing.push("#board");
      throw new Error(
        `Game: не найдены элементы: ${missing.join(", ")}. Проверьте HTML.`,
      );
    }

    this.goblin = new Goblin();
    this.goblin.setOnHit(() => this.handleHit());

    this.cells = [];
    this.initBoard();
  }

  initBoard() {
    for (let i = 0; i < Game.CELLS_COUNT; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      this.boardElement.append(cell);
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

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.cells.length);
    } while (
      this.cells[randomIndex] === this.goblin.currentCell &&
      this.cells.length > 1 // Защита, если ячейка всего одна
    );

    const randomCell = this.cells[randomIndex];

    this.goblin.show(randomCell);

    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;

      if (this.goblin.element) {
        this.handleMiss();
        this.goblin.hide();
      }

      if (this.isPlaying) {
        setTimeout(() => this.spawnGoblin(), Game.SPAWN_DELAY);
      }
    }, Game.GOBLIN_DURATION);
  }

  handleHit() {
    this.score++;
    this.updateUI();
    // Сбрасываем таймер исчезновения, так как гоблин уже скрыт в методе onClick
    clearTimeout(this.timerId);
    // Сразу спавним следующего
    setTimeout(() => this.spawnGoblin(), Game.SPAWN_DELAY);
  }

  handleMiss() {
    this.misses++;
    this.updateUI();
    // ✅ Используем константу вместо магического числа 5
    if (this.misses >= Game.MAX_MISSES) {
      this.stop();
    }
  }

  updateUI() {
    this.scoreElement.textContent = this.score;
    this.missesElement.textContent = this.misses;
  }
}
