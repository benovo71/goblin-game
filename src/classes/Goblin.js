export default class Goblin {
  constructor(rootElement) {
    this.root = rootElement;
    this.element = null;
    this.onClick = this.onClick.bind(this);
  }

  // Создаем DOM-элемент гоблина
  show(positionIndex) {
    // Удаляем старого гоблина, если он был (на всякий случай)
    this.hide();

    this.element = document.createElement("div");
    this.element.classList.add("goblin");
    // Позиционируем гоблина в нужной ячейке (предполагаем, что root - это сетка)
    // Или просто добавляем в конкретную ячейку, переданную извне.
    // Для простоты пусть root будет контейнером, а мы добавляем гоблина внутрь.
    // Но лучше, чтобы Game передавал конкретную ячейку (cell).

    // Исправленный подход: Goblin получает конкретную ячейку (cell)
    // Но в конструкторе мы передали root. Давайте сделаем метод show более гибким.
    // Пусть Game создает ячейки, а Goblin просто "оживляет" их.

    // Для этого примера предположим, что show принимает конкретный элемент ячейки
    this.currentCell = positionIndex;
    this.currentCell.appendChild(this.element);

    this.element.addEventListener("click", this.onClick);
  }

  hide() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element.removeEventListener("click", this.onClick);
      this.element = null;
    }
    this.currentCell = null;
  }

  onClick(event) {
    event.stopPropagation(); // Чтобы клик не ушел ниже
    // Сообщаем игре, что гоблина поймали
    if (this.onHitCallback) {
      this.onHitCallback();
    }
    this.hide();
  }

  setOnHit(callback) {
    this.onHitCallback = callback;
  }
}
