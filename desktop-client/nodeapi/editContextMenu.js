/**
 * 可编辑区域 / 选中文本的右键菜单。
 * 使用 Electron role，Windows 为 Ctrl、macOS 为 Command，系统会自动套对应快捷键。
 */
function buildEditMenuTemplate(params = {}) {
  const { isEditable, editFlags = {}, selectionText = '' } = params;
  const canCopy = Boolean(editFlags.canCopy || selectionText);

  if (isEditable) {
    return [
      { role: 'undo', label: '撤销', enabled: Boolean(editFlags.canUndo) },
      { role: 'redo', label: '重做', enabled: Boolean(editFlags.canRedo) },
      { type: 'separator' },
      { role: 'cut', label: '剪切', enabled: Boolean(editFlags.canCut) },
      { role: 'copy', label: '复制', enabled: canCopy },
      { role: 'paste', label: '粘贴', enabled: Boolean(editFlags.canPaste) },
      { role: 'delete', label: '删除', enabled: Boolean(editFlags.canDelete) },
      { type: 'separator' },
      { role: 'selectAll', label: '全选', enabled: Boolean(editFlags.canSelectAll) },
    ];
  }

  if (canCopy) {
    return [{ role: 'copy', label: '复制' }];
  }
  return [];
}

function attachEditContextMenu(contents) {
  if (!contents || contents.isDestroyed()) {
    return;
  }
  if (typeof contents.getType === 'function' && contents.getType() === 'devtools') {
    return;
  }
  contents.on('context-menu', (event, params) => {
    const template = buildEditMenuTemplate(params);
    if (!template.length) {
      return;
    }
    const { Menu, BrowserWindow } = require('electron');
    const menu = Menu.buildFromTemplate(template);
    const window = BrowserWindow.fromWebContents(contents);
    menu.popup({ window });
  });
}

module.exports = {
  attachEditContextMenu,
  buildEditMenuTemplate,
};
