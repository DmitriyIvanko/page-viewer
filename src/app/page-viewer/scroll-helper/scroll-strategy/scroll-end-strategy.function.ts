import { END_STRATEGY_SHIFT, WIDTH_EPS } from '../../page-viewer.const';

export function scrollEndStrategy(args: {
  currentPageIndex: number;
  totalPageCount: number,
  scrollRatio: number,
  renderedPagesCount: number,
}): number | null {
  const width = 1 / args.totalPageCount;
  const shiftY = 1 / args.renderedPagesCount;
  const y = shiftY;

  const widthWithShift = width - WIDTH_EPS;

  if (widthWithShift === 0) {
    return null;
  }

  const scrollToRatio = y / widthWithShift * (args.scrollRatio - width * args.currentPageIndex) + shiftY - END_STRATEGY_SHIFT;

  return scrollToRatio;
}
