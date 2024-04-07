import { CardPayment } from '@mercadopago/sdk-react'
import { subscribe } from '../services/subscription.service';
import { useNavigate } from 'react-router-dom';
import girlBowl from '../assets/girlBowl.png';
import GoBack from '../components/GoBack';

const Block = ({ title, description }) => (
  <div className="bg-white p-4 shadow-md rounded-lg">
    <h3 className="text-primary-main text-lg mb-2">{title}</h3>
    <p className="text-gray-90">{description}</p>
  </div>
);

const Subscription = () => {
  const navigate = useNavigate();

  const submitHandler = async (param: any) => {
    const response = await subscribe(param);
    if (response.status === 201) {
      navigate('/subscription/success');
    } else {
      navigate('/subscription/error');
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between">
            <GoBack />
        </div>
        <div className="flex justify-between mt-12">
          <div className="md:w-1/2">
            <span className="text-primary-main font-bold">Tecnología avanzada y atención personalizada</span>
            <h1 className="text-6xl my-8 text-primary-main">SAZ! para nutricionistas</h1>
            <p className="w-3/4">Con nuestro servicio premium para nutricionistas, no solo obtienes herramientas poderosas para mejorar la atención a tus pacientes, también obtienes un socio confiable para hacer crecer tu práctica. Con una combinación de tecnología avanzada y atención personalizada, estamos aquí para ayudarte a alcanzar tus objetivos profesionales y brindar un impacto positivo en la salud de tus clientes.</p>
          </div>
          <div className="hidden md:block">
            <img src={girlBowl} aria-hidden="true" />
          </div>
        </div>
        <div className="mt-12 md:mt-32">
          <div className="flex flex-col md:flex-row justify-evenly gap-8 md:gap-24">
           <Block
              title="Administración de Pacientes Simplificada"
              description="Gestiona fácilmente a tus pacientes y sus datos con nuestra plataforma intuitiva. Mantén un registro detallado de su progreso y adapta sus planes de comidas según sea necesario para alcanzar sus objetivos de salud."
            />
            <Block
              title="Creación de Planes Personalizados"
              description="Diseña planes de comidas adaptados a las necesidades individuales de tus pacientes. Desde restricciones dietéticas hasta preferencias culinarias, nuestros planes se ajustan perfectamente a cada cliente para maximizar los resultados."
            />
            <Block
              title="Integración sin Problemas"
              description="Conecta nuestra plataforma con la de tus pacientes de manera rápida y sencilla. Facilita la comunicación y el intercambio de información para garantizar una experiencia de usuario perfecta y una colaboración efectiva."
            />
          </div>
        </div>
        <div className="mt-6 mb-16">
          <p className="text-gray-700 text-2xl md:w-2/3 mx-auto my-12">¡Descubre una experiencia de nutrición personalizada como ninguna otra! Nuestro servicio premium te ofrece todas las herramientas que necesitas para llevar tu práctica al siguiente nivel.</p>
          <div className="flex justify-end my-6">
            <p className="text-2xl font-semibold text-gray-800">Precio Anual: $120,000</p>
          </div>
        </div>
        <div>
          
        </div>
        <div className="shadow-lg">
          <CardPayment
            initialization={{ amount: 10000 }}
            customization={{ paymentMethods: { maxInstallments: 1 }}}
            onSubmit={submitHandler}
          />
        </div>
      </div>
    </>
  );
};
export default Subscription;