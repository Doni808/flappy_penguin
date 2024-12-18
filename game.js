// Получаем доступ к холсту
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Загружаем изображение птички
const birdImg = new Image();
birdImg.src = "bird.png"; // Убедитесь, что путь к bird.png правильный

birdImg.onload = () => {
  console.log("Изображение птички успешно загружено");
  draw(); // Запускаем игру только после загрузки изображения
};

birdImg.onerror = () => {
  console.error("Ошибка загрузки изображения птички");
};

// Начальные параметры игры
let birdX = 25; // Координата X птички
let birdY = 150; // Координата Y птички
let birdWidth = 50; // Ширина птички
let birdHeight = 40; // Высота птички
let gravity = 0.4; // Гравитация
let lift = -9; // Сила прыжка
let velocity = 0; // Текущая скорость птички
let score = 0; // Счёт игрока
let isGameOver = false; // Состояние игры

// Параметры труб
let pipes = [];
let pipeWidth = 40;
let pipeGap = 140;
let pipeSpeed = 1.8;

let lastFrameTime = 0; // Время последнего кадра
const frameInterval = 1000 / 60; // Интервал между кадрами (16.67 мс для 60 FPS)

function draw(timestamp) {
  const deltaTime = timestamp - lastFrameTime;

  // Обновляем только если прошло достаточно времени
  if (deltaTime >= frameInterval) {
    lastFrameTime = timestamp;

    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовываем трубы
    drawPipes();

    // Рисуем птичку
    drawBird();

    // Отображаем счёт
    drawScore();

    // Применяем гравитацию
    velocity += gravity;
    birdY += velocity;

    // Проверка столкновений
    if (birdY + birdHeight > canvas.height || birdY < 0) {
      isGameOver = true;
    }
  }

  // Проверяем состояние игры
  if (!isGameOver) {
    requestAnimationFrame(draw);
  } else {
    // Отрисовываем экран окончания игры
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Игра окончена!", 50, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Кликните, чтобы начать заново", 30, canvas.height / 2 + 40);
  }
}


// Функция сброса игры
function resetGame() {
  birdY = 150;
  velocity = 0;
  score = 0;
  isGameOver = false;
  pipes = [
    {
      x: canvas.width,
      y: 0,
      gapStart: Math.floor(Math.random() * (canvas.height - pipeGap))
    }
  ];
}

// Создаём начальную трубу
resetGame();

// Функция отрисовки труб
function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];

    // Рисуем верхнюю трубу
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipe.gapStart);

    // Рисуем нижнюю трубу
    ctx.fillRect(pipe.x, pipe.gapStart + pipeGap, pipeWidth, canvas.height - pipe.gapStart - pipeGap);

    // Двигаем трубу влево
    pipe.x -= pipeSpeed;

    // Проверка столкновения
    if (
      birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth &&
      (birdY < pipe.gapStart || birdY + birdHeight > pipe.gapStart + pipeGap)
    ) {
      isGameOver = true; // Столкновение с трубой
    }

    // Если труба вышла за пределы экрана, добавляем новую
    if (pipe.x + pipeWidth < 0) {
      pipes.shift();
      pipes.push({
        x: canvas.width,
        y: 0,
        gapStart: Math.floor(Math.random() * (canvas.height - pipeGap))
      });
      score++; // Увеличиваем счёт
    }
  }
}

// Функция отрисовки птички
function drawBird() {
  ctx.save();
  ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);

  let angle = velocity / 10;
  if (angle > 1.5) angle = 1.5;
  if (angle < -1.5) angle = -1.5;

  ctx.rotate(angle);
  ctx.drawImage(birdImg, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);

  ctx.restore();
}

// Функция отображения счёта
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Счёт: " + score, 10, 30);
}

// Основной игровой цикл
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовываем трубы
  drawPipes();

  // Рисуем птичку
  drawBird();

  // Отображаем счёт
  drawScore();

  // Применяем гравитацию
  velocity += gravity;
  birdY += velocity;

  // Проверка столкновения с верхом или низом экрана
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    isGameOver = true;
  }

  // Если игра окончена
  if (isGameOver) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Игра окончена!", 50, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Кликните, чтобы начать заново", 30, canvas.height / 2 + 40);
    return;
  }

  // Запрашиваем следующий кадр
  requestAnimationFrame(draw);
}

// Обработка кликов (прыжок или рестарт)
document.addEventListener("click", function() {
  if (isGameOver) {
    resetGame(); // Перезапуск игры
    draw();
  } else {
    velocity = lift; // Прыжок
  }
});

// Запускаем игру
draw();
