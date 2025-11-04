// src/components/ProductTour/ProductTour.tsx
import { useCallback } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface ProductTourProps {
  run: boolean;
  onTourEnd: () => void;
  onCreateExample: () => void;
}

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">¡Bienvenido a PIK Visual! 🎉</h2>
        <p>Te vamos a mostrar las principales características de esta herramienta para aprender programación con bloques visuales.</p>
        <p className="mt-2 text-sm text-gray-600">Duración aproximada: 2 minutos</p>
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
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Editor de Bloques 🧩</h3>
        <p>Aquí es donde construyes tus programas arrastrando bloques.</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li>Haz clic en "☰ Bloques" para ver la paleta</li>
          <li>Arrastra bloques al área de trabajo</li>
          <li>Conéctalos para crear programas</li>
        </ul>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="blocks-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paleta de Bloques 🎨</h3>
        <p>Haz clic aquí para abrir la paleta con todos los bloques disponibles:</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li><strong>Acciones:</strong> mostrar, preguntar, guardar</li>
          <li><strong>Control de flujo:</strong> si, para, repetir</li>
          <li><strong>Valores:</strong> números, texto, variables</li>
          <li>¡Y muchos más!</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="code-view"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Código PIK 📝</h3>
        <p>Aquí puedes ver el código que generan tus bloques en el lenguaje PIK.</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li>Se actualiza automáticamente</li>
          <li>Puedes alternar al modo editor</li>
          <li>Exportar/importar archivos .pik</li>
        </ul>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="controls"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Controles 🎮</h3>
        <p>Gestiona tu código con estos controles:</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li><strong>Modo Editor:</strong> Cambia entre bloques y texto</li>
          <li><strong>Guardar:</strong> Descarga tu código como archivo .pik</li>
          <li><strong>Cargar:</strong> Importa archivos .pik existentes</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="run-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Ejecutar Código ▶️</h3>
        <p>¡El momento más emocionante! Aquí ejecutas tu programa y ves los resultados.</p>
        <p className="mt-2 text-sm text-gray-600">En el siguiente paso crearemos un programa de ejemplo.</p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="console"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Consola de Salida 🖥️</h3>
        <p>Aquí aparecen los resultados de tu programa:</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li>Mensajes mostrados por tu código</li>
          <li>Errores si algo sale mal</li>
          <li>Estado de ejecución</li>
        </ul>
        <p className="mt-2 font-medium">¡Ahora vamos a crear un programa de ejemplo!</p>
      </div>
    ),
    placement: 'left',
  },
];

export default function ProductTour({ run, onTourEnd, onCreateExample }: ProductTourProps) {
  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, index } = data;

      // Si llegamos al paso 7 (consola), creamos el ejemplo
      if (index === 7 && action === 'next') {
        onCreateExample();
      }

      // Si el tour termina o se omite
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        onTourEnd();
      }
    },
    [onTourEnd, onCreateExample]
  );

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          width: 400,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: '0 8px',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 8,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: 'Anterior',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Omitir tour',
      }}
    />
  );
}