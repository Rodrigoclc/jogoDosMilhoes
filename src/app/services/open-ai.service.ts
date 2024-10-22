import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface OpenAIResponse {
  // Estrutura da resposta da API da OpenAI, adapte de acordo com a documentação
  id: string;
  object: string;
  created: number;
  model: string;
  choices: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  private assistent = 'asst_zP2XkRAJwrsJWt9JDmo0wKOA'
  private apiKey = environment.apiKeyOpenAi;
  private baseUrl = 'https://api.openai.com/v1/threads';
  private headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.apiKey,
    'OpenAI-Beta': 'assistants=v2'
  };

  constructor(private http: HttpClient) { }

  createThread(theme: string) {
    console.log('createThread');
    const url = `${this.baseUrl}`;
    const headers = this.headers;
    const body = '';
    return this.http.post<any>(url, body, { headers } );
  }

  SubmitToolOutputsToRun(threadId: string, runId: string,toolCallId: string, response: string) {
    const url = `${this.baseUrl}/${threadId}/runs/${runId}/submit_tool_outputs`;
    const headers = this.headers;
    const body = {
      "tool_outputs": [
        {
          "tool_call_id": toolCallId,
          "output": response
        }
      ]
    }
    return this.http.post(url,body, { headers });
  }

  listRuns(threadId: string) {
    const url = `${this.baseUrl}/${threadId}/runs`;
    const headers = this.headers;
    return this.http.get<any>(url, { headers });
  }

  addMessage(threadId: string, message: string): Observable<any> {
    const url = `${this.baseUrl}/${threadId}/messages`;
    const headers = this.headers;
    const body = {
      "role": "user",
      "content": message
    };
    return this.http.post(url,body, { headers });
  }

  runThread(threadId: string): Observable<any> {
    const url = `${this.baseUrl}/${threadId}/runs`;
    const headers = this.headers;
    const body = {
      "assistant_id": this.assistent
    }
    return this.http.post(url,body, { headers });
  }

  getMessages(threadId: string): Observable<any> {
    const url = `${this.baseUrl}/${threadId}/messages`;
    const headers = this.headers
    return this.http.get(url, { headers });
  }
}
