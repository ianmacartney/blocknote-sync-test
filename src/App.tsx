import { randomName } from "@/lib/randomName";
import { Layout } from "@/Layout";
import { UserMenu } from "@/components/UserMenu";
import { useState } from "react";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../convex/_generated/api";
import { BlockNoteEditor, nodeToBlock } from "@blocknote/core";

export default function App() {
  const [viewer] = useState(randomName());
  const sync = useTiptapSync(api.prosemirror, "test", { debug: true });
  return (
    <Layout menu={<UserMenu>{viewer}</UserMenu>}>
      {sync.isLoading ? (
        <div>Loading...</div>
      ) : sync.initialContent === null ? (
        <button onClick={() => void sync.create({ type: "doc", content: [] })}>
          Create document
        </button>
      ) : (
        <Doc
          initialContent={sync.initialContent}
          syncExtension={sync.extension}
        />
      )}
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

  return <BlockNoteView editor={editor} />;
}
