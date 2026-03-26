import { JsonPipe, NgStyle } from '@angular/common';
import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';

import { MOCK_DATA } from './api.mock';
import { INITIAL_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT } from './page-viewer.const';

@Component({
  selector: 'app-page-viewer',
  imports: [NgStyle, JsonPipe // TODO: remove],
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
    return Math.trunc(totalPage * this.scrollRatio());
  })
  readonly renderedPages = computed(() => {
    const renderedPages = this.pageList().slice(this.renderedRange().start, this.renderedRange().end);
    // console.log(renderedPages.map((item) => item.number).join(','))
    return renderedPages;
  });
  private readonly scrollRatio = signal<number>(0);
  private readonly renderedPagesElement = viewChild<ElementRef<HTMLDivElement>>('renderedPagesElement');

  // private prevRenderedPage: string | null = null;

  constructor() {
    effect(() => {
      const renderedPagesElement = this.renderedPagesElement()?.nativeElement as HTMLDivElement | undefined;
      // const renderedPagesValue = this.renderedPages();
      // const currentPageIndex = this.currentVisiblePageIndex();

      if (renderedPagesElement == null) {
        return;
      }

      // const currRenderedPages =  renderedPagesValue.map((item) => item.number).join(',');



      // console.log(currRenderedPages);

      // let shiftPx: number = 0;
      // if (this.prevRenderedPage != null && this.prevRenderedPage !== currRenderedPages) {
      //   console.log('changed view');
      //   shiftPx = PAGE_HEIGHT_PX;
      // }
      // console.log(currentPageIndex)

      debugger;

      // const scrollHeight = ; // renderedPagesValue.length * PAGE_HEIGHT_PX;
      // console.log(this.scrollRatio())
      const scrollTop = Math.max(0, Math.trunc(this.scrollRatio() * this.totalHeight() - PAGE_HEIGHT_PX));
      // const scrollTop = preScrollTop % PAGE_HEIGHT_PX;
      // this.prevRenderedPage = currRenderedPages;
      // console.log(scrollTop);
      renderedPagesElement.scroll({
        top: scrollTop,
      })
    })
  }

  onVirtualScroll(event: Event): void {
    // TODO: rename
    const scrollContainer = event.currentTarget as HTMLDivElement | null;

    if (scrollContainer == null) { // lint smart for ==
      return;
    }

    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight =  scrollContainer.clientHeight;

    console.log('Full view scroll: ' + (scrollTop + clientHeight) + ' of ' + scrollHeight);
    const scrollRatio = scrollHeight === 0
      ? 0
      : (scrollTop + clientHeight) / scrollHeight;

    // console.log(scrollRatio)
    this.scrollRatio.set(scrollRatio);
  }

}
