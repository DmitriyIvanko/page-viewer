import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';

import { MOCK_DATA } from './api.mock';
import { END_STRATEGY_SHIFT, INITIAL_ZOOM, MIDDLE_STRATEGY_SHIFT, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT, WIDTH_EPS } from './page-viewer.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.scss',
})
export class PageViewer {

  readonly data = signal(MOCK_DATA);
  readonly pageList = computed(() => this.data().pages);
  readonly pageWidth = signal(PAGE_WIDTH_PX)
  readonly pageHeight = signal(PAGE_HEIGHT_PX);
  readonly totalHeight = computed(() => this.pageHeight() * this.pageList().length * this.zoom());
  readonly zoom = signal(INITIAL_ZOOM);
  readonly renderedRange = computed(() => {
    const currentPageIndex = this.currentVisiblePageIndex();
    return {
      start: Math.max(0, currentPageIndex - PRELOAD_PAGES_COUNT),
      end: Math.min(this.pageList().length, currentPageIndex + 1 +  PRELOAD_PAGES_COUNT),
    };
  });
  readonly currentVisiblePageIndex = computed(() => {
    const totalPage = this.pageList().length;

    if (totalPage === 0) {
      return -1;
    }

    return Math.min(totalPage - 1, Math.trunc(totalPage * this.scrollRatio()));
  })
  readonly renderedPages = computed(() => {
    const renderedPages = this.pageList().slice(this.renderedRange().start, this.renderedRange().end);
    return renderedPages;
  });
  private readonly scrollRatio = signal<number>(0);
  private readonly renderedPagesElement = viewChild<ElementRef<HTMLDivElement>>('renderedPagesElement');

  constructor() {
    effect(() => {
      const renderedPagesElement = this.renderedPagesElement()?.nativeElement as HTMLDivElement | undefined;
      const currentPageIndex = this.currentVisiblePageIndex();
      const type = this.getType(currentPageIndex);
      const totalHeightValue = this.totalHeight();
      const renderedPagesCount = this.renderedPages().length;
      const totalPageCount = this.pageList().length;
      const renderedTotalHeight = renderedPagesCount * PAGE_HEIGHT_PX;

      if (renderedPagesElement == null || totalHeightValue === 0 || renderedTotalHeight === 0) {
        return;
      }

      const scrollToRatio = ((): number | null | undefined => {
        switch (type) {
          case 'start': {
            return this.scrollStartStrategy({
              renderedPagesCount,
              clientHeight: renderedPagesElement.clientHeight,
              scrollRatio: this.scrollRatio(),
              totalHeightValue,
              renderedTotalHeight,
              totalPageCount,
            });
          }
          case 'middle': {
            return this.scrollMiddleStrategy({
              currentPageIndex,
              renderedPagesCount,
              scrollRatio: this.scrollRatio(),
              totalPageCount,
            });
          }
          case 'end': {
            return this.scrollEndStrategy({
              currentPageIndex,
              renderedPagesCount,
              scrollRatio: this.scrollRatio(),
              totalPageCount,
            })
          }
        }
      })()

      if (scrollToRatio == null) {
        console.warn('Data inconsistent');
        return;
      }

      const scrollTo = scrollToRatio * renderedTotalHeight;

      requestAnimationFrame(() => {
        renderedPagesElement.scroll({
          top: scrollTo,
        });
      });

    })
  }

  private scrollEndStrategy(args: {
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

    const scrollToRatio = y / (widthWithShift) * (args.scrollRatio - width * args.currentPageIndex) + shiftY - END_STRATEGY_SHIFT;

    return scrollToRatio;
  }

  private scrollMiddleStrategy(args: {
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

    const scrollToRatio = y / (widthWithShift) * (args.scrollRatio - width * args.currentPageIndex) + shiftY - MIDDLE_STRATEGY_SHIFT;

    return scrollToRatio;
  }

  private scrollStartStrategy(args: {
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

    const scrollToRatio = tg * (Math.max(0, args.scrollRatio - startX));
    return scrollToRatio
  }

  private getType(currentVisibleIndex: number): 'start' | 'middle' | 'end' {
      switch (currentVisibleIndex) {
        case 0: {
          return 'start';
        }
        case (this.pageList().length - 1): {
          return 'end'
        }
        default: {
          return 'middle'
        }
      }
  }

  onVirtualScroll(event: Event): void {
    const scrollContainer = event.currentTarget as HTMLDivElement | null;

    if (scrollContainer == null) {
      return;
    }

    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight =  scrollContainer.clientHeight;

    const scrollRatio = scrollHeight === 0
      ? 0
      : (scrollTop + clientHeight) / scrollHeight;

    this.scrollRatio.set(scrollRatio);
  }

}
