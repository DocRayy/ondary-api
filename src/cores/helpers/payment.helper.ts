// import { HttpService } from '@nestjs/axios';
// import { Injectable } from '@nestjs/common';
// import { Buffer } from 'buffer';
// import { lastValueFrom } from 'rxjs';
// import Stripe from 'stripe';

// @Injectable()
// export class PaymentHelper {
//   protected httpService: HttpService;

//   constructor() {
//     this.httpService = new HttpService();
//   }

//   async getPaypalToken() {
//     const basic = Buffer.from(
//       process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET,
//     ).toString('base64');

//     const requestToken = this.httpService.post(
//       `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
//       'grant_type=client_credentials',
//       { headers: { Authorization: `Basic ${basic}` } },
//     );

//     const responseToken = await lastValueFrom(requestToken);
//     if (responseToken.data.status_code > 299) {
//       throw Error(responseToken.data.message);
//     }

//     return responseToken.data.access_token;
//   }

//   async paypal(payload) {
//     const accessToken = await this.getPaypalToken();

//     const requestPaypal = this.httpService.post(
//       `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
//       payload,
//       {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           prefer: 'return=minimal',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );

//     const responsePaypal = await lastValueFrom(requestPaypal);
//     if (responsePaypal.data.status_code > 299) {
//       throw Error(responsePaypal.data.message);
//     }

//     return responsePaypal.data;
//   }

//   async stripe(payload) {
//     const stripe = new Stripe(process.env.STRIPE_SECRET);
//     const session = await stripe.checkout.sessions.create(payload);
//     return session;
//   }
// }
