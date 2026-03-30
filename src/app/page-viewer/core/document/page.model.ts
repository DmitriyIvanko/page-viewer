export class PageModel {
  id: string | null;
  imageUrl: string;

  constructor(obj?: Partial<PageModel>) {
    this.id = obj?.id ?? null;
    this.imageUrl = obj?.imageUrl ?? '';
  }
}
