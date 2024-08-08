import { GameCtx } from "../gameCtx";

const {
  center,
  area,
  rect,
  YELLOW,
  WHITE,
  GREEN,
} = GameCtx;

const {
  add,
  pos,
  text,
  color,
  width,
  height,
  go,
  wait,
  vec2,
  opacity,
  onKeyPress,
  fixed,
} = GameCtx;

function menu() {
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.6),
    fixed(),
  ]);

  const context = [
    "Eternal Engine 是一个结合 KKPLAY 和 Dify.AI",
    "技术的智能游戏开发平台。",
    "通过与 Dify.AI 代理进行互动聊天，",
    "该引擎能够无限生成独特的游戏关卡，",
    "使游戏开发变得更加快速、有趣和富有创意。",
    "按空格开始体验",
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
            color: i === 3 ? YELLOW : WHITE,
            pos: vec2(20, 20),
          });
          GameCtx.popTransform();
        }
      },
    },
  ]);

  onKeyPress("space", () => {
    wait(1, () => {
      go("game");
    });
  });
}

export default menu;
