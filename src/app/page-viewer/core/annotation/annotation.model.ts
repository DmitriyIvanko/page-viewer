import { EMPTY_POINT, Point } from "./point.model";

export class AnnotationModel {
  id: string | null;
  pageId: string | null;
  message: string;
  point: Point;

  constructor(obj: Partial<AnnotationModel>){
    this.id = obj?.id ?? null;
    this.pageId = obj?.pageId ?? null;
    this.point = obj?.point ?? EMPTY_POINT;
    this.message = obj?.message ?? '';
  }
}
