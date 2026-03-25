import { NgStyle } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { MOCK_DATA } from './api.mock';
import { INITIAL_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX } from './page-viewer.const';

@Component({
  selector: 'app-page-viewer',
  imports: [NgStyle],
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.scss',
})
export class PageViewer {

  readonly data = signal(MOCK_DATA);
  readonly pageList = computed(() => this.data().pages);
  readonly pageWidth = signal(PAGE_WIDTH_PX)
  readonly pageHeight = signal(PAGE_HEIGHT_PX);
  readonly totalHeight = computed(() => this.pageWidth() * this.pageList().length * this.zoom())
  readonly zoom = signal(INITIAL_ZOOM);

}
