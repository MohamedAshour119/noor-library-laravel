<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            "Fiction" => ['en' => 'Fiction', 'ar' => 'خيال', 'fr' => 'Fiction'],
            "Non-Fiction" => ['en' => 'Non-Fiction', 'ar' => 'غير خيال', 'fr' => 'Non-fiction'],
            "Mystery" => ['en' => 'Mystery', 'ar' => 'غموض', 'fr' => 'Mystère'],
            "Fantasy" => ['en' => 'Fantasy', 'ar' => 'خيال', 'fr' => 'Fantaisie'],
            "Science Fiction" => ['en' => 'Science Fiction', 'ar' => 'خيال علمي', 'fr' => 'Science-fiction'],
            "Biography" => ['en' => 'Biography', 'ar' => 'سيرة ذاتية', 'fr' => 'Biographie'],
            "History" => ['en' => 'History', 'ar' => 'تاريخ', 'fr' => 'Histoire'],
            "Romance" => ['en' => 'Romance', 'ar' => 'رومانسية', 'fr' => 'Romance'],
            "Self-Help" => ['en' => 'Self-Help', 'ar' => 'مساعدة ذاتية', 'fr' => 'Développement personnel'],
            "Philosophy" => ['en' => 'Philosophy', 'ar' => 'فلسفة', 'fr' => 'Philosophie'],
            "Psychology" => ['en' => 'Psychology', 'ar' => 'علم النفس', 'fr' => 'Psychologie'],
            "Poetry" => ['en' => 'Poetry', 'ar' => 'شعر', 'fr' => 'Poésie'],
            "Horror" => ['en' => 'Horror', 'ar' => 'رعب', 'fr' => 'Horreur'],
            "Thriller" => ['en' => 'Thriller', 'ar' => 'إثارة', 'fr' => 'Thriller'],
            "Children" => ['en' => 'Children', 'ar' => 'أطفال', 'fr' => 'Enfants'],
            "Young Adult" => ['en' => 'Young Adult', 'ar' => 'شاب بالغ', 'fr' => 'Jeune adulte'],
            "Art" => ['en' => 'Art', 'ar' => 'فن', 'fr' => 'Art'],
            "Cookbooks" => ['en' => 'Cookbooks', 'ar' => 'كتب طبخ', 'fr' => 'Livres de cuisine'],
            "Comics" => ['en' => 'Comics', 'ar' => 'قصص مصورة', 'fr' => 'Bandes dessinées'],
            "Graphic Novels" => ['en' => 'Graphic Novels', 'ar' => 'روايات مصورة', 'fr' => 'Romans graphiques'],
            "Travel" => ['en' => 'Travel', 'ar' => 'سفر', 'fr' => 'Voyage'],
            "Science" => ['en' => 'Science', 'ar' => 'علم', 'fr' => 'Science'],
            "Business" => ['en' => 'Business', 'ar' => 'عمل', 'fr' => 'Affaires'],
            "Spirituality" => ['en' => 'Spirituality', 'ar' => 'روحانية', 'fr' => 'Spiritualité'],
            "Sports" => ['en' => 'Sports', 'ar' => 'رياضة', 'fr' => 'Sports'],
            "Education" => ['en' => 'Education', 'ar' => 'تعليم', 'fr' => 'Éducation'],
            "Drama" => ['en' => 'Drama', 'ar' => 'دراما', 'fr' => 'Drame'],
            "Humor" => ['en' => 'Humor', 'ar' => 'فكاهة', 'fr' => 'Humour'],
            "Technology" => ['en' => 'Technology', 'ar' => 'تكنولوجيا', 'fr' => 'Technologie'],
            "Politics" => ['en' => 'Politics', 'ar' => 'سياسة', 'fr' => 'Politique']
        ];

        foreach ($categories as $translations) {
            $slugs = [
                'en' => Str::slug($translations['en']),
                'ar' => $this->createArabicSlug($translations['ar']),
                'fr' => Str::slug($translations['fr']),
            ];

            Category::firstOrCreate([
                'name' => $translations,
                'slug' => json_encode($slugs, JSON_UNESCAPED_UNICODE),
            ]);
        }
    }
    private function createArabicSlug(string $text): string
    {
        return str_replace(' ', '-', $text);
    }
}
