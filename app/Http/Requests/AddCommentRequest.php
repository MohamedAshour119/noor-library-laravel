<?php

namespace App\Http\Requests;

use App\Traits\HttpResponses;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddCommentRequest extends FormRequest
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
            'body' => ['required', 'max:1000']
        ];
    }
    public function messages(): array
    {
        return [
            'body.required' => __('ShowBook.required', ['attribute' => __('ShowBook.comment_body_empty')]),
            'body.max' => __('ShowBook.max', ['attribute' => __('ShowBook.comment_max_length'), 'max' => 1000]),
        ];
    }
    public function attributes(): array
    {
        return [
            'comment_body_empty' => __('ShowBook.comment_body_empty'),
            'comment_max_length' => __('ShowBook.comment_max_length'),
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->response_error('Validation Failed', ['message' => __('ShowBook.comment_body_empty'),], 422)
        );
    }
}
