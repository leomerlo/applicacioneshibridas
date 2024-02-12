import { Request, Response } from 'express';
import { MercadoPagoConfig, PreApprovalPlan, PreApproval } from 'mercadopago';
import { PreApprovalPlanResponse } from 'mercadopago/dist/clients/preApprovalPlan/commonTypes';

const mp = new MercadoPagoConfig({
  accessToken: 'TEST-4038341833403155-021010-50257e63db3d34b3330bd198a0efc9a2-830528',
});

const getPlan = async (): Promise<PreApprovalPlanResponse> => {
  const preApprovalPlan = new PreApprovalPlan(mp);
  const response = await preApprovalPlan.get({ preApprovalPlanId: '2c9380848d698da5018d9d4d256c1fde' })
  return response;
};

const subscribe = async (req: Request, res: Response) => {
  const { id } = await getPlan();

  const preApproval = new PreApproval(mp);
  preApproval.create({ body: {
    preapproval_plan_id: id,
    card_token_id: req.body.card_token_id,
    payer_email: req.body.payer_email
  }}).then((response) => {
    res.status(200).json(response);
  }).catch((error: any) => {
    console.error(error);
    res.status(500).json(error);
  });
};


export { subscribe };