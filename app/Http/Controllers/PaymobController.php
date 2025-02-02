<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddOrderRequest;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class PaymobController extends Controller
{
    use HttpResponses;
    public function paymob(AddOrderRequest $request)
    {
        $request->validate([
            'cart_books_ids' => ['array', 'required', 'min:1']
        ]);

        $headers = [
            'Accept' => 'application/json',
            'Authorization' => 'Token ' . env('PAYMOB_SECRET_KEY'),
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
            $data = $request->billing_info;

            $data['payment_method'] = $request->payment_method;
            info('======================');
            Transaction::create([
                'billing_info' => $data,
                'cart_books_ids' => $request->cart_books_ids,
                'order_id' => $responseData['payment_keys'][0]['order_id'],
            ]);

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
            "order.id" => $queryParams['order'],
            "owner" => $queryParams['owner'],
            "pending" => $queryParams['pending'],
            "source_data.pan" => $queryParams['source_data_pan'],
            "source_data.sub_type" => $queryParams['source_data_sub_type'],
            "source_data.type" => $queryParams['source_data_type'],
            "success" => $queryParams['success'],
        ];

        $concatenated_string = '';
        foreach ($data as $key => $value) {
            $concatenated_string .= $value;
        }
        // Compute the HMAC
        $computed_hmac = hash_hmac('sha512', $concatenated_string, $hmac_secret);

        $order_id = $queryParams['order'];
        $billing_info = Transaction::where('order_id', $order_id)->first();

        $billing_info_param = [
            'billing_info' => $billing_info['billing_info'],
            'cart_books_ids' => $billing_info['cart_books_ids'],
        ];
        info('$billing_info_param', [$billing_info_param]);
        $this->addOrder($billing_info_param);

        if (hash_equals($computed_hmac, $received_hmac)) {
            return redirect()->to('http://localhost:8000/checkout' . '?status=success');
        } else {
            return redirect()->to('http://localhost:8000/checkout' . '?status=failure');
        }
    }

    private function addOrder($data)
    {
        $user = User::find($data['billing_info']['id']);
        info('$data', [$data]);
        info('billing_info', [$data['billing_info']]);
        $items_ids = $data['cart_books_ids'];
        $order = Order::create([
            'first_name' => $data['billing_info']['first_name'],
            'last_name' => $data['billing_info']['last_name'],
            'city' => $data['billing_info']['city'],
            'street' => $data['billing_info']['street'],
            'phone' => $data['billing_info']['phone_number'],
            'amount' => $data['billing_info']['amount'],
            'payment_method' => $data['billing_info']['payment_method'],
            'user_id' => $user->id,
        ]);

        // Prepare data with timestamps for each book
        $timestamp = now();
        $attachData = collect($items_ids)->mapWithKeys(function ($id) use ($timestamp) {
            return [$id => ['created_at' => $timestamp, 'updated_at' => $timestamp]];
        })->toArray();

        // Attach with timestamps
        $order->books()->attach($attachData);
    }
}
