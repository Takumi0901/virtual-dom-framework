import createElement from "./createElement";
import render from "./render";
import diff from "./diff";

const createVApp = (count) =>
  createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      "The current count is: ",
      String(count),
      ...Array.from({ length: count }, () =>
        createElement("img", {
          attrs: {
            src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif",
          },
        })
      ),
    ],
  });

export const mount = ($node, $target) => {
  $target.replaceWith($node);
  return $node;
};

let count = 2;
let vApp = createVApp(count);
const $app = render(vApp);
let $rootEl = mount($app, document.getElementById("app"));

setInterval(() => {
  const n = Math.floor(Math.random() * 10);
  const vNewApp = createVApp(n);
  const patch = diff(vApp, vNewApp);

  $rootEl = patch($rootEl);

  vApp = vNewApp;
}, 1000);
