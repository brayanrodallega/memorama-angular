import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  mode: number = 1;
  player1: string = '';
  player2: string = '';

  @Output() startGame = new EventEmitter<{ mode: number, players: string[] }>();

  onSelectMode(mode: number) {
    this.mode = mode;
  }

  iniciar() {
    if (this.mode === 1) {
      if (!this.player1.trim()) return;
      this.startGame.emit({ mode: 1, players: [this.player1] });
    } else {
      if (!this.player1.trim() || !this.player2.trim()) return;
      this.startGame.emit({ mode: 2, players: [this.player1, this.player2] });
    }
  }
}