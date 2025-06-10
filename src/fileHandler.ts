// fileHandler.ts
import * as mammoth from 'mammoth';
import { TFile, App } from 'obsidian';

/**
 * Класа за обраду различитих типова фајлова
 */
export default class FileHandler {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Главна метода за извлачење текста из фајла
     * @param file - Obsidian TFile објекат
     * @returns Обећање које разрешава у чист текст
     */
    public async getTextContent(file: TFile): Promise<string> {
        const extension = file.extension.toLowerCase();
        
        try {
            switch (extension) {
                case 'md':
                    return this.processMarkdown(await this.readFile(file));
                case 'txt':
                    return this.processText(await this.readFile(file));
                case 'docx':
                    return this.processDocx(await this.readBinaryFile(file));
                default:
                    throw new Error(`Неподржан формат фајла: ${extension}`);
            }
        } catch (error) {
            console.error('Грешка при обради фајла:', error);
            throw error;
        }
    }

    /**
     * Читање текстуалног фајла
     */
    private async readFile(file: TFile): Promise<string> {
        return await this.app.vault.read(file);
    }

    /**
     * Читање бинарног фајла
     */
    private async readBinaryFile(file: TFile): Promise<ArrayBuffer> {
        return await this.app.vault.readBinary(file);
    }

    /**
     * Обрада Markdown фајлова - уклањање форматирања
     */
    private processMarkdown(content: string): string {
        // Уклањање основних Markdown синтакси
        return content
            .replace(/(\*\*|__)(.*?)\1/g, '$2')         // **bold**
            .replace(/(\*|_)(.*?)\1/g, '$2')            // *italic*
            .replace(/~~(.*?)~~/g, '$1')                // ~~strikethrough~~
            .replace(/`(.*?)`/g, '$1')                  // `code`
            .replace(/^#+\s+(.*)$/gm, '$1')             // # заглавља
            .replace(/!\[(.*?)\]\(.*?\)/g, '$1')        // слике
            .replace(/\[(.*?)\]\(.*?\)/g, '$1');        // линкови
    }

    /**
     * Обрада обичног текста - минимална интервенција
     */
    private processText(content: string): string {
        return content;
    }

    /**
     * Конверзија .docx у чист текст користећи mammoth
     */
    private async processDocx(arrayBuffer: ArrayBuffer): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } catch (error) {
            console.error('Грешка при конверзији DOCX:', error);
            throw new Error('Неуспела конверзија DOCX фајла');
        }
    }

    /**
     * Помоћна метода за парсирање текста у токене за RSVP
     * (Овде ће се касније додати напреднија логика)
     */
    public parseTextForRSVP(content: string): string[] {
        return content
            .split(/(\s+|\n+|[,.;:!?"'„”()—\-])/)
            .filter(token => token.trim().length > 0);
    }
}