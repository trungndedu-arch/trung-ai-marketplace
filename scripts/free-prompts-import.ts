// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { legacyFreePromptImportRows } from "../lib/free-prompts-legacy.ts";

const apply = process.argv.includes("--apply");
const payload = JSON.stringify(legacyFreePromptImportRows);
const delimiter = "$legacy_free_prompts$";

if (payload.includes(delimiter)) throw new Error("Import payload conflicts with its SQL delimiter.");

// This script deliberately emits SQL only. An operator must explicitly pipe its
// output to a privileged, approved database session after reviewing the report.
// Default is a dry run; --apply changes only the function argument, never opens
// a database connection or reads credentials.
process.stdout.write(`-- ${apply ? "APPLY" : "DRY RUN"} legacy Free Prompts import\n`);
process.stdout.write(`select * from public.import_legacy_free_prompts(${delimiter}${payload}${delimiter}::jsonb, ${apply ? "false" : "true"});\n`);
