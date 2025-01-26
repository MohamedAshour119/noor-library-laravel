<?php

namespace App\Http\Requests;

use App\Rules\ValidateBookPrice;
use App\Traits\HttpResponses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class AddBookRequest extends FormRequest
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
        return [
            'title' => ['required', 'min:3', 'max:64'],
            'description' => ['required', 'min:50', 'max:2000'],
            'is_author' => ['required', 'boolean', 'present'],
            'is_free' => ['required', 'boolean', 'present'],
            'price' => [new ValidateBookPrice($this->input('is_free'))],
            'language' => ['min:2', 'max:2'],
            'author' => ['required', 'max:80'],
            'category' => ['required'],
            'downloadable' => ['boolean'],
            'cover' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'book_file' => ['file', 'mimes:pdf', 'max:81920'],
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => __('AddBookValidationMessages.title_required'),
            'title.min' => __('AddBookValidationMessages.title_min_length'),
            'title.max' => __('AddBookValidationMessages.title_max_length'),
            'title.unique' => __('AddBookValidationMessages.title_unique'),

            'description.required' => __('AddBookValidationMessages.description_required'),
            'description.min' => __('AddBookValidationMessages.description_min_length'),
            'description.max' => __('AddBookValidationMessages.description_max_length'),

            'is_author.required' => __('AddBookValidationMessages.is_author_required'),
            'is_author.boolean' => __('AddBookValidationMessages.is_author_boolean'),
            'is_author.present' => __('AddBookValidationMessages.is_author_present'),

            'is_free.required' => __('AddBookValidationMessages.is_free_required'),
            'is_free.boolean' => __('AddBookValidationMessages.is_free_boolean'),
            'is_free.present' => __('AddBookValidationMessages.is_free_present'),

            'price.required' => __('AddBookValidationMessages.price_required'),

            'language.min' => __('AddBookValidationMessages.language_min'),
            'language.max' => __('AddBookValidationMessages.language_max'),

            'author.required' => __('AddBookValidationMessages.author_required'),
            'author.max' => __('AddBookValidationMessages.author_max_length'),

            'category.required' => __('AddBookValidationMessages.category_required'),

            'downloadable.boolean' => __('AddBookValidationMessages.downloadable'),

            'cover.required' => __('AddBookValidationMessages.cover_image_required'),
            'cover.image' => __('AddBookValidationMessages.cover_image_image'),
            'cover.mimes' => __('AddBookValidationMessages.cover_image_mimes'),
            'cover.max' => __('AddBookValidationMessages.cover_image_max_size'),

            'book_file.required' => __('AddBookValidationMessages.file_required'),
            'book_file.file' => __('AddBookValidationMessages.file_file'),
            'book_file.mimes' => __('AddBookValidationMessages.file_mimes'),
            'book_file.max' => __('AddBookValidationMessages.file_max_size'),
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        // Get the failed rules and their error messages
        $failedRules = $validator->failed();
        $errors = $validator->errors()->messages();

        $firstErrors = [];

        foreach ($errors as $field => $messages) {
            if ($field === 'is_free') {
                $firstErrors[$field] = __('AddBookValidationMessages.is_free_attribute');
            } elseif ($field === 'category') {
                $firstErrors[$field] = __('AddBookValidationMessages.category_attribute');
            } elseif ($field === 'author') {
                if (isset($failedRules['author']['Required'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.author_attribute_required');
                } elseif (isset($failedRules['author']['Max'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.author_attribute_max');
                } else {
                    $firstErrors[$field] = $messages[0]; // Fallback for other errors
                }
            } elseif ($field === 'language') {
                if (isset($failedRules['language']['Min'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.language_attribute_min');
                } elseif (isset($failedRules['author']['Max'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.language_attribute_max');
                } else {
                    $firstErrors[$field] = $messages[0]; // Fallback for other errors
                }
            } else {
                $firstErrors[$field] = $messages[0];
            }
        }

        throw new HttpResponseException(
            $this->response_error('Validation failed', $firstErrors, 422)
        );
    }


}
