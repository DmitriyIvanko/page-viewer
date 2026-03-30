import { PageModel } from "./page.model";

export class DocumentModel {
  name: string;
  pageList: readonly PageModel[];

  constructor(obj?: Partial<DocumentModel>) {
    this.name = obj?.name ?? '';
    this.pageList = obj?.pageList ?? [];
  }

}
