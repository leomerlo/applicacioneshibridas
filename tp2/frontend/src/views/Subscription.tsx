import { CardPayment } from '@mercadopago/sdk-react'
import { subscribe } from '../services/subscription.service';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const navigate = useNavigate();

  const submitHandler = async (param: any) => {
    const response = await subscribe(param);
    if (response.status === 201) {
      navigate('/profile');
    } else {
      navigate('/subscribe');
    }
  }

  return (
    <>
      <CardPayment
        initialization={{ amount: 10000 }}
        customization={{ paymentMethods: { maxInstallments: 1 }}}
        onSubmit={submitHandler}
      />
    </>
  );
};
export default Subscription;