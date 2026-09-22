import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import {
  Sparkles,
  Bot,
  User,
  Send,
  Lightbulb,
  BookOpen,
  FileText,
  BrainCircuit,
  RotateCcw,
  GraduationCap,
} from "lucide-react";

import "../styles/tutor.css";


function Tutor() {

  const location = useLocation();


  /* ========================================
     LESSON CONTEXT
  ======================================== */

  const lessonContext =
    location.state?.lessonContext || "";

  const lessonTitle =
    location.state?.lessonTitle || "";


  /* ========================================
     STATE
  ======================================== */

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);


  /* ========================================
     SUGGESTED QUESTIONS
  ======================================== */

  const suggestions = [
    {
      icon: Lightbulb,
      text:
        "Explain this concept in very simple words.",
    },
    {
      icon: FileText,
      text:
        "Summarize the important points for my exam.",
    },
    {
      icon: BrainCircuit,
      text:
        "Give me a simple example to understand this topic.",
    },
    {
      icon: BookOpen,
      text:
        "Create 5 practice questions for me.",
    },
  ];


  /* ========================================
     ASK AI
  ======================================== */

  const handleAskAI = async (event) => {

    event.preventDefault();


    const trimmedQuestion =
      question.trim();


    if (!trimmedQuestion || loading) {
      return;
    }


    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedQuestion,
    };


    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);


    setQuestion("");

    setLoading(true);


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await axios.post(
          "http://localhost:5000/tutor",

          {
            question: trimmedQuestion,
            context: lessonContext,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const aiMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          response.data.answer ||
          "I couldn't generate an answer.",
      };


      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);


    } catch (error) {

      console.error(
        "Tutor API Error:",
        error.response
          ? error.response.data
          : error.message
      );


      const errorMessage = {
        id: `${Date.now()}-error`,
        role: "error",
        content:
          "The AI tutor couldn't respond right now. We'll connect and fix the AI service during the backend phase.",
      };


      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);


    } finally {

      setLoading(false);

    }

  };


  /* ========================================
     CLEAR CHAT
  ======================================== */

  const clearChat = () => {

    setMessages([]);
    setQuestion("");

  };


  return (
    <div className="tutor-page">

      {/* ====================================
          PAGE HEADER
      ==================================== */}

      <section className="tutor-page-header">

        <div>

          <h1>
            AI Study Tutor
          </h1>

          <p>
            Ask questions, understand difficult
            concepts and get support while you
            study.
          </p>

        </div>


        <div className="tutor-status">

          <span className="tutor-status-dot" />

          AI Assistant

        </div>

      </section>


      {/* ====================================
          WORKSPACE
      ==================================== */}

      <section className="tutor-workspace">


        {/* ==================================
            LEFT PANEL
        ================================== */}

        <aside className="tutor-side-panel">

          <div className="tutor-ai-brand">

            <div className="tutor-ai-icon">

              <Sparkles size={23} />

            </div>


            <h3>
              CampusLearn AI
            </h3>


            <p>
              Your personal study assistant
              for explanations, revision and
              practice.
            </p>

          </div>


          <p className="tutor-suggestion-title">
            Try asking
          </p>


          <div className="tutor-suggestions">

            {suggestions.map(
              (suggestion, index) => {

                const Icon =
                  suggestion.icon;


                return (
                  <button
                    className="tutor-suggestion"
                    key={index}
                    onClick={() =>
                      setQuestion(
                        suggestion.text
                      )
                    }
                  >

                    <Icon size={15} />

                    <span>
                      {suggestion.text}
                    </span>

                  </button>
                );

              }
            )}

          </div>


          <div className="tutor-side-note">

            <strong>
              Study tip:
            </strong>

            <br />

            Ask one clear question at a
            time and request examples when
            a topic feels difficult.

          </div>

        </aside>


        {/* ==================================
            CHAT
        ================================== */}

        <div className="tutor-chat">


          {/* CHAT HEADER */}

          <div className="tutor-chat-header">

            <div className="tutor-chat-profile">

              <div className="tutor-chat-avatar">

                <Bot size={21} />

              </div>


              <div>

                <h3>
                  Study Assistant
                </h3>

                <span>
                  Ready to help you learn
                </span>

              </div>

            </div>


            {messages.length > 0 && (

              <button
                className="tutor-clear-button"
                title="Clear conversation"
                onClick={clearChat}
              >

                <RotateCcw size={16} />

              </button>

            )}

          </div>


          {/* LESSON CONTEXT */}

          {lessonTitle && (

            <div className="tutor-context">

              <GraduationCap size={15} />

              Studying:
              {" "}
              <strong>
                {lessonTitle}
              </strong>

            </div>

          )}


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="tutor-messages">

            {messages.length === 0 ? (

              <div className="tutor-empty">

                <div className="tutor-empty-icon">

                  <Sparkles size={31} />

                </div>


                <h2>
                  What can I help you learn?
                </h2>


                <p>

                  Ask me to explain a difficult
                  concept, summarize a lesson,
                  create revision questions or
                  help you prepare for an exam.

                  {lessonTitle && (
                    <>
                      {" "}
                      I already have context
                      from your lesson
                      {" "}
                      <strong>
                        {lessonTitle}
                      </strong>.
                    </>
                  )}

                </p>

              </div>

            ) : (

              messages.map((message) => {

                const isUser =
                  message.role ===
                  "user";


                const isError =
                  message.role ===
                  "error";


                return (
                  <div
                    key={message.id}
                    className={`tutor-message ${
                      isUser
                        ? "tutor-message-user"
                        : "tutor-message-ai"
                    } ${
                      isError
                        ? "tutor-message-error"
                        : ""
                    }`}
                  >

                    <div className="tutor-message-avatar">

                      {isUser ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}

                    </div>


                    <div className="tutor-message-body">

                      {message.content}

                    </div>

                  </div>
                );

              })

            )}


            {/* THINKING */}

            {loading && (

              <div className="tutor-message tutor-message-ai">

                <div className="tutor-message-avatar">

                  <Bot size={16} />

                </div>


                <div className="tutor-message-body">

                  <div className="tutor-thinking">

                    <span />
                    <span />
                    <span />

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* =================================
              INPUT
          ================================= */}

          <form
            className="tutor-composer"
            onSubmit={handleAskAI}
          >

            <div className="tutor-input-wrapper">

              <textarea
                rows="1"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder={
                  lessonTitle
                    ? `Ask something about ${lessonTitle}...`
                    : "Ask your study question..."
                }
              />


              <button
                className="tutor-send-button"
                type="submit"
                disabled={
                  loading ||
                  !question.trim()
                }
              >

                <Send size={17} />

              </button>

            </div>


            <p className="tutor-composer-note">
              AI-generated answers can make
              mistakes. Check important academic
              information with your course
              materials.
            </p>

          </form>

        </div>

      </section>

    </div>
  );
}


export default Tutor;