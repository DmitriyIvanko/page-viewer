import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';

import { MOCK_DATA } from './api.mock';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT, ZOOM_STEP } from './page-viewer.const';
import { ScrollHelper } from './scroll-helper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.scss',
})
export class PageViewer {
  readonly data = signal(MOCK_DATA);
  readonly pageList = computed(() => this.data().pages);
  readonly pageWidth = computed(() => {
    return  this.zoom() * PAGE_WIDTH_PX;
  })
  readonly pageHeight = computed(() => {
    return this.zoom() * PAGE_HEIGHT_PX;
  })
  readonly totalHeight = computed(() => this.pageHeight() * this.pageList().length * this.zoom());
  readonly zoom = signal(INITIAL_ZOOM);
  readonly renderedRange = computed(() => {
    const currentPageIndex = this.currentVisiblePageIndex();
    const result = {
      start: Math.max(0, currentPageIndex - PRELOAD_PAGES_COUNT),
      end: Math.min(this.pageList().length - 1, currentPageIndex + PRELOAD_PAGES_COUNT),
    };

    console.log(result);
    return result;
  });
  readonly currentVisiblePageIndex = computed(() => {
    const totalPage = this.pageList().length;

    if (totalPage === 0) {
      return -1;
    }

    return Math.min(totalPage - 1, Math.trunc(totalPage * this.scrollRatio()));
  })
  readonly renderedPages = computed(() => {
    const renderedPages = this.pageList().slice(this.renderedRange().start, this.renderedRange().end + 1);
    console.log(renderedPages)
    return renderedPages;
  });
  private readonly scrollRatio = signal<number>(0);
  private readonly renderedPagesElement = viewChild<ElementRef<HTMLDivElement>>('renderedPagesElement');
  private readonly scrollHelper = inject(ScrollHelper);

  constructor() {
    effect(() => {
      const renderedPagesElement = this.renderedPagesElement()?.nativeElement as HTMLDivElement | undefined;
      const currentPageIndex = this.currentVisiblePageIndex();
      const totalHeightValue = this.totalHeight();
      const renderedPagesCount = this.renderedPages().length;
      const totalPageCount = this.pageList().length;
      const renderedTotalHeight = renderedPagesCount * this.pageHeight();

      if (renderedPagesElement == null || totalHeightValue === 0 || renderedTotalHeight === 0) {
        return;
      }

      const scrollToRatio = this.scrollHelper.calcPageScrollRatio({
        clientHeight: renderedPagesElement.clientHeight,
        currentPageIndex,
        renderedPagesCount,
        renderedTotalHeight,
        scrollRatio: this.scrollRatio(),
        totalHeightValue,
        totalPageCount,
        zoom: this.zoom(),
      })

      if (scrollToRatio == null) {
        console.warn('Data inconsistent');
        return;
      }

      const scrollTo = scrollToRatio * renderedTotalHeight;
      // console.log(scrollTo)

      requestAnimationFrame(() => {
        renderedPagesElement.scroll({
          top: scrollTo,
        });
      });
    })
  }

  onIncreaseZoom(): void {
    this.zoom.update((zoom) => Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  }

  onDecreaseZoom(): void {
    this.zoom.update((zoom) => Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  }

  onVirtualScroll(event: Event): void {
    const scrollContainer = event.target as HTMLDivElement | null;

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
