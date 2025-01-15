<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    protected function prepareForValidation()
    {
        $this->merge([
            'first_name' => $this->input('billing_info.first_name'),
            'last_name' => $this->input('billing_info.last_name'),
            'city' => $this->input('billing_info.city'),
            'street' => $this->input('billing_info.street'),
            'phone_number' => $this->input('billing_info.phone_number'),
            'country_code' => $this->input('billing_info.country_code'),
            'amount' => $this->input('billing_info.amount'),
            'payment_method' => $this->determinePaymentMethod(),
        ]);

        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => ltrim($this->input('phone_number'), '+'), // Remove existing '+' if any
            ]);

            $this->merge([
                'phone_number' => '+' . $this->input('phone_number'),
            ]);
        }
    }

    protected function determinePaymentMethod(): ?string
    {
        if ($this->input('billing_info.cash_on_delivery') === true) {
            return 'cash_on_delivery';
        }

        if ($this->input('billing_info.pay_with_credit_card') === true) {
            return 'credit_card';
        }

        return null; // Default to null if no valid payment method is provided
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'min:3'],
            'last_name' => ['required', 'min:3'],
            'phone_number' => ['required', 'phone'],
            'country_code' => ['required', 'numeric', 'digits_between:1,3', 'required_with:phone_number'],
            'city' => ['required', 'max:40'],
            'street' => ['required', 'max:100'],
            'amount' => ['required', 'numeric'],
            'payment_method' => ['required', Rule::in(['cash_on_delivery', 'credit_card'])],
            'cart_books_ids' => ['required', 'array'],
            'cart_books_ids.*' => ['numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => __('OrderCreationValidationErrors.first_name_required'),
            'first_name.min' => __('OrderCreationValidationErrors.first_name_min'),
            'last_name.required' => __('OrderCreationValidationErrors.last_name_required'),
            'last_name.min' => __('OrderCreationValidationErrors.last_name_min'),
            'phone_number.required' => __('OrderCreationValidationErrors.phone_number_required'),
            'phone_number.phone' => __('OrderCreationValidationErrors.phone_number_invalid'),
            'phone_number.unique' => __('OrderCreationValidationErrors.phone_number_unique'),
            'country_code.required' => __('OrderCreationValidationErrors.country_code_required'),
            'country_code.numeric' => __('OrderCreationValidationErrors.country_code_numeric'),
            'country_code.digits_between' => __('OrderCreationValidationErrors.country_code_length'),
            'country_code.required_with' => __('OrderCreationValidationErrors.country_code_required_with_phone'),
            'city.required' => __('OrderCreationValidationErrors.city_required'),
            'city.max' => __('OrderCreationValidationErrors.city_max'),
            'street.required' => __('OrderCreationValidationErrors.street_required'),
            'street.max' => __('OrderCreationValidationErrors.street_max'),
            'amount.required' => __('OrderCreationValidationErrors.amount_required'),
            'amount.numeric' => __('OrderCreationValidationErrors.amount_numeric'),
            'payment_method.required' => __('OrderCreationValidationErrors.payment_method_required'),
            'payment_method.in' => __('OrderCreationValidationErrors.payment_method_invalid'),
            'cart_books_ids.required' => __('OrderCreationValidationErrors.cart_books_ids_required'),
            'cart_books_ids.array' => __('OrderCreationValidationErrors.cart_books_ids_array'),
            'cart_books_ids.*.numeric' => __('OrderCreationValidationErrors.cart_books_ids_numeric'),
        ];
    }

}
