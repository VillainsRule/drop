import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

class KeyStore {
    path = path.join(process.cwd(), 'keys.txt');
    keys = new Set<string>();

    constructor() {
        if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, '');
        for (const line of fs.readFileSync(this.path, 'utf-8').split('\n')) if (line.trim()) this.keys.add(line.trim());
    }

    generate(): string {
        const key = crypto.randomBytes(8).toString('hex');
        fs.appendFileSync(this.path, key + '\n');
        this.keys.add(key);
        return key;
    }

    has(key: string) {
        return this.keys.has(key);
    }
}

const keyStore = new KeyStore();
export default keyStore;
