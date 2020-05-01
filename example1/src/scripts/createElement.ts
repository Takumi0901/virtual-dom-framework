/** Nodeが取りうる3種の型 */
export type NodeType = VNode | string;
/** 属性の型 */
export type AttributeType = string | number;
export type Attributes = {
  [attr: string]: AttributeType;
};

/**
 * 仮想DOMのひとつのオブジェクトを表す型
 */
export type VNode = {
  tagName?: keyof ElementTagNameMap;
  attrs: { [s: string]: any } | ArrayLike<unknown>;
  children?: NodeType[];
};

export default (tagName: string, { attrs = {}, children = [] }: VNode) => {
  const vElem = Object.create(null);

  Object.assign(vElem, {
    tagName,
    attrs,
    children,
  });

  return vElem;
};
