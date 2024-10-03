import { getDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');

    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // Load data from IndexedDB or fallback
    getDb().then((data) => {
      const content = data || localData || header;
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(content);
    });

    // Save editor content to localStorage on change
    this.editor.on('change', () => {
      const content = this.editor.getValue();
      localStorage.setItem('content', content);
    });

    // Save editor content to IndexedDB when the editor loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(this.editor.getValue());
    });
  }
}
