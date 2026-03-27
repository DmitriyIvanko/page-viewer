import { WIDTH_EPS } from "../../page-viewer.const";

export function scrollStartStrategy(args: {
  clientHeight: number,
  totalHeightValue: number,
  totalPageCount: number,
  renderedPagesCount: number,
  renderedTotalHeight: number,
  scrollRatio: number,
}): number | null {
  const startX = args.clientHeight / args.totalHeightValue;
  const endX1 = 1 / args.totalPageCount - WIDTH_EPS;
  const x = Math.max(0, endX1 - startX);

  const startY = args.clientHeight / args.renderedTotalHeight;
  const endY = 1 / args.renderedPagesCount;
  const y = Math.max(0,endY - startY);

  if (x === 0) {
    return null;
  }

  const tg = y / x;

  return tg * (Math.max(0, args.scrollRatio - startX));
}
