"use client"

import { Canvas, Edge, Node } from "../components/Canvas";
import { generateGraphOnServer } from "./server";
import { useState } from "react";
import { Button, Navbar, Form, Input, Menu } from "react-daisyui";

export default function Home() {
  const [nodes, setNodes] = useState<Set<Node>>([]);
  const [edges, setEdges] = useState<Set<Edge>>([]);
  const [prompts, setPrompts] = useState<string[]>([]);


  function addPrompt(formData: FormData) {
    const prompt = formData.get("prompt");
    if (typeof prompt !== "string") {
      return;
    }

    setPrompts([...prompts, prompt]);
  }

  function removePromt(index: number) {
    setPrompts(prompts.filter((_, i) => i != index));
  }

  async function calcGraph() {
    const res = await generateGraphOnServer(prompts);
    setNodes(res.nodes);
    setEdges(res.edges);
  }

  return (
    <main>
      <div className="flex flex-col h-dvh">
        <Navbar>
          <Navbar.Start>tool name</Navbar.Start>
          <Navbar.Center>
            <Form action={addPrompt}>
              <Input name="prompt" placeholder="add prompt" />
            </Form>
          </Navbar.Center>
          <Navbar.End>
            <Form action={calcGraph}>
              <Button>calc graph</Button>
            </Form>
          </Navbar.End>
        </Navbar>

        <div className="grow">
          <div className="flex flex-row h-full">
            <Menu>
              <Menu.Title>prompts</Menu.Title>
              {prompts.map((prompt, index) => <Menu.Item key={index}>
                <Button id={prompt} onClick={() => removePromt(index)}>
                  {prompt}
                </Button>
              </Menu.Item>)}
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
