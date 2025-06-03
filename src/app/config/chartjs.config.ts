import {
  Chart,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  PieController, ArcElement,
  DoughnutController,
  RadarController,
  PolarAreaController,
  CategoryScale, LinearScale,
  Title, Tooltip, Legend
} from 'chart.js';

// ✅ Registra todos los tipos de gráficos que vayas a usar
Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  PieController, ArcElement,
  DoughnutController,
  RadarController,
  PolarAreaController,
  CategoryScale, LinearScale,
  Title, Tooltip, Legend
);