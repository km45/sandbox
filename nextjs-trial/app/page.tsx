"use client"

import { Canvas, Edge, Node } from "../components/Canvas";
import { generateGraphOnServer } from "./server";
import { useState } from "react";
import { Button, Navbar, Form, Input, Join, Drawer } from "react-daisyui";

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [formInput, setFormInput] = useState<string>("");

  async function formToGraph() {
    const res = await generateGraphOnServer(prompts);
    setNodes(res.nodes);
    setEdges(res.edges);
  }

  function addPrompt(formData: FormData) {
    const a = formData.get("a");
    if (typeof a !== "string") {
      return;
    }

    setPrompts([...prompts, a]);
    setFormInput("");
  }

  return (
    <main>
      <div className="flex flex-col h-dvh">
        <Navbar>
          <Navbar.Start>tool name</Navbar.Start>
          <Navbar.Center>
            <Form action={addPrompt}>
              <Input name="a" placeholder="add prompt" value={formInput} onChange={(e) => setFormInput(e.target.value)} />
            </Form>
            <Button onClick={() => setVisible(true)}>{prompts.length} prompts</Button>
          </Navbar.Center>
          <Navbar.End>
            <Form action={formToGraph}>
              <Button>calc graph</Button>
            </Form>
          </Navbar.End>
        </Navbar>

        <div className="grow">
          <Canvas nodes={nodes} edges={edges} />
        </div>
      </div>
      <Drawer open={visible} onClickOverlay={() => setVisible(!visible)} side={
        <Join vertical={true}>
          {prompts.map(prompt => <Button id={prompt} onClick={(e) => setPrompts(prompts.filter((p) => { return p != e.target.id }))}>{prompt}</Button>)}
        </Join>
      } />
    </main >
  );
}
