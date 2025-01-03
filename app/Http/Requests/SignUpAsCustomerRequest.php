<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
use App\Rules\ValidPhoneNumber;
use App\Traits\HttpResponses;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class SignUpAsCustomerRequest extends FormRequest
{
    use HttpResponses;
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
    public function rules(): array
    {
        return [
            'username' => ['required', 'unique:users,username', 'min:3', 'max:16'],
            'first_name' => ['required', 'min:3', 'max:20'],
            'last_name' => ['required', 'min:3', 'max:20'],
            'phone_number' => ['required', 'phone', 'unique:users,phone'],
            'country_code' => ['required', 'numeric', 'digits_between:1,3', 'required_with:phone_number'],
            'email' => ['email', 'unique:users,email', 'required'],
            'password' => ['required', 'min:8', 'max:64', 'confirmed'],
            'google_recaptcha' => ['required', 'string', new Recaptcha],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.username_attribute')]),
            'username.unique' => __('AuthValidationMessages.unique', ['attribute' => __('AuthValidationMessages.username_attribute')]),
            'username.min' => __('AuthValidationMessages.min', ['attribute' => __('AuthValidationMessages.username_attribute'), 'min' => 3]),
            'username.max' => __('AuthValidationMessages.max', ['attribute' => __('AuthValidationMessages.username_attribute'), 'max' => 16]),

            'first_name.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.first_name_attribute')]),
            'first_name.min' => __('AuthValidationMessages.min', ['attribute' => __('AuthValidationMessages.first_name_attribute'), 'min' => 3]),
            'first_name.max' => __('AuthValidationMessages.max', ['attribute' => __('AuthValidationMessages.first_name_attribute'), 'max' => 20]),

            'last_name.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.last_name_attribute')]),
            'last_name.min' => __('AuthValidationMessages.min', ['attribute' => __('AuthValidationMessages.last_name_attribute'), 'min' => 3]),
            'last_name.max' => __('AuthValidationMessages.max', ['attribute' => __('AuthValidationMessages.last_name_attribute'), 'max' => 20]),

            'phone_number.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.phone_number_attribute')]),
            'phone_number.phone' => __('AuthValidationMessages.phone', ['attribute' => __('AuthValidationMessages.phone_number_attribute')]),
            'phone_number.unique' => __('AuthValidationMessages.unique', ['attribute' => __('AuthValidationMessages.phone_number_attribute')]),

            'country_code.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.country_code_attribute')]),
            'country_code.numeric' => __('AuthValidationMessages.numeric', ['attribute' => __('AuthValidationMessages.country_code_attribute')]),
            'country_code.digits_between' => __('AuthValidationMessages.digits_between', ['attribute' => __('AuthValidationMessages.country_code_attribute'), 'min' => 1, 'max' => 3]),

            'email.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.email_attribute')]),
            'email.email' => __('AuthValidationMessages.email', ['attribute' => __('AuthValidationMessages.email_attribute')]),
            'email.unique' => __('AuthValidationMessages.unique', ['attribute' => __('AuthValidationMessages.email_attribute')]),

            'password.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.password_attribute')]),
            'password.min' => __('AuthValidationMessages.min', ['attribute' => __('AuthValidationMessages.password_attribute'), 'min' => 8]),
            'password.max' => __('AuthValidationMessages.max', ['attribute' => __('AuthValidationMessages.password_attribute'), 'max' => 64]),
            'password.confirmed' => __('AuthValidationMessages.confirmed', ['attribute' => __('AuthValidationMessages.password_attribute')]),

            'google_recaptcha.required' => __('AuthValidationMessages.required', ['attribute' => __('AuthValidationMessages.google_recaptcha_attribute')]),
        ];
    }

    public function attributes(): array
    {
        return [
            'username' => __('AuthValidationMessages.username_attribute'),
            'first_name' => __('AuthValidationMessages.first_name_attribute'),
            'last_name' => __('AuthValidationMessages.last_name_attribute'),
            'phone_number' => __('AuthValidationMessages.phone_number_attribute'),
            'country_code' => __('AuthValidationMessages.country_code_attribute'),
            'email' => __('AuthValidationMessages.email_attribute'),
            'password' => __('AuthValidationMessages.password_attribute'),
            'google_recaptcha' => __('AuthValidationMessages.google_recaptcha_attribute'),
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        // Get the first error from each field
        $errors = $validator->errors()->messages();

        // Filter to get the first error for each field
        $firstErrors = [];

        foreach ($errors as $field => $messages) {
            // Check if the field is google_recaptcha and if it failed the 'required' rule
            if ($field == 'google_recaptcha') {
                // Custom message for google_recaptcha, overriding the default one
                $firstErrors[$field] = __('AuthValidationMessages.google_recaptcha_attribute');
            } else {
                // For other fields, send the first error message
                $firstErrors[$field] = $messages[0];
            }
        }

        // Throw the validation exception with the filtered errors
        throw new HttpResponseException(
            $this->response_error('Validation failed', $firstErrors, 422)
        );
    }


    protected function prepareForValidation()
    {
        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => ltrim($this->input('phone_number'), '+'), // Remove existing '+' if any
            ]);

            $this->merge([
                'phone_number' => '+' . $this->input('phone_number'),
            ]);
        }
    }
}
