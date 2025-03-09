import { exec, ExecOptions } from 'child_process';

export const execAsync = async function (
  command: string,
  options?: ExecOptions,
): Promise<{
  stdout: string;
  stderr: string;
}> {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        if (stdout) {
          error.message += '\nstdout: ' + stdout;
          error.stdout = stdout as string;
        }
        if (stderr) {
          error.message += '\nstderr: ' + stderr;
          error.stderr = stderr as string;
        }
        reject(error);
        return;
      }

      resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
    });
  });
};
