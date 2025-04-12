import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableroComponent } from './components/tablero/tablero.component';
import { InicioComponent } from './components/inicio/inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InicioComponent, TableroComponent],
  template: `
    <div *ngIf="!gameStarted; else gameTemplate">
      <app-inicio (startGame)="onStartGame($event)"></app-inicio>
    </div>
    <ng-template #gameTemplate>
      <app-tablero (reiniciar)="onReiniciar()"></app-tablero>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameStarted = false;

  onStartGame(config: { mode: number, players: string[] }) {
    localStorage.setItem('memorama-config', JSON.stringify(config));
    this.gameStarted = true;
  }

  onReiniciar() {
    this.gameStarted = false;
    localStorage.removeItem('memorama-estado');
    localStorage.removeItem('memorama-config');
  }
}
