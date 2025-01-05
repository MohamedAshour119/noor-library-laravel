<?php

namespace Database\Seeders;

use App\Models\Option;
use Illuminate\Database\Seeder;
use Stichoza\GoogleTranslate\GoogleTranslate;

class OptionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the list of languages to translate
        $languages = [
            "English", "Mandarin Chinese", "Hindi", "Spanish", "French",
            "Standard Arabic", "Bengali", "Russian", "Portuguese", "Urdu",
            "Indonesian", "German", "Japanese", "Swahili", "Marathi",
            "Telugu", "Turkish", "Wu Chinese (Shanghainese)", "Korean", "Tamil",
            "Vietnamese", "Hausa", "Javanese", "Italian", "Gujarati",
            "Kannada", "Thai", "Burmese", "Persian (Farsi)", "Polish",
            "Ukrainian", "Malayalam", "Amharic", "Odia (Oriya)", "Hakka Chinese",
            "Punjabi (Western)", "Yoruba", "Sudanese Arabic", "Cantonese Chinese", "Igbo",
            "Romanian", "Dutch", "Serbo-Croatian", "Tagalog", "Malagasy",
            "Sinhalese", "Chittagonian", "Somali", "Nepali", "Assamese",
            "Zhuang", "Khmer", "Mandinka", "Pashto", "Sunda",
            "Azerbaijani", "Fula (Fulani)", "Cebuano", "Bavarian", "Xhosa",
            "Quechua", "Shona", "Tigrinya", "Balochi", "Min Dong Chinese",
            "Gan Chinese", "Mossi", "Kazakh", "Chichewa (Nyanja)", "Haitian Creole",
            "Kurdish", "Zulu", "Berber", "Bashkir", "Luxembourgish",
            "Tswana", "Sotho", "Twi", "Akan", "Kirundi",
            "Lao", "Kinyarwanda", "Uzbek", "Gaelic (Irish)", "Tongan",
            "Maori", "Fijian", "Malti (Maltese)", "Wolof", "Tsonga",
            "Tajik", "Slovak", "Catalan", "Danish", "Estonian",
            "Latvian", "Lithuanian", "Belarusian", "Icelandic", "Sami",
            "Luxembourgish", "Scottish Gaelic", "Corsican", "Breton", "Frisian"
        ];

        // Target languages for translation
        $targetLanguages = ['ar', 'fr', 'en'];

        // Add language options
        foreach ($languages as $language) {
            $translations = []; // Initialize translations array

            foreach ($targetLanguages as $target) {
                $translator = new GoogleTranslate();
                $translator->setTarget($target);

                try {
                    // Directly assign translation to the array without nesting
                    $translations[$target] = $translator->translate($language);
                } catch (\Exception $e) {
                    $translations[$target] = $language; // Fallback to original label
                }
            }

            // Insert into the database using Option model
            Option::create([
                'label' => $translations, // Store as an actual JSON object
                'value' => strtolower(substr($translations['en'], 0, 2)), // First 2 characters of English label
                'type' => 'language'
            ]);
        }

        // Add 'Yes' and 'No' options
        $booleanOptions = [
            [
                'label' => ['ar' => 'نعم', 'fr' => 'Oui', 'en' => 'Yes'],
                'value' => 'yes',
                'type' => 'boolean'
            ],
            [
                'label' => ['ar' => 'لا', 'fr' => 'Non', 'en' => 'No'],
                'value' => 'no',
                'type' => 'boolean'
            ]
        ];

        foreach ($booleanOptions as $option) {
            Option::create($option);
        }

        // Add categories
        $categories = [
            "Fiction", "Non-Fiction", "Mystery", "Fantasy", "Science Fiction",
            "Biography", "History", "Romance", "Self-Help", "Philosophy", "Psychology", "Poetry", "Horror",
            "Thriller", "Children", "Young Adult", "Art", "Cookbooks", "Comics", "Graphic Novels", "Travel",
            "Science", "Business", "Spirituality", "Sports", "Education", "Drama", "Humor", "Technology", "Politics"
        ];

        foreach ($categories as $category) {
            $translations = [];

            foreach ($targetLanguages as $target) {
                $translator = new GoogleTranslate();
                $translator->setTarget($target);

                try {
                    $translations[$target] = $translator->translate($category);
                } catch (\Exception $e) {
                    $translations[$target] = $category; // Fallback to original label
                }
            }

            // Convert the category value to lowercase and handle hyphenated words
            $value = strtolower(preg_replace('/([a-zA-Z])([A-Z])/', '$1-$2', $category));
            $value = strtolower(str_replace(' ', '-', $value)); // Replace spaces with hyphens

            // Insert into the database using Option model
            Option::create([
                'label' => $translations, // Store as actual JSON object
                'value' => $value, // Value with lowercase characters and hyphens
                'type' => 'category'
            ]);
        }
    }
}
