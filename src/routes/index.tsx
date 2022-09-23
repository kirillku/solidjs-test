import { createSignal, For } from "solid-js";
import { Title } from "solid-start";

type Point = [number, number];

enum Direction {
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
}

const [getSnake, setSnake] = createSignal<Point[]>([[1, 1]]);

const [getFood, setFood] = createSignal<Point>([3, 4]);

const [getDirection, setDirection] = createSignal<Direction>(Direction.RIGHT);

const FIELD_LENGTH = 10;

const RANGE = Array.from({ length: FIELD_LENGTH }).map((_v, i) => i);

const isSamePoint = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

const isSnake = (point: Point): boolean =>
  getSnake().some((p) => isSamePoint(p, point));

const isFood = (point: Point): boolean => isSamePoint(getFood(), point);

const setRandomFood = () =>
  setFood(() => [
    Math.floor(Math.random() * FIELD_LENGTH),
    Math.floor(Math.random() * FIELD_LENGTH),
  ]);

const move = (direction: Direction) => {
  setSnake((snake) => {
    const [x, y] = snake[snake.length - 1];
    const newHead: Point = [
      direction === Direction.LEFT
        ? x - 1
        : direction === Direction.RIGHT
        ? x + 1
        : x,
      direction === Direction.UP
        ? y - 1
        : direction === Direction.DOWN
        ? y + 1
        : y,
    ];

    if (
      newHead[0] >= FIELD_LENGTH ||
      newHead[1] >= FIELD_LENGTH ||
      newHead[0] < 0 ||
      newHead[1] < 0
    ) {
      return snake;
    }

    const newSnake = [...snake, newHead];
    if (isSamePoint(getFood(), newHead)) {
      setFood([-1, -1]);
      setTimeout(() => setRandomFood(), 1000);
      return newSnake;
    } else {
      return newSnake.slice(1);
    }
  });
};

export default function Home() {
  document.addEventListener("keydown", (e) => {
    if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      move(e.key as Direction);
    }
  });
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Snake</h1>
      <div>
        <For each={RANGE}>
          {(y) => (
            <div style={{ height: "22px", display: "flex" }}>
              <For each={RANGE}>
                {(x) => (
                  <div
                    style={{
                      display: "inline-flex",
                      width: "20px",
                      height: "20px",
                      background: isSnake([x, y]) ? "palevioletred" : "wheat",
                      border: "1px solid black",
                      ["align-items"]: "center",
                      ["justify-content"]: "center",
                    }}
                  >
                    {isFood([x, y]) && <div>🍒</div>}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </main>
  );
}
