// src/hooks/useInteractiveTour.ts
import { useState, useCallback, useRef } from 'react';

export interface TourStep {
  id: string;
  target: string;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  waitForAction?: boolean;
  actionSelector?: string;
  actionType?: 'click' | 'change' | 'custom';
  disableBeacon?: boolean;
}

export function useInteractiveTour(steps: TourStep[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const actionListenerRef = useRef<(() => void) | null>(null);

  const currentStep = steps[currentStepIndex];

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setTourActive(true);
    setIsWaitingForAction(false);
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
    setIsWaitingForAction(false);
    setCurrentStepIndex(0);
    // Limpiar listener si existe
    if (actionListenerRef.current) {
      actionListenerRef.current();
      actionListenerRef.current = null;
    }
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsWaitingForAction(false);
      
      // Limpiar listener anterior
      if (actionListenerRef.current) {
        actionListenerRef.current();
        actionListenerRef.current = null;
      }
    } else {
      endTour();
    }
  }, [currentStepIndex, steps.length, endTour]);

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsWaitingForAction(false);
      
      // Limpiar listener anterior
      if (actionListenerRef.current) {
        actionListenerRef.current();
        actionListenerRef.current = null;
      }
    }
  }, [currentStepIndex]);

  const waitForUserAction = useCallback((selector: string, actionType: 'click' | 'change' = 'click') => {
    setIsWaitingForAction(true);
    
    const handleAction = () => {
      setIsWaitingForAction(false);
      // Pequeño delay para que el usuario vea la acción completada
      setTimeout(goToNextStep, 500);
    };

    const element = document.querySelector(selector);
    if (element) {
      const removeListener = () => {
        element.removeEventListener(actionType, handleAction);
      };
      
      element.addEventListener(actionType, handleAction, { once: true });
      actionListenerRef.current = removeListener;
    }
  }, [goToNextStep]);

  return {
    currentStepIndex,
    currentStep,
    isWaitingForAction,
    tourActive,
    startTour,
    endTour,
    goToNextStep,
    goToPrevStep,
    waitForUserAction,
  };
}