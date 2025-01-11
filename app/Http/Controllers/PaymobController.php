<?php

namespace App\Http\Controllers;

use App\Http\Requests\InitiatePaymentRequest;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymobController extends Controller
{
    use HttpResponses;
    private $api_key;

    public function __construct()
    {
        $this->api_key = env('PAYMOB_API_KEY');
    }

    public function authenticate()
    {
        $response = Http::post('https://accept.paymob.com/api/auth/tokens', [
            'api_key' => $this->api_key,
        ]);

        return response()->json($response->json());
    }
    private function getAuthToken()
    {
        $response = Http::post('https://accept.paymob.com/api/auth/tokens', [
            'api_key' => $this->api_key,
        ]);

        return $response->json()['token'];
    }
    public function createOrder(Request $request)
    {
        $authToken = $this->getAuthToken(); // Call a method to get your auth token
        $orderResponse = Http::post('https://accept.paymob.com/api/ecommerce/orders', [
            'auth_token' => $authToken,
            "api_source" => "INVOICE",
            'amount_cents' => $request->input('amount_cents'),
            'integrations' => [4923866],
            'currency' => 'EGP',
            'items' => [],
            "delivery_needed" => false,
        ]);

        if ($orderResponse->failed()) {
            return  $this->response_error('Payment initiation failed', [], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Create order response',
            'data' => $orderResponse->json(),
        ]);
    }
}
