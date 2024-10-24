import { Component, OnInit } from '@angular/core';
import { OpenAiService } from '../../services/open-ai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

interface Question {
  header: string,
  round_question: string,
  alternatives: string[],
  values: string,
  correct_alternative: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
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
  selected: boolean = false;
  itemSelected: number = -1;

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

  selectAlternative(response: string, index: number) {
    this.itemSelected = index;
    this.selected = true;
    
    setTimeout(async () => {
      await Swal.fire({
        title: "Deseja Confirmar?",
        text: "É por sua conta e risco!",
        icon: "question",
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('confirmado');
          if(response == this.question.correct_alternative) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Muito bem você acertou!",
              showConfirmButton: false,
              timer: 3500
            });
            this.SubmitToolOutputsToRun(response);
            this.itemSelected = -1;
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Que pena você errou!",
              showConfirmButton: false,
              timer: 3500
            });
          }
        }
      });;
    }, 1000);
    
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
          console.log(this.question.correct_alternative);
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
    this.loading = true;
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
