import { Configuration, OpenAIApi } from "openai";
import { useState, FormEvent } from "react";
import "./App.css";

function App() {
  const [subject, setSubject] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAPI_APIKEY,
  });
  const openai = new OpenAIApi(configuration);

  async function generateSuggestions(e: FormEvent) {
    if (subject === "") {
      return;
    }
    setLoading(true);
    e.preventDefault();
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate three more effective subject lines for a weekly newsletter with the following subject: "${subject}".`,
      max_tokens: 1000,
    });

    setLoading(false);
    setSuggestions(
      completion.data.choices[0].text?.split("\n").filter(Boolean) ?? []
    );
  }

  return (
    <main>
      <h2>Subject generator</h2>
      <p>
        Just enter a subject line that you want to generate some better
        suggestions for and press on the sparkles.
      </p>
      <form onSubmit={generateSuggestions}>
        <input
          type="text"
          placeholder="Enter a subject..."
          value={subject ?? ""}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button>✨</button>
      </form>
      {loading && <Spinner />}
      {!!suggestions.length && (
        <div className="fade-in">
          <h2>Suggestions</h2>
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </div>
      )}
    </main>
  );
}

function Spinner() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default App;
