import { AnnotationModel } from "../annotation/annotation.model";
import { DocumentModel } from "./document.model";

export interface DocumentSaveModel {
  document: DocumentModel;
  annotationList: readonly AnnotationModel[];
}
