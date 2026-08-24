const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildEditMenuTemplate } = require('./editContextMenu');

test('editable field includes copy and paste', () => {
  const template = buildEditMenuTemplate({
    isEditable: true,
    editFlags: {
      canUndo: true,
      canRedo: false,
      canCut: true,
      canCopy: true,
      canPaste: true,
      canDelete: true,
      canSelectAll: true,
    },
    selectionText: 'https://example.com',
  });
  const roles = template.filter((item) => item.role).map((item) => item.role);
  assert.deepEqual(roles, ['undo', 'redo', 'cut', 'copy', 'paste', 'delete', 'selectAll']);
  assert.equal(template.find((item) => item.role === 'copy').label, '复制');
  assert.equal(template.find((item) => item.role === 'paste').label, '粘贴');
});

test('non-editable selection only offers copy', () => {
  const template = buildEditMenuTemplate({
    isEditable: false,
    selectionText: 'selected',
  });
  assert.deepEqual(template, [{ role: 'copy', label: '复制' }]);
});

test('empty non-editable area has no menu', () => {
  const template = buildEditMenuTemplate({
    isEditable: false,
    selectionText: '',
    editFlags: {},
  });
  assert.deepEqual(template, []);
});
