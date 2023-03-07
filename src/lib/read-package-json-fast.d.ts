declare module "read-package-json-fast" {
  import { PackageJson } from "types-package-json"
  export default function rpj(path: string): Promise<PackageJson>
}
