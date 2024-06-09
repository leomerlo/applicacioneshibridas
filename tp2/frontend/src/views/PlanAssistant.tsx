import { useEffect, useState, useRef } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import { useNotifications } from "../contexts/NotificationsContext";
import { useParams } from "react-router-dom";
import planService from "../services/plan.service";
import ReactMarkdown from "react-markdown";

export interface PlanAssistantMessage {
  role: string;
  content: any[];
}

const PlanAssistant = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<PlanAssistantMessage[]>([]);
  const [threadMeta, setThreadMeta] = useState<any>({});
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const notifications = useNotifications();
  const endOfMessagesRef = useRef(null);

  const messageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      sendMessage();
    }
  }

  const getThread = async () => {
    setLoadingResponse(true);
    const resp = await planService.getPlanAssistantThread(id as string);
    setLoadingResponse(false);
    if(resp.status === 200){
      setThreadMeta(resp.data.thread.metadata);
      setMessages(resp.data.messages.reverse());
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al obtener el chat'
      });
    }
  };

  const sendMessage = async () => {
    setMessage('');
    setStreamingMessage('');
    setLoadingResponse(true);
    await setMessages([
      ...messages,
      {
        role: 'user',
        content: [{ text: { value: message } }]
      }
    ]);
    scrollToBottom();
    await planService.assistantSendMessage(id as string, message, (data) => {
      setStreamingMessage(prevMessage => `${prevMessage}${new TextDecoder().decode(data)}`);
      scrollToBottom();
    }, () => {
      const newMessage = `${streamingMessage}`;
      setMessages(prevMessage => [
        ...prevMessage,
        {
          role: 'assistant',
          content: [{ text: { value: newMessage } }]
        }
      ]);
    });
    setLoadingResponse(false);
  }

  const savePlan = async () => {
    setLoadingResponse(true);
    const {
      title,
      preferences,
      restrictions
    } = threadMeta;
    const resp = await planService.newDocPlan({
      title,
      preferences,
      restrictions,
      thread: id as string,
      listado: messages[messages.length - 1].content[0].text.value
    });
    setLoadingResponse(false);
    if(resp.status === 200){
      notifications.updateNotifications({
        variant: 'success',
        message: 'Plan guardado'
      });
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al guardar el plan'
      });
    }
  }

  useEffect(() => {
    getThread();
  }, []);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full">
        <>
          <div className="text-left">
            <GoBack />
          </div>
          <div className="flex-grow flex flex-col h-screen">
            <h1 className="text-4xl text-gray-80 mt-5">{threadMeta.title}</h1>
            <div className="mt-8 overflow-y-scroll p-2 flex-grow-0">
              <ul className="assistant-content flex flex-col gap-2">
                { messages.map((message: any) => (
                  <li key={message.id} className={`max-w-1/2 p-4 rounded-lg text-md ${message.role === 'user' ? "self-end text-right bg-violet-200" : "self-start bg-primary-main text-white"}`}>
                    <ReactMarkdown>{message.content[0].text?.value}</ReactMarkdown>
                  </li>
                )) }
                { loadingResponse && <li className="max-w-1/2 p-4 rounded-lg text-md self-start bg-primary-main text-white">
                <ReactMarkdown>{ streamingMessage }</ReactMarkdown>
                </li> }
              </ul>
              <div ref={endOfMessagesRef} />
            </div>
            <div className="my-8">
              <Input disabled={loadingResponse} name="message" type="textarea" label="Mensaje" value={message} onInput={messageHandler} placeholder="Mensaje para la AI..." onKeyDown={keyDownHandler} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button disabled={loadingResponse} full onClick={sendMessage}>Enviar mensaje</Button>
            <Button disabled={loadingResponse} className="flex-1" full onClick={savePlan}>Guardar Plan</Button>
          </div>
        </>
      </div>
    </div>
  )
}

export default PlanAssistant