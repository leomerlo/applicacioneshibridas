import React, { useEffect, useRef, useState } from 'react'
import NutriLayout from '../components/NutriLayout'
import PlanList from '../components/PlanList'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlan } from '../contexts/PlanContext'
import Loading from '../components/Loading'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Input from '../components/Input'
import Schema, { Rules } from 'async-validator'
import planService from '../services/plan.service'
import { useNotifications } from '../contexts/NotificationsContext'
import ReactMarkdown from 'react-markdown'
import { useProfile } from '../contexts/ProfileContext'

export interface PlanAssistantMessage {
  role: string;
  content: any[];
}

const PlanAssistant = () => {
  const navigate = useNavigate();
  const { plan } = usePlan();
  const { refreshProfile } = useProfile();
  const notifications = useNotifications();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messages, setMessages] = useState<PlanAssistantMessage[]>([]);
  const [assistantMessage, setAssistantMessage] = useState<PlanAssistantMessage>({
    role: 'assistant',
    content: [{ text: { value: "" } }]
  });
  const [planReady, setPlanReady] = useState(false)
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const endOfMessagesRef = useRef(null);
  const params = useParams();

  const definition: Rules = {
    message: {
      type: "string",
      required: true,
      message: "Necesitás un mensaje para enviar"
    }
  }

  const validator = new Schema(definition);
  
  const planClickHandler = (assistantURI: string) => {
    navigate(`/plan/${assistantURI}/assistant`);
  }

  const messageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }

  const addPlanHandler = () => {
    navigate('/addPlan');
  }

  const messageClickHandler = async () => {
    await validator.validate({ message }, (errors) => {
      if (errors) {
        setMessageError(errors[0].message as string);
        return;
      }
    });

    await setMessages([
      ...messages,
      {
        role: 'user',
        content: [{ text: { value: message } }]
      }
    ]);

    setLoadingMessage(true);

    await planService.assistantSendMessage(plan?.meta.threadId as string, message, (data) => {
      const currentAMessage = assistantMessage;
      currentAMessage.content[0].text.value = new TextDecoder().decode(data);
      setAssistantMessage(currentAMessage);
    }, () => {
      setLoadingMessage(false);
      setMessage("");
      
      // Finish
      setMessages(prevMessage => [
        ...prevMessage,
        assistantMessage
      ]);
    });
  }

  const getThread = async () => {
    setLoadingResponse(true);
    const resp = await planService.getPlanAssistantThread(plan?.meta.threadId as string);
    setLoadingResponse(false);
    setPlanReady(true);
    if(resp.status === 200){
      const sassyMessages = resp.data.messages.filter((message: any) => {
        /**
         * Filtramos mensajes del asistente que genera recetas
         * y los mensajes que el sistema utiliza para ese asistente
         */
        return message.assistant_id !== 'asst_VgpCeGz34c0CmjfIRfINHL4o' && message.content[0].text.value !== "Guardar el plan completo";
      });
      setMessages(sassyMessages.reverse());
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al obtener el chat'
      });
      navigate('/plans');
    }
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const savePlanHandler = async () => {
    setLoadingSave(true);

    const resp = await planService.savePlanFromDraft(params.id as string);

    setLoadingSave(false);

    if (resp.status === 200) {
      await refreshProfile();
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

  const deletePlanHandler = async () => {
    // TODO Add a confirmation dialog
    const resp = await planService.deletePlan(params.id as string);

    if (resp.status === 202) {
      notifications.updateNotifications({
        variant: 'success',
        message: 'Plan eliminado'
      });
      await refreshProfile();
      navigate('/plans');
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al eliminar el plan'
      });
    }
  }

  const getLoadingText = (): string => {
    switch (true) {
      case loadingResponse:
        return "Estamos cargando el chat";
      case loadingSave:
        return "Estamos guardando el plan";
      case !planReady:
      default:
        return "Estamos cargando el plan";
    }
  }

  const viewPlanHandler = () => {
    navigate(`/plan/${params.id}`);
  }

  useEffect(() => {
    if (plan && plan?.meta && plan?.meta.threadId) {
      getThread();
    }
  }, [plan]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="text-xl mb-5">Mis planes</h2>
            <PlanList onClick={planClickHandler} active={params.id} />
          </div>
          <div>
            <Button onClick={addPlanHandler} full>Crear plan</Button>
          </div>
        </div>
      }
      content={<>
        { !planReady || loadingResponse || loadingSave ? <>
          <div className="container mx-auto h-full">
            <div className="flex flex-col h-full">
              <Loading action={getLoadingText()} />
            </div>
          </div>
        </> : <>
          <div className="container mx-auto h-full">
            <div className="flex flex-col h-full">
              <div className="header border-b-2 pb-6">
                <div className="flex justify-between align-center">
                  <h1 className="text-2xl text-primary-main mt-5 flex items-center gap-4">
                    { plan?.meta.title }
                    { plan?.meta && plan.meta.status == "draft" ? <Badge text="Borrador" /> : <Button size="small" variant="secondary" onClick={viewPlanHandler}>Ver plan</Button>}
                    
                  </h1>
                  <div className="flex gap-4">
                    <Button size="small" variant="secondary" onClick={deletePlanHandler}>Eliminar</Button>
                    <Button size="small" variant="primary" onClick={savePlanHandler}>Guardar</Button>
                  </div>
                </div>
              </div>
              <div className="content flex-1 h-full overflow-hidden">
                <ul className="assistant-content flex flex-col gap-8 py-6 overflow-y-auto flex-1 h-full">
                  { messages.map((message: any) => (
                    <li key={message.id} className={`max-w-1/2 px-4 py-2 rounded-lg text-sm ${message.role === 'user' ? "self-end text-right bg-violet-100" : "self-start bg-gray-30 text-black"}`}>
                      <ReactMarkdown>{message.content[0].text?.value}</ReactMarkdown>
                    </li>
                  )) }
                  { loadingMessage && <li className="max-w-1/2 p-4 rounded-lg text-md self-start bg-primary-main text-white">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </li> }
                </ul>
              </div>
              <div ref={endOfMessagesRef} />
              <div className="footer flex gap-4">
                <div className="flex-grow">
                  <Input name="input" label="" onInput={messageInputHandler} disabled={loadingMessage} value={message} error={[messageError]} placeholder="Escribí tu mensaje acá" />
                </div>
                <Button size="small" variant="primary" onClick={messageClickHandler} disabled={loadingMessage}>Enviar</Button>
              </div>
            </div>
          </div>
        </>}
        
      </>}
    />
  )
}

export default PlanAssistant