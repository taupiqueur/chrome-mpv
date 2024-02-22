/**
 * @typedef {object} Command
 * @property {string} command - The command name.
 * @property {string[]} [args=[]] - The list of arguments passed to the command.
 * @property {Object<string, ?string>} [env={}] - The list of environment variables passed to the command.
 * @property {?string} [input=null] - Configures *stdin* data.
 * @property {boolean} [output=false] - Captures *stdout* stream.
 * @property {boolean} [error=false] - Captures *stderr* stream.
 * @property {?string} [dir=null] - Sets the working directory for the child process.
 */

/**
 * @typedef {object} CommandResult
 * @property {number} status - The exit code of the process.
 * @property {string} output - Captured *stdout* stream.
 * @property {string} error - Captured *stderr* stream.
 */
