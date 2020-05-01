import render from "./render";
import { NodeType } from "./createElement";

const zip = (
  xs: string | any[],
  ys: string | any[] | NodeListOf<ChildNode>
) => {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffAttrs = (
  oldAttrs: any,
  newAttrs: { [s: string]: any } | ArrayLike<unknown>
) => {
  const patches: {
    ($node: HTMLElement): HTMLElement;
    ($node: HTMLElement): HTMLElement;
  }[] = [];

  // setting newAttrs
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // removing attrs
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node: HTMLElement) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node: HTMLElement) => {
    for (const patch of patches) {
      patch($node);
    }
    return $node;
  };
};

const diffChildren = (oldVChildren: NodeType[], newVChildren: NodeType[]) => {
  const childPatches: (($node: HTMLElement) => any)[] = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches: (($node: HTMLElement) => any)[] = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return ($parent: HTMLElement) => {
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
    for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
      patch($child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

const diff = (oldVTree: NodeType, newVTree: NodeType) => {
  // let's assume oldVTree is not undefined!
  if (newVTree === undefined) {
    return ($node: HTMLElement): undefined => {
      $node.remove();
      // the patch should return the new root node.
      // since there is none in this case,
      // we will just return undefined.
      return undefined;
    };
  }

  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      // could be 2 cases:
      // 1. both trees are string and they have different values
      // 2. one of the trees is text node and
      //    the other one is elem node
      // Either case, we will just render(newVTree)!
      return ($node: Text | HTMLElement) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // this means that both trees are string
      // and they have the same values
      return ($node: HTMLElement) => $node;
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    // we assume that they are totally different and
    // will not attempt to find the differences.
    // simply render the newVTree and mount it.
    return ($node: Text | HTMLElement) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return ($node: HTMLElement) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;
