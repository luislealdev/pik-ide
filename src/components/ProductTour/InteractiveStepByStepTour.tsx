// src/components/ProductTour/InteractiveStepByStepTour.tsx
import { useCallback, useEffect, useState } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface InteractiveStepByStepTourProps {
  run: boolean;
  onTourEnd: () => void;
}

// Estado del tour para rastrear progreso
interface TourState {
  currentStep: number;
  isWaitingForUserAction: boolean;
  isBlocksPanelOpen: boolean;
  hasAddedRepetirBlock: boolean;
  hasAddedNumeroBlock: boolean;
  hasAddedMostrarBlock: boolean;
  hasAddedTextoBlock: boolean;
  hasExecutedCode: boolean;
}

const initialState: TourState = {
  currentStep: 0,
  isWaitingForUserAction: false,
  isBlocksPanelOpen: false,
  hasAddedRepetirBlock: false,
  hasAddedNumeroBlock: false,
  hasAddedMostrarBlock: false,
  hasAddedTextoBlock: false,
  hasExecutedCode: false,
};

export default function InteractiveStepByStepTour({ run, onTourEnd }: InteractiveStepByStepTourProps) {
  const [tourState, setTourState] = useState<TourState>(initialState);
  const [stepIndex, setStepIndex] = useState(0);

  // Resetear estado cuando se inicia el tour
  useEffect(() => {
    if (run) {
      setTourState(initialState);
      setStepIndex(0);
    }
  }, [run]);

  // Funciones para detectar acciones del usuario
  const checkBlocksPanelOpen = useCallback(() => {
    // Buscar si el panel de bloques está visible
    const panel = document.querySelector('[data-tour="blocks-panel"]') as HTMLElement;
    return panel && panel.offsetWidth > 0 && panel.offsetHeight > 0;
  }, []);

  const checkWorkspaceHasBlocks = useCallback(() => {
    // Verificar si hay bloques en el workspace usando selector DOM más directo
    const blocklyBlocks = document.querySelectorAll('.blocklyBlockCanvas .blocklyBlock');
    return blocklyBlocks.length > 0;
  }, []);

  const checkSpecificBlockExists = useCallback((blockType: string) => {
    console.log(`🔍 Buscando bloque: "${blockType}"`);
    
    // Método 1: Buscar por texto en los bloques visibles
    const blocks = document.querySelectorAll('.blocklyBlockCanvas .blocklyBlock');
    console.log(`🔍 Bloques encontrados en DOM:`, blocks.length);
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockText = block.textContent || '';
      console.log(`🔍 Bloque ${i} texto:`, blockText);
      
      if (blockText.includes(blockType)) {
        console.log(`✅ Encontrado bloque "${blockType}" por texto:`, blockText);
        return true;
      }
      
      // Buscar patrones más flexibles
      const patterns = {
        'repetir': ['repetir', 'repeat', 'para'],
        'mostrar': ['mostrar', 'show', 'print', 'imprimir'],
        'texto': ['texto', 'text', 'string', 'Hola', 'Hello'],
        'numero': ['numero', 'number', '5'],
        '5': ['5', 'cinco']
      };
      
      const blockPatterns = patterns[blockType as keyof typeof patterns] || [blockType];
      
      for (const pattern of blockPatterns) {
        if (blockText.toLowerCase().includes(pattern.toLowerCase())) {
          console.log(`✅ Encontrado bloque "${blockType}" por patrón "${pattern}":`, blockText);
          return true;
        }
      }
    }

    // Método 2: Buscar en el código PIK generado
    const codeView = document.querySelector('[data-tour="code-view"]');
    if (codeView) {
      const codeText = codeView.textContent || '';
      console.log(`🔍 Código PIK:`, codeText);
      
      if (codeText.includes(blockType)) {
        console.log(`✅ Encontrado bloque "${blockType}" en código PIK:`, codeText);
        return true;
      }
    }

    // Método 3: Buscar por selector más específico de Blockly
    const blocklyTexts = document.querySelectorAll('.blocklyText');
    console.log(`🔍 Textos de Blockly encontrados:`, blocklyTexts.length);
    
    for (let i = 0; i < blocklyTexts.length; i++) {
      const textElement = blocklyTexts[i];
      const text = textElement.textContent || '';
      console.log(`🔍 Texto Blockly ${i}:`, text);
      
      if (text.includes(blockType)) {
        console.log(`✅ Encontrado bloque "${blockType}" en texto Blockly:`, text);
        return true;
      }
    }

    console.log(`❌ No se encontró el bloque "${blockType}"`);
    return false;
  }, []);

  // Listener para acciones del usuario
  useEffect(() => {
    if (!run) return;

    const checkUserProgress = () => {
      const newState = { ...tourState };
      console.log(`🔄 Verificando progreso - Paso actual: ${tourState.currentStep}, Esperando: ${tourState.isWaitingForUserAction}`);

      // Paso 2: Verificar si se abrió el panel de bloques
      if (tourState.currentStep === 2 && !tourState.isBlocksPanelOpen) {
        const panelOpen = checkBlocksPanelOpen();
        console.log(`🔍 Panel abierto:`, panelOpen);
        
        if (panelOpen) {
          console.log('✅ Panel de bloques detectado como abierto');
          newState.isBlocksPanelOpen = true;
          newState.isWaitingForUserAction = false;
          console.log('🚀 Avanzando al paso 3 en 800ms...');
          setTimeout(() => {
            console.log('🎯 Ejecutando setStepIndex(3)');
            setStepIndex(3); // Avanzar al siguiente paso
            // También actualizar el estado interno
            setTourState(prev => ({ 
              ...prev, 
              currentStep: 3,
              isWaitingForUserAction: true // Esperando que agregue el bloque repetir
            }));
          }, 800);
        }
      }

      // Paso 3: Verificar si se agregó el bloque "repetir"
      if (tourState.currentStep === 3 && !tourState.hasAddedRepetirBlock) {
        console.log(`🔍 Verificando si existe bloque "repetir"...`);
        const hasRepetirBlock = checkSpecificBlockExists('repetir');
        console.log(`🔍 Resultado detección bloque "repetir":`, hasRepetirBlock);
        
        if (hasRepetirBlock) {
          console.log('✅ Bloque "repetir" detectado en workspace');
          newState.hasAddedRepetirBlock = true;
          newState.isWaitingForUserAction = false;
          setTimeout(() => {
            setStepIndex(4);
            setTourState(prev => ({ 
              ...prev, 
              currentStep: 4,
              isWaitingForUserAction: true
            }));
          }, 800);
        }
      }

      // Paso 4: Verificar si se agregó el número 5
      if (tourState.currentStep === 4 && !tourState.hasAddedNumeroBlock) {
        console.log(`🔍 Verificando si existe bloque "numero" con valor 5...`);
        const hasNumero5 = checkSpecificBlockExists('numero') || checkSpecificBlockExists('5');
        console.log(`🔍 Resultado detección número 5:`, hasNumero5);
        
        if (hasNumero5) {
          console.log('✅ Número 5 detectado en workspace');
          newState.hasAddedNumeroBlock = true;
          newState.isWaitingForUserAction = false;
          setTimeout(() => {
            setStepIndex(5);
            setTourState(prev => ({ 
              ...prev, 
              currentStep: 5,
              isWaitingForUserAction: true
            }));
          }, 800);
        }
      }

      // Paso 5: Verificar si se agregó el bloque "mostrar"
      if (tourState.currentStep === 5 && !tourState.hasAddedMostrarBlock) {
        console.log(`🔍 Verificando si existe bloque "mostrar"...`);
        const hasMostrarBlock = checkSpecificBlockExists('mostrar');
        console.log(`🔍 Resultado detección bloque "mostrar":`, hasMostrarBlock);
        
        if (hasMostrarBlock) {
          console.log('✅ Bloque "mostrar" detectado en workspace');
          newState.hasAddedMostrarBlock = true;
          newState.isWaitingForUserAction = false;
          setTimeout(() => {
            setStepIndex(6);
            setTourState(prev => ({ 
              ...prev, 
              currentStep: 6,
              isWaitingForUserAction: true
            }));
          }, 800);
        }
      }

      // Paso 6: Verificar si se agregó el bloque "texto"
      if (tourState.currentStep === 6 && !tourState.hasAddedTextoBlock) {
        console.log(`🔍 Verificando si existe bloque "texto"...`);
        const hasTextoBlock = checkSpecificBlockExists('texto') || checkSpecificBlockExists('Hola mundo');
        console.log(`🔍 Resultado detección bloque "texto":`, hasTextoBlock);
        
        if (hasTextoBlock) {
          console.log('✅ Bloque "texto" detectado en workspace');
          newState.hasAddedTextoBlock = true;
          newState.isWaitingForUserAction = false;
          setTimeout(() => {
            setStepIndex(7);
            setTourState(prev => ({ 
              ...prev, 
              currentStep: 7,
              isWaitingForUserAction: false // Ya no necesita esperar, puede ejecutar
            }));
          }, 800);
        }
      }

      // Actualizar estado si cambió
      if (JSON.stringify(newState) !== JSON.stringify(tourState)) {
        console.log('🔄 Actualizando estado del tour:', newState);
        setTourState(newState);
      }
    };

    // Verificar progreso cada 500ms
    const intervalId = setInterval(checkUserProgress, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [run, tourState, checkBlocksPanelOpen, checkWorkspaceHasBlocks, checkSpecificBlockExists]);

  const createSteps = useCallback((): Step[] => {
    const isWaiting = tourState.isWaitingForUserAction;
    
    return [
      {
        target: 'body',
        content: (
          <div>
            <h2 className="text-xl font-bold mb-2">¡Bienvenido a PIK Visual! 🎉</h2>
            <p>Te voy a enseñar paso a paso cómo crear tu primer programa. Haremos un "¡Hola Mundo!" que se repita 5 veces.</p>
            <p className="mt-2 text-sm text-gray-600">Este tutorial es completamente interactivo - debes seguir cada paso.</p>
          </div>
        ),
        placement: 'center',
      },
      {
        target: 'h1',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">PIK Visual</h3>
            <p>Esta herramienta te permite programar usando bloques visuales, similar a Scratch.</p>
            <p className="mt-2 text-sm font-medium">¡Empecemos con tu primer programa!</p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '[data-tour="blocks-button"]',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">Paso 1: Abrir la Paleta de Bloques 🎨</h3>
            <p className="mb-2"><strong>👆 HAZ CLIC en el botón "☰ Bloques"</strong></p>
            {isWaiting && tourState.currentStep === 2 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que hagas clic en "☰ Bloques"...
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  El tutorial continuará automáticamente cuando abras la paleta.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Esto abrirá todas las categorías de bloques disponibles.</p>
            )}
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="blocks-panel"]',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">Paso 2: Buscar el bloque "repetir" 🔄</h3>
            <p className="mb-2">¡Perfecto! Ahora busca la categoría <strong>"🧠 Control de flujo"</strong></p>
            <p className="mb-2"><strong>👆 HAZ CLIC en el bloque "🧱 repetir"</strong></p>
            {isWaiting && tourState.currentStep === 3 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que agregues el bloque "repetir"...
                </p>
                <button
                  onClick={() => {
                    console.log('🧪 Prueba manual de detección:');
                    const result = checkSpecificBlockExists('repetir');
                    console.log('🧪 Resultado:', result);
                    if (result) {
                      setTourState(prev => ({ 
                        ...prev, 
                        hasAddedRepetirBlock: true,
                        isWaitingForUserAction: false 
                      }));
                      setTimeout(() => setStepIndex(4), 500);
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  🧪 Test Detección
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Este bloque nos permitirá repetir acciones.</p>
            )}
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
            <p>¡Excelente! Ahora necesitas decirle cuántas veces repetir.</p>
            <p className="mb-2">Busca <strong>"🔢 Valores"</strong> y haz clic en <strong>"🧱 numero"</strong></p>
            <p className="mb-2">Luego <strong>conecta</strong> el número donde dice "veces" y <strong>cámbialo a 5</strong></p>
            {isWaiting && tourState.currentStep === 4 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que agregues el número 5...
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">El número 5 indica cuántas veces repetir.</p>
            )}
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="blocks-editor"]',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">Paso 4: Agregar "mostrar" 🗣️</h3>
            <p>Ahora vamos a decir qué queremos mostrar.</p>
            <p className="mb-2">Ve a <strong>"⚙️ Acciones"</strong> y haz clic en <strong>"🧱 mostrar"</strong></p>
            <p className="mb-2"><strong>Conecta</strong> el bloque mostrar DENTRO del bloque repetir</p>
            {isWaiting && tourState.currentStep === 5 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que agregues el bloque "mostrar"...
                </p>
                <button
                  onClick={() => {
                    console.log('🧪 Prueba manual de detección "mostrar":');
                    const result = checkSpecificBlockExists('mostrar');
                    console.log('🧪 Resultado mostrar:', result);
                    if (result) {
                      setTourState(prev => ({ 
                        ...prev, 
                        hasAddedMostrarBlock: true,
                        isWaitingForUserAction: false 
                      }));
                      setTimeout(() => setStepIndex(6), 500);
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  🧪 Test Mostrar
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">El bloque mostrar imprimirá el texto.</p>
            )}
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="blocks-editor"]',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">Paso 5: Agregar el texto 📝</h3>
            <p>Por último, vamos a decir qué texto mostrar.</p>
            <p className="mb-2">Ve a <strong>"🔢 Valores"</strong> y haz clic en <strong>"🧱 texto"</strong></p>
            <p className="mb-2">Conecta el texto al bloque mostrar y cambia el texto a <strong>"¡Hola Mundo!"</strong></p>
            {isWaiting && tourState.currentStep === 6 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que agregues el texto "¡Hola Mundo!"...
                </p>
                <button
                  onClick={() => {
                    console.log('🧪 Prueba manual de detección "texto":');
                    const result = checkSpecificBlockExists('texto') || checkSpecificBlockExists('Hola');
                    console.log('🧪 Resultado texto:', result);
                    if (result) {
                      setTourState(prev => ({ 
                        ...prev, 
                        hasAddedTextoBlock: true,
                        isWaitingForUserAction: false 
                      }));
                      setTimeout(() => setStepIndex(7), 500);
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  🧪 Test Texto
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">El texto será lo que se imprima 5 veces.</p>
            )}
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="run-button"]',
        content: (
          <div>
            <h3 className="text-lg font-bold mb-2">Paso 6: ¡Ejecutar! ▶️</h3>
            <p className="mb-2"><strong>👆 HAZ CLIC en "Ejecutar"</strong> para ver tu programa funcionar</p>
            {isWaiting && tourState.currentStep === 7 ? (
              <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Esperando que ejecutes el programa...
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">¡Este es el momento más emocionante!</p>
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
            <p>¡Has creado tu primer programa! Deberías ver "¡Hola Mundo!" 5 veces en la consola.</p>
            <p className="mt-2">Ahora ya sabes cómo:</p>
            <ul className="mt-2 text-sm list-disc list-inside space-y-1">
              <li>✅ Abrir la paleta de bloques</li>
              <li>✅ Agregar y conectar bloques</li>
              <li>✅ Crear bucles con "repetir"</li>
              <li>✅ Ejecutar tu programa</li>
            </ul>
            <p className="mt-3 text-sm font-bold text-green-600">¡Experimenta con otros bloques!</p>
          </div>
        ),
        placement: 'left',
      },
    ];
  }, [tourState, checkSpecificBlockExists]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, index, type } = data;

      console.log('🎯 Tour callback:', { status, action, index, type });

      // Sincronizar estado con el índice actual de Joyride
      if (type === 'tooltip' && tourState.currentStep !== index) {
        console.log(`🔄 Sincronizando estado: paso ${tourState.currentStep} → ${index}`);
        setTourState(prev => ({ 
          ...prev, 
          currentStep: index,
          // Mantener isWaitingForUserAction para pasos específicos
          isWaitingForUserAction: [2, 3, 4, 5, 6, 7].includes(index) ? prev.isWaitingForUserAction : false
        }));
      }

      // Si el tour termina o se omite
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        onTourEnd();
        return;
      }

      // Manejar navegación manual solo si no estamos esperando una acción
      if (!tourState.isWaitingForUserAction) {
        if (action === ACTIONS.NEXT) {
          const newStep = Math.min(index + 1, createSteps().length - 1);
          setStepIndex(newStep);
          
          // Marcar como esperando acción para pasos específicos
          if ([2, 3, 4, 5, 6, 7].includes(newStep)) { // Pasos que requieren acción del usuario
            console.log(`🎯 Paso ${newStep}: Esperando acción del usuario`);
            setTourState(prev => ({ 
              ...prev, 
              currentStep: newStep,
              isWaitingForUserAction: true 
            }));
          } else {
            setTourState(prev => ({ ...prev, currentStep: newStep }));
          }
        } else if (action === ACTIONS.PREV) {
          const newStep = Math.max(index - 1, 0);
          setStepIndex(newStep);
          setTourState(prev => ({ 
            ...prev, 
            currentStep: newStep,
            isWaitingForUserAction: false 
          }));
        }
      }
    },
    [onTourEnd, tourState.isWaitingForUserAction, tourState.currentStep, createSteps]
  );

  return (
    <Joyride
      steps={createSteps()}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      disableScrolling
      styles={{
        options: {
          primaryColor: tourState.isWaitingForUserAction ? '#f59e0b' : '#3b82f6',
          width: 420,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 16,
          padding: 24,
          border: tourState.isWaitingForUserAction ? '2px solid #f59e0b' : '2px solid #3b82f6',
          boxShadow: tourState.isWaitingForUserAction 
            ? '0 20px 40px rgba(245, 158, 11, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)' 
            : '0 20px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        },
        tooltipContent: {
          padding: '4px 8px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: '1.6',
        },
        buttonNext: {
          backgroundColor: tourState.isWaitingForUserAction ? '#9ca3af' : '#3b82f6',
          borderRadius: 10,
          padding: '10px 20px',
          cursor: tourState.isWaitingForUserAction ? 'not-allowed' : 'pointer',
          opacity: tourState.isWaitingForUserAction ? 0.6 : 1,
          fontWeight: '600',
          fontSize: '14px',
          border: 'none',
          transition: 'all 0.2s ease',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 8,
          opacity: tourState.isWaitingForUserAction ? 0.5 : 1,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: '⬅️ Anterior',
        close: '❌ Cerrar',
        last: '🎉 ¡Finalizar!',
        next: tourState.isWaitingForUserAction ? '⏳ Esperando...' : '➡️ Siguiente',
        skip: '⏭️ Saltar tour',
      }}
    />
  );
}