<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddOrderRequest;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymobController extends Controller
{
    use HttpResponses;
    public function paymob(AddOrderRequest $request)
    {
        $headers = [
            'Accept' => 'application/json',
            'Authorization' => 'Token ' . env('PAYMOB_SECRET_KEY'), // Example token
        ];
        $payload = [
            'amount' => $request->billing_info['amount'] * 100,
            'currency' => 'EGP',
            'payment_methods' => [4923866],
            'items' => [],
            'billing_data' => [
                "apartment" => "6",
                "first_name" => $request->billing_info['first_name'],
                "last_name" => $request->billing_info['last_name'],
                "street" => $request->billing_info['street'],
                "building" => "939",
                "phone_number" => $request->billing_info['phone_number'],
                "country" => "egypt",
                "email" => "test@gmail.com",
                "floor" => "1",
                "state" => $request->billing_info['city'],
            ],
        ];

        $response = Http::withHeaders($headers)->post('https://accept.paymob.com/v1/intention/', $payload);

        if ($response->successful()) {
            $responseData = $response->json();
            $url = "https://accept.paymob.com/unifiedcheckout/?publicKey=" . env('PAYMOB_PUBLIC_KEY') . "&clientSecret=" . $responseData['client_secret'];
            return $this->response_success(['url' => $url], 'Payment Redirect Url');
        } else {
            return $this->response_error('', ['error' => 'Failed to initialize payment.'], 400);
        }
    }
    public function callback(Request $request)
    {
        $queryParams = $request->all();
        $hmac_secret = env('PAYMOB_HMAC_SECRET');
        $received_hmac = $queryParams['hmac'];

        // Extract the necessary keys into an array
        $data = [
            "amount_cents" => $queryParams['amount_cents'],
            "created_at" => $queryParams['created_at'],
            "currency" => $queryParams['currency'],
            "error_occured" => $queryParams['error_occured'],
            "has_parent_transaction" => $queryParams['has_parent_transaction'],
            "obj.id" => $queryParams['id'],
            "integration_id" => $queryParams['integration_id'],
            "is_3d_secure" => $queryParams['is_3d_secure'],
            "is_auth" => $queryParams['is_auth'],
            "is_capture" => $queryParams['is_capture'],
            "is_refunded" => $queryParams['is_refunded'],
            "is_standalone_payment" => $queryParams['is_standalone_payment'],
            "is_voided" => $queryParams['is_voided'],
            "order.id" => $queryParams['id'],
            "owner" => $queryParams['owner'],
            "pending" => $queryParams['pending'],
            "source_data.pan" => $queryParams['source_data_pan'],
            "source_data.sub_type" => $queryParams['source_data_sub_type'],
            "source_data.type" => $queryParams['source_data_type'],
            "success" => $queryParams['success'],
        ];

        info('========================');
        info('params', [$queryParams]);

        $concatenated_string = '';
        foreach ($data as $key => $value) {
            $concatenated_string .= $value;
        }
        info('$concatenated_string', [$concatenated_string]);

        // Compute the HMAC
        $computed_hmac = hash_hmac('sha512', $concatenated_string, $hmac_secret);
        info('$computed_hmac', [$computed_hmac]);
        info('$received_hmac', [$received_hmac]);

        // Compare the HMAC
        if (hash_equals($computed_hmac, $received_hmac)) {
            info('HMAC is valid');
        } else {
            info('HMAC validation failed');
        }
    }
}
