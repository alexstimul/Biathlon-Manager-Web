import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./RaceView.module.scss"

interface RaceViewProps {
    currentDistance: number // 0-1
    trackPoints: [number, number][]
}

const RaceView = (props: RaceViewProps) => {
    const { currentDistance, trackPoints } = props
    const width = 400
    const height = 200

    const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Функция для вычисления позиции на ломаной линии
  const getPositionOnPolyline = useCallback((points: [number, number][], t: number): [number, number] => {
    if (points.length === 0) return [0, 0];
    if (points.length === 1) return [points[0][0] * width, points[0][1] * height];
    
    const absPoints = points.map(([x, y]) => [x * width, y * height]);
    
    // Вычисляем общую длину ломаной линии
    let totalLength = 0;
    const segmentLengths: number[] = [];
    
    for (let i = 0; i < absPoints.length - 1; i++) {
      const dx = absPoints[i + 1][0] - absPoints[i][0];
      const dy = absPoints[i + 1][1] - absPoints[i][1];
      const length = Math.sqrt(dx * dx + dy * dy);
      segmentLengths.push(length);
      totalLength += length;
    }
    
    // Находим нужный сегмент и позицию в нем
    const targetLength = t * totalLength;
    let accumulatedLength = 0;
    
    for (let i = 0; i < segmentLengths.length; i++) {
      const segmentLength = segmentLengths[i];
      
      if (targetLength <= accumulatedLength + segmentLength) {
        const segmentT = (targetLength - accumulatedLength) / segmentLength;
        const x = absPoints[i][0] + (absPoints[i + 1][0] - absPoints[i][0]) * segmentT;
        const y = absPoints[i][1] + (absPoints[i + 1][1] - absPoints[i][1]) * segmentT;
        return [x, y];
      }
      
      accumulatedLength += segmentLength;
    }
    
    // Если вышли за пределы, возвращаем последнюю точку
    return [absPoints[absPoints.length - 1][0], absPoints[absPoints.length - 1][1]];
  }, [width, height]);

  // Функция отрисовки
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка canvas
    ctx.clearRect(0, 0, width, height);

    // Рисуем основную трассу (ломаная линия)
    ctx.beginPath();
    trackPoints.forEach(([x, y], index) => {
      const absX = x * width;
      const absY = y * height;
      
      if (index === 0) {
        ctx.moveTo(absX, absY);
      } else {
        ctx.lineTo(absX, absY);
      }
    });
    
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'miter'; // Острые углы
    ctx.miterLimit = 10;
    ctx.stroke();

    // Рисуем пунктирную разметку
    ctx.beginPath();
    trackPoints.forEach(([x, y], index) => {
      const absX = x * width;
      const absY = y * height;
      
      if (index === 0) {
        ctx.moveTo(absX, absY);
      } else {
        ctx.lineTo(absX, absY);
      }
    });
    
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Рисуем маркеры точек трассы
    trackPoints.forEach(([x, y], index) => {
      const absX = x * width;
      const absY = y * height;
      
      ctx.beginPath();
      ctx.arc(absX, absY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = index === 0 ? '#27ae60' : index === trackPoints.length - 1 ? '#e74c3c' : '#3498db';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Рисуем бегуна
    const runnerPos = getPositionOnPolyline(trackPoints, Math.min(currentDistance, 1));
    
    // Тень под бегуном
    ctx.beginPath();
    ctx.arc(runnerPos[0], runnerPos[1] + 3, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    // Сам бегун
    ctx.beginPath();
    ctx.arc(runnerPos[0], runnerPos[1], 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Направление движения (треугольник)
    const direction = getRunnerDirection(trackPoints, currentDistance);
    if (direction) {
      ctx.save();
      ctx.translate(runnerPos[0], runnerPos[1]);
      ctx.rotate(direction);
      
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      ctx.restore();
    }

  }, [currentDistance, trackPoints, width, height, getPositionOnPolyline]);

  // Функция для вычисления направления движения
  const getRunnerDirection = useCallback((points: [number, number][], t: number): number => {
    if (points.length < 2) return 0;
    
    const absPoints = points.map(([x, y]) => [x * width, y * height]);
    const totalLength = calculateTotalLength([[0, 0], [400, 200]]);
    const targetLength = t * totalLength;
    
    let accumulatedLength = 0;
    for (let i = 0; i < absPoints.length - 1; i++) {
      const dx = absPoints[i + 1][0] - absPoints[i][0];
      const dy = absPoints[i + 1][1] - absPoints[i][1];
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (targetLength <= accumulatedLength + segmentLength) {
        return Math.atan2(dy, dx);
      }
      
      accumulatedLength += segmentLength;
    }
    
    // Направление к последней точке
    const lastSegment = absPoints.length - 2;
    const dx = absPoints[lastSegment + 1][0] - absPoints[lastSegment][0];
    const dy = absPoints[lastSegment + 1][1] - absPoints[lastSegment][1];
    return Math.atan2(dy, dx);
  }, [width, height]);

  // Вспомогательная функция для вычисления общей длины
  const calculateTotalLength = (points: [number, number][]): number => {
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    return totalLength;
  };

  useEffect(() => {
    draw();
    
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        display: 'block',
        background: '#ecf0f1',
        borderRadius: '4px',
        border: '1px solid #bdc3c7'
      }}
    />
  );
}

export default RaceView
