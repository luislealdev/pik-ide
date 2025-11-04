// src/components/ProductTour/InteractiveProductTour.tsx
import { useCallback, useEffect } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface InteractiveProductTourProps {
  run: boolean;
  onTourEnd: () => void;
  currentStepIndex: number;
  onStepChange: (direction: 'next' | 'prev') => void;
  isWaitingForAction: boolean;
  onWaitForAction: (selector: string, actionType?: 'click' | 'change') => void;
}

const createSteps = (isWaitingForAction: boolean, currentStepIndex: number): Step[] => [
  {
    target: 'body',
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">¡Bienvenido a PIK Visual! 🎉</h2>
        <p>Te voy a enseñar paso a paso cómo crear tu primer programa. Haremos un "¡Hola Mundo!" que se repita 5 veces.</p>
        <p className="mt-2 text-sm text-gray-600">Duración aproximada: 5 minutos</p>
      </div>
    ),
    placement: 'center',
  },
  {
    target: 'h1',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">PIK Visual</h3>
        <p>Esta es una herramienta educativa que te permite aprender programación de forma visual usando bloques, similar a Scratch.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="blocks-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 1: Abrir la Paleta 🎨</h3>
        <p><strong>👆 Haz clic en "☰ Bloques"</strong> para abrir la paleta con todos los bloques disponibles.</p>
        <p className="mt-2 text-sm text-gray-600">
          {isWaitingForAction && currentStepIndex === 2 
            ? "⏳ Esperando que hagas clic en el botón..." 
            : "Esto te mostrará las categorías de bloques que puedes usar."
          }
        </p>
        {isWaitingForAction && currentStepIndex === 2 && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm font-medium text-yellow-800">
              ⚡ Haz clic en el botón "☰ Bloques" para continuar
            </p>
          </div>
        )}
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 2: Buscar el bloque "repetir" 🔄</h3>
        <p>En la paleta que acabas de abrir, busca la categoría <strong>"🧠 Control de flujo"</strong> y encuentra el bloque <strong>"🧱 repetir"</strong>.</p>
        <p className="mt-2"><strong>👆 Haz clic</strong> en el bloque "repetir" para agregarlo al workspace.</p>
        <p className="mt-2 text-sm text-gray-600">Este bloque nos permitirá repetir acciones varias veces.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 3: Agregar el número 5 🔢</h3>
        <p>Ahora necesitas decirle al bloque "repetir" cuántas veces debe repetirse. Ve a la categoría <strong>"🔢 Valores"</strong> y haz clic en el bloque <strong>"🧱 numero"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque número en el espacio que dice "veces" del bloque repetir.</p>
        <p className="mt-2"><strong>✏️ Cambia</strong> el valor del número a <strong>5</strong> haciendo clic en él.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 4: Agregar bloque "mostrar" 🗣️</h3>
        <p>Ahora vamos a decirle qué queremos mostrar. Ve a la categoría <strong>"⚙️ Acciones"</strong> y haz clic en el bloque <strong>"🧱 mostrar"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque "mostrar" DENTRO del bloque "repetir" (en el área que aparece después de "veces:").</p>
        <p className="mt-2 text-sm text-gray-600">Esto hará que la acción "mostrar" se repita 5 veces.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 5: Agregar el texto "¡Hola Mundo!" 📝</h3>
        <p>Por último, necesitamos decirle qué texto mostrar. Ve a la categoría <strong>"🔢 Valores"</strong> y haz clic en el bloque <strong>"🧱 texto"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque "texto" al bloque "mostrar".</p>
        <p className="mt-2"><strong>✏️ Cambia</strong> el texto a <strong>"¡Hola Mundo!"</strong> haciendo clic en él.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="code-view"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">¡Mira tu código! 👀</h3>
        <p>¡Excelente! Fíjate cómo tus bloques se han convertido automáticamente en código PIK.</p>
        <p className="mt-2">Deberías ver algo como:</p>
        <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
{`repetir 5 veces:
  mostrar "¡Hola Mundo!"`}
        </pre>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="run-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 6: ¡Ejecutar el programa! ▶️</h3>
        <p><strong>👆 Haz clic en "Ejecutar"</strong> para ver tu programa en acción.</p>
        <p className="mt-2 text-sm text-gray-600">
          {isWaitingForAction && currentStepIndex === 8
            ? "⏳ Esperando que ejecutes el programa..."
            : "¡Este es el momento más emocionante!"
          }
        </p>
        {isWaitingForAction && currentStepIndex === 8 && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm font-medium text-yellow-800">
              ⚡ Haz clic en "Ejecutar" para continuar
            </p>
          </div>
        )}
      </div>
    ),
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '[data-tour="console"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">¡Felicidades! 🎉</h3>
        <p>¡Has creado tu primer programa! Deberías ver "¡Hola Mundo!" apareciendo 5 veces en la consola.</p>
        <p className="mt-2">Ya sabes los conceptos básicos:</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li>📦 Usar bloques de la paleta</li>
          <li>🔗 Conectar bloques entre sí</li>
          <li>▶️ Ejecutar tu programa</li>
          <li>👀 Ver los resultados</li>
        </ul>
        <p className="mt-2 text-sm font-medium">¡Ahora puedes experimentar con otros bloques!</p>
      </div>
    ),
    placement: 'left',
  },
];

export default function InteractiveProductTour({ 
  run, 
  onTourEnd, 
  currentStepIndex, 
  onStepChange, 
  isWaitingForAction,
  onWaitForAction 
}: InteractiveProductTourProps) {
  // Configurar las acciones que requieren interacción del usuario
  useEffect(() => {
    if (!run) return;

    if (currentStepIndex === 2) { // Paso: hacer clic en "Bloques"
      onWaitForAction('[data-tour="blocks-button"]', 'click');
    } else if (currentStepIndex === 8) { // Paso: hacer clic en "Ejecutar"
      onWaitForAction('[data-tour="run-button"]', 'click');
    }
  }, [currentStepIndex, run, onWaitForAction]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action } = data;

      // Si el tour termina o se omite
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        onTourEnd();
        return;
      }

      // Solo permitir navegación si no estamos esperando una acción
      if (!isWaitingForAction) {
        if (action === ACTIONS.NEXT) {
          onStepChange('next');
        } else if (action === ACTIONS.PREV) {
          onStepChange('prev');
        }
      }
    },
    [onTourEnd, isWaitingForAction, onStepChange]
  );

  const steps = createSteps(isWaitingForAction, currentStepIndex);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={currentStepIndex}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      disableScrolling={true}
      styles={{
        options: {
          primaryColor: isWaitingForAction ? '#f59e0b' : '#3b82f6',
          width: 400,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
          border: isWaitingForAction ? '2px solid #f59e0b' : '1px solid #e5e7eb',
        },
        tooltipContent: {
          padding: '0 8px',
        },
        buttonNext: {
          backgroundColor: isWaitingForAction ? '#9ca3af' : '#3b82f6',
          borderRadius: 8,
          padding: '8px 16px',
          cursor: isWaitingForAction ? 'not-allowed' : 'pointer',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 8,
          opacity: isWaitingForAction ? 0.5 : 1,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: '⬅️ Anterior',
        close: '❌ Cerrar',
        last: '🎉 ¡Finalizar!',
        next: isWaitingForAction ? '⏳ Esperando...' : '➡️ Siguiente',
        skip: '⏭️ Saltar tour',
      }}
    />
  );
}