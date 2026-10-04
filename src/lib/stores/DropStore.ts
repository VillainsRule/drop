import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export const validId = (id: string) => /^[a-zA-Z0-9_-]{1,64}$/.test(id);

class DropStore {
    path = path.join(process.cwd(), 'drops');

    constructor() {
        if (!fs.existsSync(this.path)) fs.mkdirSync(this.path, { recursive: true });
    }

    exists(id: string): boolean {
        return validId(id) && fs.existsSync(path.join(this.path, id));
    }

    write(id: string, content: string, overwrite: boolean): boolean {
        try {
            fs.writeFileSync(path.join(this.path, id), content, { flag: overwrite ? 'w' : 'wx' });
            return true;
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === 'EEXIST') return false;
            throw err;
        }
    }

    create(content: string, customId?: string, override = false): string | null {
        if (customId !== undefined) {
            if (!validId(customId)) return null;
            return this.write(customId, content, override) ? customId : null;
        }

        let length = 5;
        for (let attempt = 1; ; attempt++) {
            let id = '';
            for (let i = 0; i < length; i++) id += ALPHABET[crypto.randomInt(ALPHABET.length)];
            if (this.write(id, content, false)) return id;
            if (attempt % 10 === 0) length++;
        }
    }

    get(id: string): string | null {
        if (!validId(id)) return null;
        const filePath = path.join(this.path, id);
        if (!fs.existsSync(filePath)) return null;
        return fs.readFileSync(filePath, 'utf-8');
    }
}

const dropStore = new DropStore();
export default dropStore;