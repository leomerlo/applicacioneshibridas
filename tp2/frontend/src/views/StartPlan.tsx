import { useEffect, useState }  from 'react';
import { usePlan } from '../contexts/PlanContext';
import { useNotifications } from '../contexts/NotificationsContext';
import cardGradient from "../assets/pattern_azul_lg.png"
import Loading from '../components/Loading';
import planService from '../services/plan.service';
import Button, { ButtonType } from '../components/Button';
import Input from '../components/Input';
import { Profile, useProfile } from '../contexts/ProfileContext';
import accountService from '../services/account.service';
import { useNavigate } from 'react-router-dom';

export interface Props {
  isPatient?: boolean;
}

const StartPlan = (props: Props) => {
  const { updatePlan } = usePlan();
  const { profile, refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState({
    current: 1,
    label: 'Comenzar'
  });
  const [tempProfile, setTempProfile] = useState<Profile>({
    ...profile,
    name: '',
    preferences: '',
    restrictions: '',
  });
  const { updateNotifications } = useNotifications();
  const navigate = useNavigate();

  const editProfileHandler = () => {
    navigate('/profile');
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(step.current < 5) {
      setStep({ ...step, current: step.current + 1 });
    } else {
      newPlan();
    }
  }

  const stepBackward = () => {
    if(step.current > 1) {
      setStep({ ...step, current: step.current - 1 });
    }
  }

  const newPlan = () => {
    setLoading(true);
    accountService.updateProfile(tempProfile).then(async (result) => {
      if(result.status !== 201) {
        console.log('What happened?');
        setLoading(false);
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        refreshProfile();
        planService.newPlan().then((response) => {
          setLoading(false);
          if(response.status === 200) {
            updatePlan();
          } else {
            updateNotifications({ variant: 'error', message: 'Error al crear el plan, intentalo de nuevo.' });
          }
        })
      }
    });
  };

  const renderStep = () => {
    switch (step.current) {
      case 1:
      default:
        if (props.isPatient) {
          return step1Patient();
        } else {
          step.label = 'Comenzar';
          return step1();
        }

      case 2:
        step.label = 'Siguiente';
        return step2();

      case 3:
        step.label = 'Siguiente';
        return step3();

      case 4:
        step.label = 'Siguiente';
        return step4();

      case 5:
        step.label = 'Crear plan';
        return step5();
    }
  }

  const step1Patient = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="text-left">
          <h1 className="text-3xl">¡Hola! Parece que aún no tenés un plan generado.</h1>
          <p className="mt-8">
            Comunicate con tu nutricionista para que te genere un plan.
          </p>
          <p className="mt-4">
            Mientras tanto, podés empezar agregando tu nombre en el perfil.
          </p>
        </div>
        <div className="mt-8 flex grow items-end">
          <div className="w-full">
            <Button full variant="secondary" onClick={editProfileHandler}>Editar perfil</Button>
          </div>
        </div>
      </div>
    )
  }

  const step1 = () => {
    return (
      <>
        <div>
          <div className="text-left">
            <h1 className="text-3xl">¡Hola! Parece que no tenés un plan generado.</h1>
            <p className="mt-8">
              A continuación te pediremos algunos datos para generar tu plan a medida.
            </p>
          </div>
        </div>
      </>
    )
  }

  const step2 = () => {
    return (
      <>
        <div className="text-left mt-12">
          <h1 className="text-3xl text-primary-main">Te queremos conocer.</h1>
          <div className="mt-4">
            {/* @ts-ignore */}
            <Input label="¿Cómo querés que te llamemos?" name="name" autoFocus value={tempProfile.name} onInput={(ev) => { setTempProfile({...tempProfile, name: ev.target.value}) }} />
          </div>
        </div>
      </>
    )
  }

  const step3 = () => {
    return (
      <>
        <div className="text-left mt-12">
          <h1 className="text-3xl text-primary-main">¿Tenés alguna restriccíon alimenticia?</h1>
          <p className="text-gray-80 mt-8">
            Para que podamos ofrecerte un plan a tu medida, necesitamos saber si tenés alguna restricción alimenticia, alergias o dietas no especistas.
          </p>
          <p className="text-gray-80 mt-4">
            Estas restricciones asisten al sistema para evitar que te ofrezcamos comidas que no puedas/quieras consumir.
          </p>
          <p className="text-gray-80 mt-4">
            En caso de no tener ninguna, podés dejar el campo vacio.
          </p>
          <p className="text-gray-80 mt-4">
            <b>saz!</b> es un sistema inteligente, asi que podés escribirle tus restricciones y el sistema las va a entender.
          </p>
          <hr className="mt-8" />
          <div className="mt-8">
            {/* @ts-ignore */} 
            <Input label="Contanos tus restricciones alimenticias." autoFocus name="restrictions" value={tempProfile.restrictions} onInput={(ev) => { setTempProfile({...tempProfile, restrictions: ev.target.value}) }} />
          </div>
          <div className="mt-4">
            <p className="text-gray-80 mt-8">
              <span className="block mt-3 text-gray-400">Ej: Dieta vegetariana, sin huevos, alergia a las nueces, alergia al gluten.</span>
            </p>
          </div>
        </div>
      </>
    )
  }

  const step4 = () => {
    return (
      <>
        <div className="text-left mt-12">
          <h1 className="text-3xl text-primary-main">¿Tenés alguna meta para tu plan?</h1>
          <p className="text-gray-80 mt-8">
            Éstas nos ayudaran a guiar al sistema sobre tus metas, gustos y preferencias.
          </p>
          <p className="text-gray-80 mt-4">
            <b>saz!</b> es un sistema inteligente, asi que podés escribirle tus metas y el sistema las va a entender.
          </p>
          <hr className="mt-8" />
          <div className="mt-8">
            {/* @ts-ignore */}
            <Input label="Contanos tus preferencias." name="preferences" autoFocus value={tempProfile.preferences} onInput={(ev) => { setTempProfile({...tempProfile, preferences: ev.target.value}) }} />
          </div>
          <div className="mt-4">
            <p className="text-gray-80 mt-8">
              <span className="block mt-3 text-gray-400">Ej: Bajas calorias, alta en proteina. Desayuno fuerte, cena liviana. Meatless mondays. Pizza los sabados. Organizar las cenas de la semana con solo 2 recetas.</span>
            </p>
          </div>
        </div>
      </>
    )
  }

  const step5 = () => {
    return (
      <>
        <div className="text-left mt-12">
          <h1 className="text-3xl text-primary-main">¿Para cuantos comensales?</h1>
          <p className="text-gray-80 mt-8">
            Saber para cuantas personas es el plan, nos ayudará a presentartes ingredientes en cantidades adecuadas.
          </p>
          <p className="text-gray-80 mt-4">
            <b>saz!</b> es un sistema inteligente, asi que podés escribirle tus preferencias con texto y el sistema las va a entender.
          </p>
          <hr className="mt-8" />
          <div className="mt-8">
            {/* @ts-ignore */}
            <Input type="number" label="Comensales:" name="diners" autoFocus value={tempProfile.diners} onInput={(ev) => { setTempProfile({...tempProfile, diners: Math.ceil(Number(ev.target.value))}) }} />
          </div>
        </div>
      </>
    )
  }

  useEffect(() => {

  }, [step.current])

  return (
    <>
    {
      loading ? <Loading action="Estamos generando tu plan" subtext="Tené paciencia, esto puede tardar unos minutos" /> : 
      <div className="px-6 w-full">
        { props.isPatient ? 
          <div
            // @ts-ignore
            style={{'--image-url': `url(${cardGradient})`}}
            className="flex flex-col p-12 bg-[image:var(--image-url)] rounded-lg bg-cover m-row text-white h-full"
          >
            { renderStep() }
          </div> : 
          <form
            onSubmit={submitHandler}
            // @ts-ignore
            style={{'--image-url': `url(${cardGradient})`}}
            className={step.current > 1 ? "flex flex-col justify-between grow h-full" : "flex flex-col p-12 bg-[image:var(--image-url)] rounded-lg bg-cover m-row text-white h-full"}>
            { renderStep() }
            <div className="mt-8 pb-6 flex grow items-end">
              <div className="w-full">
                <Button variant={step.current > 1 ? "primary" : "secondary"} full type={ButtonType.submit}>{ step.label }</Button>
                { step.current > 1 && <Button className="mt-4" variant="secondary" full onClick={() => { stepBackward() }}>Volver</Button> }
              </div>
            </div>
          </form>
        }
      </div>
    }
    </>
  )
}

export default StartPlan