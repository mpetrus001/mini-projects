import { NextPageContext } from "next";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Layout from "../components/Layout";
import client from "../utils/kentsFetch";
import SyntaxHighlighter from "react-syntax-highlighter";
import { connectToDatabase } from "../utils/mongodb";

type Gist = { id: string; file: string; code: string };

const IndexPage = ({ initialGists = [] }: { initialGists: Gist[] }) => {
  const [gists, setGists] = useState<Gist[]>(initialGists);
  const [editing, setEditing] = useState("");
  useEffect(() => {
    const { fetch, controller } = client("/api/gists");
    async function getGists() {
      const result = await fetch();
      setGists(result);
    }
    getGists();
    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    const { fetch } = client(`/api/gists/${id}`, { method: "DELETE" });
    try {
      await fetch();
      setGists((gists) =>
        gists.filter((g) => {
          if (g.id === id) return false;
          return true;
        })
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <Layout title="Gist-Next">
      <h2>Gists</h2>
      <AddGist setGists={setGists} />
      <ul>
        {gists.map((gist) => (
          <li key={gist.id}>
            <h3>{gist.file}</h3>
            {gist.id === editing ? (
              <EditGist
                id={gist.id}
                gist={gist}
                close={() => setEditing("")}
                setGists={setGists}
              />
            ) : (
              <>
                <SyntaxHighlighter language={getLanguage(gist.file)}>
                  {gist.code}
                </SyntaxHighlighter>
                <button onClick={() => setEditing(gist.id)}>edit</button>
                <button onClick={() => handleDelete(gist.id)}>delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;

function AddGist({ setGists }: { setGists: Dispatch<SetStateAction<Gist[]>> }) {
  const [file, setFile] = useState("");
  const [code, setCode] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fetch } = client("/api/gists", { body: { file, code } });
    try {
      const { result } = await fetch();
      setGists((gists) => [...gists, ...result]);
      setFile("");
      setCode("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Add Gist</h3>
      <input
        type="text"
        name="file"
        id="file"
        placeholder="file.ext"
        required
        value={file}
        onChange={(e) => setFile(e.target.value)}
      />
      <textarea
        name="code"
        id="code"
        cols={80}
        rows={10}
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button type="submit">Save</button>
    </form>
  );
}

function EditGist({
  id,
  gist,
  close,
  setGists,
}: {
  id: string;
  gist: Gist;
  close: () => void;
  setGists: Dispatch<SetStateAction<Gist[]>>;
}) {
  const [code, setCode] = useState(gist.code);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fetch } = client(`/api/gists/${id}`, { body: { code } });
    try {
      await fetch();
      const updatedGist = { ...gist, ...{ code } };
      setGists((gists) =>
        gists.map((g) => {
          if (g.id === gist.id) return updatedGist;
          return g;
        })
      );
      close();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="code"
        id="code"
        cols={80}
        rows={10}
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button type="submit">save</button>
      <button onClick={close}>close</button>
    </form>
  );
}

function getLanguage(file: string) {
  const langs: Record<string, string> = {
    js: "javascript",
    py: "python",
    rb: "ruby",
  };
  const parts = file.split(".");
  const ext = parts[parts.length - 1];
  return langs[ext] ?? "text";
}

export async function getServerSideProps(_context: NextPageContext) {
  const { client, db } = await connectToDatabase();

  const isConnected = await client.isConnected();

  if (isConnected) {
    let cursor = await db.collection("gists").find();
    const docs = await cursor.toArray();
    const initialGists = docs.map(({ _id, ...restDoc }) => {
      return { id: _id.toString(), ...restDoc };
    });
    return {
      props: { initialGists },
    };
  }

  return {
    props: {},
  };
}
