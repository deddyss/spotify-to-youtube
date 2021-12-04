import path from 'path';
import fs from 'fs';

export const readFile = (filename: string): string => fs.readFileSync(
	path.join(__dirname, filename), 'utf-8'
);

export const readMockFile = (filename: string): string => readFile(`mock/${filename}`);

export const mockOffsetParent = (): void => {
	const isNullOrUndefined = (obj: any) => obj === null|| obj === undefined;

	Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
		get() {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			let element = this;
			while (!isNullOrUndefined(element) &&
				(isNullOrUndefined(element.style) ||
				isNullOrUndefined(element.style.display) ||
				element.style.display.toLowerCase() !== 'none')) {
				element = element.parentNode;
			}

			if (!isNullOrUndefined(element)) {
				return null;
			}

			if (!isNullOrUndefined(this.style) && !isNullOrUndefined(this.style.position) && this.style.position.toLowerCase() === 'fixed') {
				return null;
			}

			if (this.tagName.toLowerCase() === 'html' || this.tagName.toLowerCase() === 'body') {
				return null;
			}

			return this.parentNode;
		}
	});
};

export const mockInnerText = (): void => {
	Object.defineProperty(Node.prototype, 'innerText', {
		get() {
			return (this.textContent as string | null)?.trim() ?? '';
		}
	});
};
