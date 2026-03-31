import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { DOCUMENT_ID_PATH } from '../app.const';
import { DocumentStateService } from './core';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT, ZOOM_STEP } from './page-viewer.const';

@Component({
  selector: 'pv-page-viewer',
  imports: [],
  templateUrl: './page-viewer.component.html',
  styleUrl: './page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageViewerComponent implements OnInit {

  readonly currentVisiblePageIndexS = computed(() => {
    const totalPage = this.pageListS().length;

    if (totalPage === 0) {
      return -1;
    }

    return Math.min(totalPage - 1, Math.trunc(totalPage * this.scrollRatioS()));
  })
  readonly isLoadingS = computed(() => this.documentStateService.isLoadingS || false); // TODO: add other service
  readonly pageHeightS = computed(() => this.zoomS() * PAGE_HEIGHT_PX);
  readonly pageListS = computed(() => this.documentStateService.stateS()?.pageList ?? []);
  readonly pageWidthS = computed(() => this.zoomS() * PAGE_WIDTH_PX);
  readonly renderedPageListS = computed(() => {
    const renderedPageList = this.pageListS().slice(this.renderedRangeS().start, this.renderedRangeS().end + 1);
    return renderedPageList; // TODO: improve
  });
  readonly renderedRangeS = computed(() => {
    const currentPageIndex = this.currentVisiblePageIndexS();
    const result = {
      start: Math.max(0, currentPageIndex - PRELOAD_PAGES_COUNT),
      end: Math.min(this.pageListS().length - 1, currentPageIndex + PRELOAD_PAGES_COUNT),
    };
    // TODO: improve
    return result;
  });
  readonly totalHeightS = computed(() => this.pageHeightS() * this.pageListS().length * this.zoomS());
  readonly zoomS = signal(INITIAL_ZOOM);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly documentIdS = signal<string | null>(null);
  private readonly documentStateService = inject(DocumentStateService);
  private readonly scrollRatioS = signal<number>(0);
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const documentId = paramMap.get(DOCUMENT_ID_PATH);

      this.documentIdS.set(documentId);
    });

    effect(() => {
      const documentId = this.documentIdS();

      if (documentId == null) {
        return;
      }

      this.documentStateService.get(documentId);
    }, { injector: this.injector });
  }

  onIncreaseZoom(): void {
    this.zoomS.update((zoom) => Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  }

  onDecreaseZoom(): void {
    this.zoomS.update((zoom) => Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
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

    this.scrollRatioS.set(scrollRatio);
  }


}
