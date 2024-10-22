import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenAiService } from './services/open-ai.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'jogoDoMilhao';
}
