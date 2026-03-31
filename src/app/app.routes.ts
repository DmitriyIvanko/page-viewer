import { Routes } from '@angular/router';

import { MOCK_DOCUMENT_ID } from './app.const';
import { PageViewer } from './page-viewer';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: MOCK_DOCUMENT_ID,
  },
  {
    path: ':DOCUMENT_ID',
    component: PageViewer, // TODO: add lazy-loading (if needed)
  }
];
