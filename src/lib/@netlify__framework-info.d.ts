declare module "@netlify/framework-info" {
  export function listFrameworks(): Promise<FrameworkInfo[]>

  type FrameworkInfo = {
    id: FrameworkId
  }

  export type FrameworkId =
    | "angular"
    | "create-react-app"
    | "ember"
    | "gatsby"
    | "next"
    | "svelte-kit"
    | "svelte"
    | "vite"
    | "vue"
}
