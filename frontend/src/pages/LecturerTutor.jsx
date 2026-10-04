import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Sparkles,
  Bot,
  User,
  Send,
  Lightbulb,
  FileText,
  BrainCircuit,
  BookOpen,
  RotateCcw,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

import "../styles/tutor.css";


function LecturerTutor() {

  const location =
    useLocation();


  /* ========================================
     OPTIONAL COURSE CONTEXT
  ======================================== */

  const courseContext =
    location.state?.courseContext ||
    location.state?.lessonContext ||
    "";


  const courseTitle =
    location.state?.courseTitle ||
    location.state?.lessonTitle ||
    "";


  /* ========================================
     STATE
  ======================================== */

  const [question, setQuestion] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [messages, setMessages] =
    useState([]);


  const messagesEndRef =
    useRef(null);


  /* ========================================
     AUTO SCROLL
  ======================================== */

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [
    messages,
    loading,
  ]);


  /* ========================================
     LECTURER SUGGESTIONS
  ======================================== */

  const suggestions = [

    {
      icon: Lightbulb,
      text:
        "Create a lesson plan for a university lecture.",
    },

    {
      icon: ClipboardList,
      text:
        "Create an assignment with clear instructions and marking criteria.",
    },

    {
      icon: BrainCircuit,
      text:
        "Generate 10 quiz questions for my students.",
    },

    {
      icon: FileText,
      text:
        "Create a marking rubric for an academic assignment.",
    },

    {
      icon: BookOpen,
      text:
        "Explain a difficult topic in a way I can teach to students.",
    },

  ];


  /* ========================================
     SEND QUESTION
  ======================================== */

  const sendQuestion =
    async () => {

      const trimmedQuestion =
        question.trim();


      if (
        !trimmedQuestion ||
        loading
      ) {

        return;

      }


      const userMessage = {

        id:
          `${Date.now()}-user`,

        role:
          "user",

        content:
          trimmedQuestion,

      };


      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );


      setQuestion("");

      setLoading(true);


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await axios.post(

            "http://localhost:5000/tutor",

            {

              question:
                trimmedQuestion,

              context:
                courseContext,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        const aiMessage = {

          id:
            `${Date.now()}-assistant`,

          role:
            "assistant",

          content:
            response.data.answer ||
            "I couldn't generate an answer.",

        };


        setMessages(
          (previous) => [
            ...previous,
            aiMessage,
          ]
        );


      } catch (error) {

        console.error(
          "Lecturer Tutor API Error:",
          error.response
            ? error.response.data
            : error.message
        );


        const errorMessage = {

          id:
            `${Date.now()}-error`,

          role:
            "error",

          content:
            error.response
              ?.data?.error ||
            "The AI teaching assistant couldn't respond right now. Please try again.",

        };


        setMessages(
          (previous) => [
            ...previous,
            errorMessage,
          ]
        );


      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     FORM SUBMIT
  ======================================== */

  const handleAskAI =
    async (event) => {

      event.preventDefault();

      await sendQuestion();

    };


  /* ========================================
     ENTER TO SEND
  ======================================== */

  const handleKeyDown =
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendQuestion();

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
            AI Teaching Assistant
          </h1>

          <p>
            Create teaching materials,
            assignments, quizzes, rubrics
            and academic content with AI.
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

              <Sparkles
                size={23}
              />

            </div>


            <h3>
              CampusLearn AI
            </h3>


            <p>
              Your AI teaching assistant
              for lesson planning, assessment
              creation and academic support.
            </p>

          </div>


          <p className="tutor-suggestion-title">

            Try asking

          </p>


          <div className="tutor-suggestions">

            {suggestions.map(
              (
                suggestion,
                index
              ) => {

                const Icon =
                  suggestion.icon;


                return (

                  <button
                    type="button"
                    className="tutor-suggestion"
                    key={index}
                    onClick={() =>
                      setQuestion(
                        suggestion.text
                      )
                    }
                  >

                    <Icon
                      size={15}
                    />

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
              Teaching tip:
            </strong>

            <br />

            Give the AI details such as
            subject, student level, duration
            and marks for more useful results.

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

                <Bot
                  size={21}
                />

              </div>


              <div>

                <h3>
                  Teaching Assistant
                </h3>

                <span>
                  Ready to help with your teaching
                </span>

              </div>

            </div>


            {messages.length > 0 && (

              <button
                type="button"
                className="tutor-clear-button"
                title="Clear conversation"
                onClick={clearChat}
              >

                <RotateCcw
                  size={16}
                />

              </button>

            )}

          </div>


          {/* COURSE CONTEXT */}

          {courseTitle && (

            <div className="tutor-context">

              <GraduationCap
                size={15}
              />

              <span>

                Teaching:{" "}

                <strong>
                  {courseTitle}
                </strong>

              </span>

            </div>

          )}


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="tutor-messages">

            {messages.length === 0 ? (

              <div className="tutor-empty">

                <div className="tutor-empty-icon">

                  <Sparkles
                    size={31}
                  />

                </div>


                <h2>
                  What can I help you create?
                </h2>


                <p>

                  Ask me to create lesson plans,
                  assignments, quiz questions,
                  marking rubrics or teaching
                  explanations.

                  {courseTitle && (
                    <>
                      {" "}
                      I already have context from{" "}
                      <strong>
                        {courseTitle}
                      </strong>.
                    </>
                  )}

                </p>

              </div>

            ) : (

              messages.map(
                (message) => {

                  const isUser =
                    message.role ===
                    "user";


                  const isError =
                    message.role ===
                    "error";


                  return (

                    <div
                      key={
                        message.id
                      }
                      className={
                        `tutor-message ${
                          isUser
                            ? "tutor-message-user"
                            : "tutor-message-ai"
                        } ${
                          isError
                            ? "tutor-message-error"
                            : ""
                        }`
                      }
                    >

                      <div className="tutor-message-avatar">

                        {isUser ? (

                          <User
                            size={16}
                          />

                        ) : (

                          <Bot
                            size={16}
                          />

                        )}

                      </div>


                      <div className="tutor-message-content">

                        {!isUser &&
                          !isError && (

                          <div className="tutor-message-label">

                            CampusLearn AI

                          </div>

                        )}


                        {isUser ? (

                          <div className="tutor-message-body">

                            {message.content}

                          </div>

                        ) : (

                          <div className="tutor-message-body tutor-markdown">

                            <ReactMarkdown
                              remarkPlugins={[
                                remarkGfm,
                              ]}
                            >

                              {message.content}

                            </ReactMarkdown>

                          </div>

                        )}

                      </div>

                    </div>

                  );

                }
              )

            )}


            {/* THINKING */}

            {loading && (

              <div className="tutor-message tutor-message-ai">

                <div className="tutor-message-avatar">

                  <Bot
                    size={16}
                  />

                </div>


                <div className="tutor-message-content">

                  <div className="tutor-message-label">

                    CampusLearn AI

                  </div>


                  <div className="tutor-message-body tutor-thinking-body">

                    <div className="tutor-thinking">

                      <span />
                      <span />
                      <span />

                    </div>


                    <small>
                      Preparing your teaching content...
                    </small>

                  </div>

                </div>

              </div>

            )}


            <div
              ref={
                messagesEndRef
              }
            />

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
                onChange={
                  (event) =>
                    setQuestion(
                      event.target.value
                    )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder={
                  courseTitle
                    ? `Ask something about teaching ${courseTitle}...`
                    : "Ask your teaching question..."
                }
              />


              <button
                className="tutor-send-button"
                type="submit"
                disabled={
                  loading ||
                  !question.trim()
                }
                title="Send question"
              >

                <Send
                  size={17}
                />

              </button>

            </div>


            <div className="tutor-input-help">

              <span>
                Enter to send
              </span>

              <span>
                Shift + Enter for new line
              </span>

            </div>


            <p className="tutor-composer-note">

              AI-generated teaching content
              can contain mistakes. Review
              important academic material
              before sharing it with students.

            </p>

          </form>

        </div>

      </section>

    </div>

  );

}


export default LecturerTutor;