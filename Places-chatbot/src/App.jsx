import React, { useState, useEffect } from "react";
import { client } from "@gradio/client";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./App.css";

function App() {
  const [query, updateQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setAnswers([]);
    }
  }, [query]);

  const processApiResponse = (apiResponse) => {
    const splitResponse = apiResponse.split('\n');
    // Remove the introductory line and then filter out any empty strings
    const entries = splitResponse.slice(1,-1).filter(line => line.trim() !== '');
    return entries;
  };

  const sendQuery = async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    try {
      setLoading(true);
      const gradioClient = await client("http://127.0.0.1:7860/");
      const result = await gradioClient.predict("/predict", [query]);
      if (result.error) {
        throw new Error(result.error);
      }
      const processedResponse = processApiResponse(result.data[0]);
      setAnswers(processedResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="bg-img" />
      <div className="app-container">
        <div className="spotlight__wrapper">
          <div className="spotlight__input">
            <div className="spotlight__input__sub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text"
                className="spotlight__input"
                placeholder="Ask me anything..."
                onChange={(e) => updateQuery(e.target.value)}
                onKeyDown={(e) => sendQuery(e)}
              />
            </div>
            {loading && (
              <img src="/assets/loading.gif" alt="loading" style={{ height: "1.7rem" }} />
            )}
          </div>
        </div>
        <div className="cards-container row container gx-3">
            {answers.map((entry, index) => (
              <div className="p-1 col-4">
                <Card key={index} className="p-5 h-100">
                  {/* <Card.Img src="https://images.unsplash.com/photo-1682685797736-dabb341dc7de?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" /> */}
                  <p className="mb-0 mt4">{entry}</p>
                </Card>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default App;
