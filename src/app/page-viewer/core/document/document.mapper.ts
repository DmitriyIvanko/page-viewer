import { MapperModel } from "../utils";
import { DocumentModel } from "./document.model";
import { PageModel } from "./page.model";

export class DocumentMapper extends MapperModel<DocumentModel, any> {
  protected override transformToClient(response: any): DocumentModel {
    const pageList = response.pages.map((page: Record<string, unknown>) => {
      return new PageModel({
        id: String(page.number),
        imageUrl: page.imageUrl as string,
      })
    })

    return new DocumentModel({
      name: response.name,
      pageList,
    })
  }
}
