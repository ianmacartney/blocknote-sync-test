import { randomName } from "@/lib/randomName";
import { Layout } from "@/Layout";
import { UserMenu } from "@/components/UserMenu";
import { useState } from "react";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { api } from "../convex/_generated/api";

export default function App() {
  const [viewer] = useState(randomName());
  const sync = useBlockNoteSync(api.prosemirror, "test", { debug: true });
  if (!sync.isLoading && !sync.editor) {
    sync.create({ type: "doc", content: [] });
  }
  return (
    <Layout menu={<UserMenu>{viewer}</UserMenu>}>
      <div style={{ height: "100%", overflow: "auto" }}>
        {sync.editor && <BlockNoteView editor={sync.editor} />}
      </div>
    </Layout>
  );
}
