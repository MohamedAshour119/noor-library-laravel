<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddOrderRequest;
use App\Models\Order;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrdersController extends Controller
{
    use HttpResponses;

    public function addOrder(AddOrderRequest $request)
    {
        $items_ids = $request->cart_books_ids;
        $order = Order::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'city' => $request->city,
            'street' => $request->street,
            'phone' => $request->phone_number,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'user_id' => Auth::id(),
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
