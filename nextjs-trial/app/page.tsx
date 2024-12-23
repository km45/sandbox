"use client"

import { Canvas, Edge, Node } from "../components/Canvas";
import { generateGraphOnServer } from "./server";
import { useState } from "react";
import { Button, Navbar, Form, Input, Menu } from "react-daisyui";

export default function Home() {
  const [nodes, setNodes] = useState<Set<Node>>([]);
  const [edges, setEdges] = useState<Set<Edge>>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
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
          </Navbar.Center>
          <Navbar.End>
            <Form action={formToGraph}>
              <Button>calc graph</Button>
            </Form>
          </Navbar.End>
        </Navbar>

        <div className="grow">
          <div className="flex flex-row h-full">
            <Menu>
              <Menu.Title>prompts</Menu.Title>
              {prompts.map((prompt, index) => <Menu.Item key={index}><Button id={prompt} onClick={(e) => setPrompts(prompts.filter((p) => { return p != e.target.id }))}>{prompt}</Button></Menu.Item>)}
            </Menu>
            <div className="grow">
              <Canvas nodes={nodes} edges={edges} />
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}
