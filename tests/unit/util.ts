import path from 'path';
import fs from 'fs';

export const readFile = (filename: string): string => fs.readFileSync(
	path.join(__dirname, filename), 'utf-8'
);
