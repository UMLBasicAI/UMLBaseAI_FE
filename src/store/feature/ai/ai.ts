export interface PromptToAIResponse {
  appCode: string;
  body: {
    historyId: string;
    plantUML: string;
    responseText: string;
  };
}

export interface HistoryResponse {
  appCode: string;
  body: {
    historyId: string;
    messages: Array<{
      content: string;
      messageType: string;
      createdAt: string;
      updatedAt: string;
    }>;
    isHasNextPage: boolean;
    isHasPreviousPage: boolean;
  };
}
