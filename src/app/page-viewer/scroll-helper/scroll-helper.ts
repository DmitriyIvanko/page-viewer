import { Injectable } from '@angular/core';

import { CalcPageScrollRatioArgs } from './calc-page-scroll-ratio.model';
import { scrollEndStrategy, scrollMiddleStrategy, scrollStartStrategy } from './scroll-strategy';

@Injectable({
  providedIn: 'root',
})
export class ScrollHelper {

  calcPageScrollRatio({
    clientHeight,
    currentPageIndex,
    renderedPagesCount,
    renderedTotalHeight,
    scrollRatio,
    totalHeightValue,
    totalPageCount,
  }: CalcPageScrollRatioArgs): number | null {

    const type = this.getType(currentPageIndex, totalPageCount - 1);

    switch (type) {
      case 'start': {
        return scrollStartStrategy({
          renderedPagesCount,
          clientHeight,
          scrollRatio,
          totalHeightValue,
          renderedTotalHeight,
          totalPageCount,
        });
      }
      case 'middle': {
        return scrollMiddleStrategy({
          currentPageIndex,
          renderedPagesCount,
          scrollRatio,
          totalPageCount,
        });
      }
      case 'end': {
        return scrollEndStrategy({
          currentPageIndex,
          renderedPagesCount,
          scrollRatio,
          totalPageCount,
        })
      }
    }
  }

  private getType(currentVisibleIndex: number, lastIndex: number): 'start' | 'middle' | 'end' {
    switch (currentVisibleIndex) {
      case 0: {
        return 'start';
      }
      case lastIndex: {
        return 'end'
      }
      default: {
        return 'middle'
      }
    }
  }
}
