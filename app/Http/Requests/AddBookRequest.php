<?php

namespace App\Http\Requests;

use App\Rules\ValidateBookPrice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class AddBookRequest extends FormRequest
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

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_author' => match ($this->input('is_author')) {
                'true' => true,
                'false' => false,
                'null' => null,
                default => $this->input('is_author'),
            },
            'is_free' => match ($this->input('is_free')) {
                'true' => true,
                'false' => false,
                'null' => null,
                default => $this->input('is_free'),
            },
            'price' => $this->price === 'null' ? null : $this->price,
            'downloadable' => match ($this->input('downloadable')) {
                'true' => true,
                'false' => false,
                default => $this->input('downloadable'),
            },
        ]);
    }


    public function rules(): array
    {
        Log::info('AddBookRequest rules method triggered.');

        return [
            'title' => ['required', 'min:3', 'max:64', 'unique:books,title'],
            'description' => ['required', 'min:50', 'max:2000'],
            'is_author' => ['required', 'boolean', 'present'],
            'is_free' => ['required', 'boolean', 'present'],
            'price' => [new ValidateBookPrice($this->input('is_free'))],
            'language' => ['min:2', 'max:2'],
            'author' => ['required', 'max:80'],
            'downloadable' => ['boolean'],
            'cover' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'book_file' => ['file', 'mimes:pdf', 'max:81920'],
        ];
    }


    protected function failedValidation(Validator $validator): void
    {
        $errors = collect($validator->errors())->map(fn ($messages) => $messages[0]);

        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $errors,
        ], 422));
    }
    protected function passedValidation(): void
    {
        // Capitalize the first letter of the category
        $this->merge([
            'category' => ucfirst($this->input('category')),
        ]);
    }
}
