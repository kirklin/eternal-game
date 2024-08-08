import { GameCtx } from "../gameCtx";

const {
  YELLOW,
} = GameCtx;

const {
  add,
  width,
  go,
  wait,
  vec2,
  onKeyPress,
} = GameCtx;

function lose() {
  const context = [
    "你输了",
  ];

  add([
    {
      draw: () => {
        for (let i = 0; i < context.length; i++) {
          GameCtx.pushTransform();
          GameCtx.pushTranslate(5, 130 * i);
          GameCtx.drawText({
            text: context[i],
            font: "sink",
            width: width() - 180,
            color: YELLOW,
            pos: vec2(20, 20),
          });
          GameCtx.popTransform();
        }
      },
    },
  ]);

  onKeyPress(() => {
    wait(1, () => {
      go("game");
    });
  });
}

export default lose;
