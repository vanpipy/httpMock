import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { cp, mkdtemp, writeFile } from 'node:fs/promises';

export const getFixturePkgPath = (fixtureName: string): string => {
  return resolve(__dirname, './fixtures', fixtureName);
};

export const setFixturePkg = async (fixtureName: string, to: string): Promise<void> => {
  process.stdout.write(`> Set ${fixtureName} to ${to}\n`);
  const fixturePath = getFixturePkgPath(fixtureName);
  await cp(fixturePath, to, { recursive: true, force: true });
};

export const createTmpDir = async (prefix = 'demo-'): Promise<string> => {
  const tempDir = await mkdtemp(join(tmpdir(), prefix));
  process.stdout.write(`> Create temp directory ${tempDir}\n`);
  return tempDir;
};

export const createTmpFile = async (dir: string, filename: string, content?: string): Promise<string> => {
  const filePath = resolve(dir, filename);
  await writeFile(filePath, content ?? '');
  process.stdout.write(`> Create temp file ${filePath}\n`);
  if (typeof content === 'string') {
    process.stdout.write(`> Write content to ${filePath}\n`);
    process.stdout.write(`> \n${content}\n`);
  }
  return filePath;
};
