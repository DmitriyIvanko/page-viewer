import { JsonPipe, NgStyle } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { MOCK_DATA } from './api.mock';
import { INITIAL_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT } from './page-viewer.const';

@Component({
  selector: 'app-page-viewer',
  imports: [NgStyle, JsonPipe],
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.scss',
})
export class PageViewer {

  readonly data = signal(MOCK_DATA);
  readonly pageList = computed(() => this.data().pages);
  readonly pageWidth = signal(PAGE_WIDTH_PX)
  readonly pageHeight = signal(PAGE_HEIGHT_PX);
  readonly totalHeight = computed(() => this.pageWidth() * this.pageList().length * this.zoom());
  readonly zoom = signal(INITIAL_ZOOM);
  readonly renderedPages = computed(() => {
    const totalPage = this.pageList().length;
    const currentPage = Math.trunc(totalPage * this.scrollRatio());
    console.log(currentPage);
    return {
      start: Math.max(0, currentPage - PRELOAD_PAGES_COUNT),
      end: Math.min(totalPage, currentPage + PRELOAD_PAGES_COUNT),
    };
  });
  private readonly scrollRatio = signal<number>(0);

  onVirtualScroll(event: Event): void {
    const scrollContainer = event.currentTarget as HTMLDivElement | null;

    if (scrollContainer == null) { // lint smart for ==
      return;
    }

    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight =  scrollContainer.clientHeight;

    const scrollRatio = scrollHeight === 0
      ? 0
      : (scrollTop + clientHeight) / scrollHeight;

    // console.log(scrollRatio)
    this.scrollRatio.set(scrollRatio);
  }

}
