import { MAX_ZOOM, MIDDLE_STRATEGY_SHIFT, WIDTH_EPS } from '../../page-viewer.const';

export function scrollMiddleStrategy(args: {
  currentPageIndex: number;
  totalPageCount: number,
  scrollRatio: number,
  renderedPagesCount: number,
  zoom: number,
}): number | null {
  const width = 1 / args.totalPageCount;
  const shiftY = 1 / args.renderedPagesCount;
  const y = shiftY;

  const widthWithShift = width - WIDTH_EPS;

  if (widthWithShift === 0) {
    return null;
  }

  const zoomF =  args.zoom >= 1 ?  (MIDDLE_STRATEGY_SHIFT -(0.07 *  (args.zoom - 1) / MAX_ZOOM))
    : (MIDDLE_STRATEGY_SHIFT + 0.2 );

  const scrollToRatio = y / (widthWithShift) * (args.scrollRatio - width * args.currentPageIndex) + shiftY - (zoomF) ;

  return scrollToRatio;
}
