// src/utils/createExampleProgram.ts
import * as Blockly from "blockly";

export function createExampleProgram(workspace: Blockly.WorkspaceSvg) {
  // Limpiar workspace
  workspace.clear();

  // Crear bloque "repetir"
  const repetirBlock = workspace.newBlock('repetir');
  repetirBlock.initSvg();
  repetirBlock.render();
  repetirBlock.moveBy(100, 100);

  // Crear bloque "numero" con valor 5
  const numeroBlock = workspace.newBlock('numero');
  numeroBlock.initSvg();
  numeroBlock.render();
  numeroBlock.setFieldValue(5, 'NUM');
  numeroBlock.moveBy(200, 100);

  // Conectar numero al input VECES del repetir
  const vecesInput = repetirBlock.getInput('VECES');
  const vecesConnection = vecesInput?.connection;
  const numeroConnection = numeroBlock.outputConnection;
  if (vecesConnection && numeroConnection) {
    vecesConnection.connect(numeroConnection);
  }

  // Crear bloque "mostrar"
  const mostrarBlock = workspace.newBlock('mostrar');
  mostrarBlock.initSvg();
  mostrarBlock.render();
  mostrarBlock.moveBy(100, 180);

  // Crear bloque "texto" con "¡Hola Mundo!"
  const textoBlock = workspace.newBlock('texto');
  textoBlock.initSvg();
  textoBlock.render();
  textoBlock.setFieldValue('¡Hola Mundo!', 'TEXT');
  textoBlock.moveBy(250, 180);

  // Conectar texto al input VALOR del mostrar
  const valorInput = mostrarBlock.getInput('VALOR');
  const valorConnection = valorInput?.connection;
  const textoConnection = textoBlock.outputConnection;
  if (valorConnection && textoConnection) {
    valorConnection.connect(textoConnection);
  }

  // Conectar mostrar al statement HACER del repetir
  const hacerInput = repetirBlock.getInput('HACER');
  const hacerConnection = hacerInput?.connection;
  const mostrarPrevious = mostrarBlock.previousConnection;
  if (hacerConnection && mostrarPrevious) {
    hacerConnection.connect(mostrarPrevious);
  }

  // Centrar el workspace
  setTimeout(() => {
    const metrics = workspace.getMetrics();
    if (metrics) {
      const centerX = metrics.viewWidth / 2;
      const centerY = metrics.viewHeight / 2;
      workspace.zoom(centerX, centerY, 0.8);
      workspace.scroll(
        (metrics.contentWidth - metrics.viewWidth) / 2,
        (metrics.contentHeight - metrics.viewHeight) / 2
      );
    }
  }, 100);
}