// src/features/Panel/BlockButton.tsx
import * as Blockly from "blockly";

export default function BlockButton({
  tipo,
  workspace,
}: {
  tipo: string;
  workspace: Blockly.WorkspaceSvg;
}) {
  const handleClick = () => {
    const block = workspace.newBlock(tipo);
    block.initSvg();
    block.render();
    block.moveBy(40, 40);
  };

  const handleDragStart = (e: React.DragEvent) => {
    const block = workspace.newBlock(tipo);
    block.initSvg();
    block.render();
    const xml = Blockly.Xml.blockToDom(block);
    const xmlText = Blockly.Xml.domToText(xml);
    e.dataTransfer.setData("text/plain", xmlText);
    block.dispose(false);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      data-block-type={tipo}
      className="cursor-grab px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-sm mx-auto"
    >
      🧱 {tipo}
    </div>
  );
}
