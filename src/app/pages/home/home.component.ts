import { Component, OnInit } from '@angular/core';
import { OpenAiService } from '../../services/open-ai.service';
import { FormsModule } from '@angular/forms';

interface Question {
  header: string,
  round_question: string,
  alternatives: string[]
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  mensagem: string = 'Vamos iniciar o jogo, o tema é biblia';
  private threadId: string = '';
  theme: string = '';
  runId: string = '';
  toolCallId: string = '';
  response: string = '';
  question!: Question;
  loading: boolean = true;

  constructor(private openAi: OpenAiService) { }

  ngOnInit(): void {
    this.createThread();
  }

  runThread() {
    console.log('runThread');
    this.openAi.runThread(this.threadId)
      .subscribe(response => {
        this.runId = response.id;
        // const threadId = response.id;
        setTimeout(() => this.listRuns(), 5000);

      });
  }

  createThread() {
    console.log('createThread');
    this.openAi.createThread(this.theme)
      .subscribe(response => {
        this.threadId = response.id;
        // const threadId = response.id;
        this.addMessage();
      });
  }

  listRuns() {
    console.log('listRuns');
    this.loading = true;
    this.openAi.listRuns(this.threadId)
      .subscribe(response => {
        console.log(response);
        //console.log(response.data[0].required_action.submit_tool_outputs.tool_calls.length != 0);
        try {
          this.toolCallId = response.data[0].required_action.submit_tool_outputs.tool_calls[0].id;
          this.question = JSON.parse(response.data[0].required_action.submit_tool_outputs.tool_calls[0].function.arguments);
          console.log(this.question.header);
          console.log(this.question.round_question);
          console.log(this.question.alternatives);
          this.loading = false;
        } catch (error) {
          console.log('falhou');
          this.mensagem = 'vamos para a proxima pergunta!';
          this.addMessage();
          //setTimeout(() => this.listRuns(), 5000);
        }
      });
  }

  SubmitToolOutputsToRun(response: string) {
    console.log('SubmitToolOutputsToRun');
    this.openAi.SubmitToolOutputsToRun(this.threadId, this.runId, this.toolCallId, response)
      .subscribe(response => {
        // const threadId = response.id;
        setTimeout(() => this.listRuns(), 5000);
      });
  }

  getMessages() {
    console.log('getMessages');
    this.openAi.getMessages(this.threadId)
      .subscribe(response => {

      });
  }

  addMessage() {
    console.log('addMessage');
    this.openAi.addMessage(this.threadId, this.mensagem)
      .subscribe(response => {
        // const threadId = response.id;
        this.runThread();
      });
  }
}
