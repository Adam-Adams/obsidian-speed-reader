// src/main.ts
import { Plugin } from 'obsidian';
import FileHandler from './fileHandler';
export default class SpeedReaderPlugin extends Plugin {
    async onload() {
        console.log('Speed Reader plugin loaded');
        this.testFileHandler();
    }
    async testFileHandler() {
        setTimeout(async () => {
            const fileHandler = new FileHandler(this.app);
            const files = this.app.vault.getFiles();
            const testFile = files.find((f) => ['md', 'txt', 'docx'].includes(f.extension.toLowerCase()));
            if (testFile) {
                try {
                    const content = await fileHandler.getTextContent(testFile);
                    const tokens = fileHandler.parseTextForRSVP(content);
                    console.log('Тест успешан!');
                    console.log('Фајл:', testFile.name);
                    console.log('Број токена:', tokens.length);
                    console.log('Првих 10 токена:', tokens.slice(0, 10));
                }
                catch (error) {
                    console.error('Тест неуспешан:', error);
                }
            }
            else {
                console.warn('Нема тест фајлова за проверу!');
            }
        }, 2000);
    }
}
