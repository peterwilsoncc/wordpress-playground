import { createSpawnHandler, ProcessApi } from './create-spawn-handler';

describe('createSpawnHandler', () => {
	it('should create and execute a spawn handler', async () => {
		const command = 'testCommand';
		const testOut = 'testOut';
		const testErr = 'testErr';

		const program = vitest.fn((cmd: string, processApi: ProcessApi) => {
			expect(cmd).toBe(command);
			processApi.stdout(testOut);
			processApi.stderr(testErr);
			processApi.exit(0);
		});

		const spawnHandler = createSpawnHandler(program);
		const childProcess = spawnHandler(command);

		return new Promise((done) => {
			childProcess.stdout.on('data', (data: ArrayBuffer) => {
				const decodedData = new TextDecoder().decode(data);
				expect(decodedData).toBe(testOut);
				done(null);
			});

			childProcess.stderr.on('data', (data: ArrayBuffer) => {
				const decodedData = new TextDecoder().decode(data);
				expect(decodedData).toBe(testErr);
				done(null);
			});

			childProcess.on('exit', (code: number) => {
				expect(code).toBe(0);
				expect(program).toHaveBeenCalled();
			});
		});
	});
});
