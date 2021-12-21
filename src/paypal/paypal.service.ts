import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ItemEntity } from 'src/item/entities/item.entity';

@Injectable()
export class PaypalService {
  private userId: string;
  private userSercret: string;
  private token: string;
  private expiresAt: number;

  constructor() {
    // PAYPAL_USERID=ATlR2Z93FdjrdVRV9VVoeZmr9fN_4jksKuy8mMosCuWx2dA07EwulE5EKw3yA3mj94D5YhdaZ5U9TRpc
    // PAYPAY_USERSECRET=ECx-if7e0OGjv-P9tmGWHghCab5je4c1FoMCvA1aiQWYcTUbuVP4PkRTlvQ9GB0ZysRxz7uuDT9NB-0O
    // PAYPAL_URL=https://api.sandbox.paypal.com

    this.userId =
      'ATlR2Z93FdjrdVRV9VVoeZmr9fN_4jksKuy8mMosCuWx2dA07EwulE5EKw3yA3mj94D5YhdaZ5U9TRpc';
    this.userSercret =
      'EBRnZ_a-1mc9FQtXSONRK5jbAmmLtO5P6vakbJGgBZTdRiQOyPtgaXyFJRdhi7j7Q1roQ2uAMmNnAAtj';
    this.createBearer(this.userId, this.userSercret);
  }
  private async createBearer(userId: string, userSercret: string) {
    const response = await axios({
      url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
      method: 'POST',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      },
      auth: {
        username: userId,
        password: userSercret,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });
    this.token = `${response.data.token_type} ${response.data.access_token}`;
    this.expiresAt =
      Math.round(+new Date() / 1000) + response.data.expires_in - 60;
  }
  private tokenExpired(): boolean {
    return this.expiresAt <= Math.round(+new Date() / 1000) ? true : false;
  }
  async orderDetail(id: string) {
    const response = await axios({
      method: 'GET',
      url: 'https://api.sandbox.paypal.com/v2/checkout/orders/' + id,
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json',
      },
    });
  }
  async getBearer() {
    return this.token;
  }
  async createOrder(item: ItemEntity) {
    if (this.tokenExpired()) this.createBearer(this.userId, this.userSercret);
    console.log(this.token);
    const response = await axios({
      method: 'POST',
      url: 'https://api.sandbox.paypal.com/v2/checkout/orders/',
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json',
      },
      data: {
        intent: 'CAPTURE',
        payer: {
          name: {
            given_name: 'tom',
            surname: 'tomsen',
          },
        },
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: item.cost,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: item.cost,
                },
              },
            },
            description: item.description,
            invoice_id: '583237525325732',

            items: [
              {
                name: item.name,
                quantity: 1,
                description: item.description,
                unit_amount: {
                  currency_code: 'EUR',
                  value: item.cost,
                },
              },
            ],
          },
        ],
        application_context: {
          locale: 'de-DE',
          brand_name: 'Item Shop',
          landing_page: 'NO_PREFERENCE',
          shipping_preference: 'NO_SHIPPING',
          return_url: 'https://www.google.com/?success=true',
          cancel_url: 'https://www.google.com/?success=false',
        },
      },
    });
    return response.data;
  }
}
