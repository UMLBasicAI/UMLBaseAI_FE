export interface PromptToAIResponse {
    appCode: string;
    body: {
      historyId: string;
      plantUML: string;
      responseText: string;
    };
  }
  