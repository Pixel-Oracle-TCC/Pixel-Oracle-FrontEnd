import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  isMenuOpen = signal(false);
  activeSection = signal('hero');

  private intervalId?: ReturnType<typeof setInterval>;

  stats: StatItem[] = [
    { value: '12.400', label: 'Jogos analisados', suffix: '+' },
    { value: '94', label: 'Precisão preditiva', suffix: '%' },
    { value: '380', label: 'Devs independentes', suffix: '+' },
    { value: '3,2x', label: 'Retorno médio', suffix: '' },
  ];

  features: FeatureCard[] = [
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>`,
      title: 'KPIs Preditivos',
      description:
        'Taxa de conversão de wishlist, retenção D1/D7/D30 e saturação de gênero calculados por IA.',
      tag: 'Analytics',
      tagColor: 'blue',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>`,
      title: 'Benchmarking',
      description:
        'Compare seu jogo com títulos como Hades, Dandara e Vampire Survivors. Aprenda com os melhores.',
      tag: 'Inteligência',
      tagColor: 'purple',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>`,
      title: 'Red Flags',
      description:
        'Alertas inteligentes sobre janelas de lançamento, escopo excessivo e gaps de localização.',
      tag: 'Risco',
      tagColor: 'orange',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      title: 'Simulador de Receita',
      description:
        'Insira seus custos e descubra o tempo estimado para o break-even com base em jogos similares.',
      tag: 'Financeiro',
      tagColor: 'green',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>`,
      title: 'Análise de Tendências',
      description:
        'Quais tags estão em alta no Steam agora? Identifique o oceano azul antes da saturação.',
      tag: 'Mercado',
      tagColor: 'blue',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
      </svg>`,
      title: 'Contexto Brasil',
      description:
        'Editais, leis de incentivo e comportamento do jogador brasileiro. Dados que importam pra você.',
      tag: 'Local',
      tagColor: 'green',
    },
  ];

  ngOnInit(): void {
    this.startParticleAnimation();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  private startParticleAnimation(): void {
    // Handled via CSS animations
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    this.isMenuOpen.set(false);
  }
}

