import { Injectable } from '@angular/core';
import { Carta } from '../models/carta.model';

@Injectable({ providedIn: 'root' })
export class JuegoService {
  private cartas: Carta[] = [];
  private turnoJugador: 1 | 2 = 1;
  private puntaje = { 1: 0, 2: 0 };
  private tiempoRestante = 0; // segundos
  private timerInterval?: any;
  finished: boolean = false;
  mode: number = 1;
  players: string[] = [];

  constructor() {
    const configRaw = localStorage.getItem('memorama-config');
    if (configRaw) {
      const config = JSON.parse(configRaw);
      this.mode = config.mode;
      this.players = config.players;
    }
    this.cargarEstado();
  }

  iniciarJuego(modo2Jugadores: boolean) {
    this.mode = modo2Jugadores ? 2 : 1;
    this.cartas = this.generarCartas();
    this.turnoJugador = 1;
    this.puntaje = { 1: 0, 2: 0 };
    this.tiempoRestante = 0;
    this.finished = false;
    this.guardarEstado();
    this.iniciarTemporizador();
  }

  private generarCartas(): Carta[] {
    const rutas = [
      'assets/img/1.png',
      'assets/img/2.png',
      'assets/img/3.png',
      'assets/img/4.png',
      'assets/img/5.png',
      'assets/img/6.png',
      'assets/img/7.png',
      'assets/img/8.png',
      'assets/img/9.png',
    ];
    let parejas: Carta[] = rutas.flatMap((img, i) => ([
      { id: i * 2, imagen: img, volteada: false, encontrada: false },
      { id: i * 2 + 1, imagen: img, volteada: false, encontrada: false },
    ]));
    parejas = parejas.sort(() => Math.random() - 0.5);
    return parejas;
  }

  voltear(carta: Carta) {
    if (this.finished) return;
    if (carta.volteada || carta.encontrada) return;
    carta.volteada = true;
    const volteadas = this.cartas.filter(c => c.volteada && !c.encontrada);
    if (volteadas.length === 2) {
      setTimeout(() => this.comparar(volteadas), 800);
    }
    this.guardarEstado();
  }

  private comparar([a, b]: Carta[]) {
    if (a.imagen === b.imagen) {
      a.encontrada = b.encontrada = true;
      this.puntaje[this.turnoJugador]++;
    } else {
      a.volteada = b.volteada = false;
      if (this.mode === 2) {
        this.turnoJugador = this.turnoJugador === 1 ? 2 : 1;
      }
    }
    this.guardarEstado();
    this.revisarFin();
  }

  private iniciarTemporizador() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tiempoRestante++;
      this.guardarEstado();
    }, 1000);
  }

  private revisarFin() {
    if (this.cartas.every(c => c.encontrada)) {
      clearInterval(this.timerInterval);
      this.finished = true;
      this.guardarEstado();
      if (this.mode === 1) {
        this.registrarScore();
      }
    }
  }

  private registrarScore() {
    const scoreEntry = { name: this.players[0], time: this.tiempoRestante };
    const scoreboardRaw = localStorage.getItem('memorama-score');
    let scoreboard = scoreboardRaw ? JSON.parse(scoreboardRaw) : [];
    scoreboard.push(scoreEntry);
    scoreboard.sort((a: any, b: any) => a.time - b.time);
    localStorage.setItem('memorama-score', JSON.stringify(scoreboard));
  }

  obtenerScoreboard() {
    const scoreboardRaw = localStorage.getItem('memorama-score');
    return scoreboardRaw ? JSON.parse(scoreboardRaw) : [];
  }

  getWinner() {
    if (this.mode === 2) {
      if (this.puntaje[1] > this.puntaje[2]) return this.players[0];
      else if (this.puntaje[2] > this.puntaje[1]) return this.players[1];
      else return 'Empate';
    }
    return this.players[0];
  }

  private guardarEstado() {
    const estado = {
      cartas: this.cartas,
      turnoJugador: this.turnoJugador,
      puntaje: this.puntaje,
      tiempoRestante: this.tiempoRestante,
      finished: this.finished
    };
    localStorage.setItem('memorama-estado', JSON.stringify(estado));
  }

  private cargarEstado() {
    const raw = localStorage.getItem('memorama-estado');
    if (raw) {
      const e = JSON.parse(raw);
      this.cartas = e.cartas;
      this.turnoJugador = e.turnoJugador;
      this.puntaje = e.puntaje;
      this.tiempoRestante = e.tiempoRestante;
      this.finished = e.finished;
    }
  }

  obtenerCartas() { return this.cartas; }
  obtenerTurno() { return this.turnoJugador; }
  obtenerPuntaje() { return this.puntaje; }
  obtenerTiempo() { return this.tiempoRestante; }
}
