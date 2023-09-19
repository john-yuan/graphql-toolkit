export const factoryTemplate = `
export default function %NAME%<Options = any, GraphQLError = $GraphQLError>(
  request: (
    /**
     * Operation type.
     */
    type: 'query' | 'mutation',

    /**
     * - If \`name\` is \`null\`, means that the caller is \`query()\` or \`mutation()\`.
     * - If \`name\` is a string, means that the caller is \`queries.xxx()\` or \`mutations.xxx()\`.
     */
    name: string | null,

    /**
     * - If \`name\` is \`null\`, \`payload\` is the first parameter of \`query()\` or \`mutation()\`.
     * - If \`name\` is a string, \`payload\` is the first parameter of \`queries.xxx()\` or \`mutations.xxx()\`.
     */
    payload: any,

    /**
     * Custom options.
     */
    options?: Options
  ) => Promise<any>
) {
`.trim()
