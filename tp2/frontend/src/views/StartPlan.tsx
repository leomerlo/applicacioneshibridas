import { useEffect, useState }  from 'react';
import { usePlan } from '../contexts/PlanContext';
import { useNotifications } from '../contexts/NotificationsContext';
import EmptyPlanImage from "../assets/girlBowl.png";
import Loading from '../components/Loading';
import planService from '../services/plan.service';
import Button, { ButtonType } from '../components/Button';
import Input from '../components/Input';
import { Profile, useProfile } from '../contexts/ProfileContext';
import accountService from '../services/account.service';

const StartPlan = () => {
  const { updatePlan } = usePlan();
  const { refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState({
    current: 1,
    label: 'Comenzar'
  });
  const [tempProfile, setTempProfile] = useState<Profile>({
    name: '',
    preferences: '',
    restrictions: '',
    diners: 1
  });
  const { updateNotifications } = useNotifications();

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
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        refreshProfile();
        planService.newPlan().then((response) => {
          setLoading(false);
          if(response.status === 201) {
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
        step.label = 'Comenzar';
        return step1();

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

  const step1 = () => {
    return (
      <>
        <div className="text-left mt-8">
          <h1 className="text-3xl text-gray-90">¡Hola! Parece que no tenés un plan generado.</h1>
          <p className="text-gray-80 mt-8">
            A continuación te pediremos algunos datos para generar tu plan a medida.
          </p>
          <p className="text-gray-80 mt-4">
            Todos esto vas a poder modificarlo mas adelante desde tu perfil.
          </p>
        </div>
      </>
    )
  }

  const step2 = () => {
    return (
      <>
        <div className="text-left mt-8">
          <h1 className="text-3xl text-gray-90">Te queremos conocer.</h1>
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
        <div className="text-left mt-8">
          <h1 className="text-3xl text-gray-90">¿Tenés alguna restriccíon alimenticia?</h1>
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
            FoodGenie es un sistema inteligente, asi que podés escribirle tus restricciones con texto y el sistema las va a entender.
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
        <div className="text-left mt-8">
          <div className="text-center">
            <h1 className="text-3xl text-gray-90">¿Tenés alguna preferencia para tu plan?</h1>
            </div>
            <p className="text-gray-80 mt-8">
              Estas preferencias nos ayudar a guiar al sistema sobre tus gustos y preferencias.
            </p>
            <p className="text-gray-80 mt-4">
              FoodGenie es un sistema inteligente, asi que podés escribirle tus preferencias con texto y el sistema las va a entender.
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
        <div className="text-left mt-8">
          <h1 className="text-3xl text-gray-90">¿Para cuantos comensales?</h1>
          <p className="text-gray-80 mt-8">
            Saber para cuantas personas es el plan, nos ayudará a presentartes ingredientes en cantidades adecuadas.
          </p>
          <p className="text-gray-80 mt-4">
            FoodGenie es un sistema inteligente, asi que podés escribirle tus preferencias con texto y el sistema las va a entender.
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
      <div className="w-fit lg:w-6/12 mx-auto flex flex-col h-full">
        <div className="mx-auto w-3/4 mt-8 -translate-x-8">
          <img src={EmptyPlanImage} className="mx-auto" />
        </div>
        <form onSubmit={submitHandler} className="flex flex-col justify-between grow">
          { renderStep() }
          <div className="mt-8 flex grow items-end">
            <div className="w-full">
            <Button full type={ButtonType.submit}>{ step.label }</Button>
            { step.current > 1 ? <Button className="mt-4" variant="secondary" full onClick={() => { stepBackward() }}>Volver</Button> : <></> }
            </div>
          </div>
        </form>
      </div>
    }
    </>
  )
}

export default StartPlan