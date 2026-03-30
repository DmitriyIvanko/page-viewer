import { MapperModel } from "../utils";
import { AnnotationModel } from "./annotation.model";
import { Point } from "./point.model";

export class AnnotationMapper extends MapperModel<AnnotationModel, any> {
  protected override transformToClient(response: any): AnnotationModel {
    const point: Point = {
      x: response.x,
      y: response.y,
    };

    return new AnnotationModel({
      id: response.id,
      message: response.message,
      pageId: response.pageId,
      point,
    });
  }
}
