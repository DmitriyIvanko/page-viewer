import { Routes } from '@angular/router';

import { DOCUMENT_ID_PATH, MOCK_DOCUMENT_ID } from './app.const';
import { PageViewerComponent } from './page-viewer/page-viewer.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: MOCK_DOCUMENT_ID,
  },
  {
    path: ':' + DOCUMENT_ID_PATH,
    component: PageViewerComponent, // main component, without lazy-loading
  }
];
