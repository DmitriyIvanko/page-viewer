import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, HostBinding, HostListener, inject, Injector, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { DOCUMENT_ID_PATH } from '../app.const';
import { AnnotationModel, AnnotationStateService, DocumentStateService } from './core';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM, PAGE_HEIGHT_PX, PAGE_WIDTH_PX, PRELOAD_PAGES_COUNT, ZOOM_STEP } from './page-viewer.const';
import { ScrollHelper } from './scroll-helper';

@Component({
  selector: 'pv-page-viewer',
  imports: [],
  templateUrl: './page-viewer.component.html',
  styleUrl: './page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.add-mode]': 'this.isAddAnnotationModeS()',
  }
})
export class PageViewerComponent implements OnInit {
  readonly annotationListS = computed(() => this.annotationStateService.stateS());
  readonly currentVisiblePageIndexS = computed(() => {
    const totalPage = this.pageListS().length;

    if (totalPage === 0) {
      return -1;
    }

    return Math.min(totalPage - 1, Math.trunc(totalPage * this.scrollRatioS()));
  })
  readonly isAddAnnotationModeS = signal(false);
  readonly isLoadingS = computed(() => this.documentStateService.isLoadingS() || this.annotationStateService.isLoadingS());
  readonly pageHeightS = computed(() => this.zoomS() * PAGE_HEIGHT_PX);
  readonly pageListS = computed(() => this.documentStateService.stateS()?.pageList ?? []);
  readonly pageWidthS = computed(() => this.zoomS() * PAGE_WIDTH_PX);
  readonly renderedAnnotationListS = computed(() => {
    const resultList = this.annotationListS().filter((annotation) => {
      return this.renderedPageListS().some((page) => {
        return page.id === annotation.pageId;
      });
    });
    console.log(resultList);
    return resultList;
  });
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
  private readonly annotationStateService = inject(AnnotationStateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly documentIdS = signal<string | null>(null);
  private readonly documentStateService = inject(DocumentStateService);
  private readonly renderedPagesElementS = viewChild<ElementRef<HTMLDivElement>>('renderedPagesElement');
  private readonly scrollHelper = inject(ScrollHelper);
  private readonly scrollRatioS = signal<number>(0);
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    // get id:
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const documentId = paramMap.get(DOCUMENT_ID_PATH);

      this.documentIdS.set(documentId);
    });

    // load data:
    effect(() => {
      const documentId = this.documentIdS();

      if (documentId == null) {
        return;
      }

      this.documentStateService.get(documentId);
      this.annotationStateService.get(documentId);
    }, { injector: this.injector });

    // virtual scroll:
    effect(() => {
      const renderedPagesElement = this.renderedPagesElementS()?.nativeElement as HTMLDivElement | undefined;
      const currentPageIndex = this.currentVisiblePageIndexS();
      const totalHeightValue = this.totalHeightS();
      const renderedPagesCount = this.renderedPageListS().length;
      const totalPageCount = this.pageListS().length;
      const renderedTotalHeight = renderedPagesCount * this.pageHeightS();

      if (renderedPagesElement == null || totalHeightValue === 0 || renderedTotalHeight === 0) {
        return;
      }

      const scrollToRatio = this.scrollHelper.calcPageScrollRatio({
        clientHeight: renderedPagesElement.clientHeight,
        currentPageIndex,
        renderedPagesCount,
        renderedTotalHeight,
        scrollRatio: this.scrollRatioS(),
        totalHeightValue,
        totalPageCount,
        zoom: this.zoomS(),
      })

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
    }, { injector: this.injector });
  }

  // TODO: replace to pipe:
  calcY(annotation: AnnotationModel): number {
    const renderedPageIndex = this.renderedPageListS().findIndex((page) => page.id === annotation.pageId);
    const pageY = renderedPageIndex * this.pageHeightS();
    const y = pageY + annotation.point.y;

    const renderedPagesElement = this.renderedPagesElementS()?.nativeElement as HTMLDivElement | undefined;

    if (renderedPagesElement == null) {
      console.log('warn');
      return annotation.point.y;
    }

    return y - renderedPagesElement.scrollTop;
    // const y = annotation.point.y + annotation.pageId
    // return annotation.point.y;
  }

  onAddAnnotation(event: MouseEvent): void {
    if (!this.isAddAnnotationModeS()) {
      return;
    }

    const renderedPagesElement = this.renderedPagesElementS()?.nativeElement as HTMLDivElement | undefined;

    if (renderedPagesElement == null) {
      return;
    }

    const clickY = renderedPagesElement.scrollTop + event.offsetY;
    const pageIndex = this.renderedRangeS().start + Math.trunc(clickY / this.pageHeightS());
    const pageOffsetY = clickY % this.pageHeightS();

    this.annotationStateService.add(new AnnotationModel({
      message: 'Empty annotation',
      pageId: String(pageIndex + 1),
      point: {
        x: event.offsetX,
        y: pageOffsetY,
      },
    }));

    this.isAddAnnotationModeS.set(false);
  }

  onAddAnnotationMode(): void {
    this.isAddAnnotationModeS.set(true);
  }

  @HostListener('window:keydown.esc', ['$event'])
  onCancelAddAnnotationMode(event: Event): void {
    if (this.isAddAnnotationModeS()) {
      event.preventDefault();
    }

    this.isAddAnnotationModeS.set(false);
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
