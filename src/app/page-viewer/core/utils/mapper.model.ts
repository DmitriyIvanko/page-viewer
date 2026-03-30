export abstract class MapperModel<TClient, TServer = any> {
  mapCollectionToClient(response: ReadonlyArray<TServer> | undefined): TClient[] {
    return response?.map((item) => {
      return this.transformToClient(item);
    }) ?? [];
  }

  mapCollectionToServer(request: ReadonlyArray<TClient> | ReadonlyArray<Partial<TClient>> | undefined): TServer[] {
    return  request?.map((item: TClient | Partial<TClient>) => {
      return this.transformToServer(item);
    }) ?? [];
  }

  mapInstanceToClient(response: TServer): TClient {
    return this.transformToClient(response);
  }

  mapInstanceToServer(request: TClient | Partial<TClient>): TServer {
    return this.transformToServer(request);
  }

  protected transformToClient(response: TServer): TClient {
    return response as unknown as TClient;
  }

  protected transformToServer(request: TClient | Partial<TClient>): TServer {
    return request as unknown as TServer;
  }
}
