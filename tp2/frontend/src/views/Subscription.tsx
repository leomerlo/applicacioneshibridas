import { useEffect } from 'react';
import { CardPayment } from '@mercadopago/sdk-react'
import { getPreferences } from '../services/subscription.service';

const Subscription = () => {
  useEffect(() => {
    getPreferences().then((response) => {
      if(response.status === 200) {
        console.log(response);
      } else {
        throw new Error('Error fetching preferences');
      }
    });
  }, []);
  

  return (
    <>
      <CardPayment
        initialization={{ amount: 10000 }}
        onSubmit={async (param) => {
          console.log(param);
        }}
      />
    </>
  );
};
export default Subscription;