import { randomName } from "@/lib/randomName";
import { Layout } from "@/Layout";
import { UserMenu } from "@/components/UserMenu";
import { useState } from "react";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { api } from "../convex/_generated/api";
import { BlockNoteEditor, nodeToBlock } from "@blocknote/core";

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

// const defaultSchema = BlockNoteSchema.create();
const defaultEditor = BlockNoteEditor.create({
  _headless: true,
});

function Doc(props: { initialContent: any; syncExtension: any }) {
  const node = defaultEditor.pmSchema.nodeFromJSON(props.initialContent);
  const blocks: any[] = [];

  // note, this code is similar to editor.document
  node.firstChild!.descendants((node) => {
    blocks.push(
      nodeToBlock(
        node,
        defaultEditor.schema.blockSchema,
        defaultEditor.schema.inlineContentSchema,
        defaultEditor.schema.styleSchema,
      ),
    );
    return false;
  });
  const editor = useCreateBlockNote({
    initialContent: blocks,
    _tiptapOptions: {
      extensions: [props.syncExtension],
    },
  });

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <BlockNoteView editor={editor} />
    </div>
  );
}
